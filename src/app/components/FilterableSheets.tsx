"use server";
import { SheetAccess, SongAuthorType, User } from "@prisma/client";
import { dbClient } from "../../services/db";
import { parseFilter } from "../../utils/filter";
import { getSongAuthors } from "./actions";
import Filter from "./Filter";
import SheetPreview from "./SheetPreview";
import { notEmpty } from "../../utils/fnUtils";

interface FilterableSheetsProps {
  searchParams: Record<string, string>;
  currentUser?: Pick<User, "id"> | null;
  onlyCurrentUserSheets?: boolean;
}

const FilterableSheets = async ({
  searchParams,
  currentUser,
  onlyCurrentUserSheets,
}: FilterableSheetsProps) => {
  const authors = await getSongAuthors();

  const filter = parseFilter(searchParams);

  const sheets = await dbClient.sheet.findMany({
    select: {
      id: true,
      name: true,
      SheetAuthor: { select: { id: true, nickname: true } },
      songAuthorType: true,
      songAuthor: true,
      country: true,
      genre: true,
      tuning: true,
      timeSignature: true,
      scale: true,
      access: true,
    },
    where: {
      AND: [
        onlyCurrentUserSheets && currentUser
          ? { sheetAuthorId: currentUser.id }
          : null,
        filter.country ? { country: filter.country } : null,
        filter.genre ? { genre: filter.genre } : null,
        filter.tuning ? { tuning: filter.tuning } : null,
        filter.scale ? { scale: filter.scale } : null,
        filter.songAuthor
          ? {
              songAuthorType:
                filter.songAuthor === SongAuthorType.folk_song
                  ? SongAuthorType.folk_song
                  : SongAuthorType.original_song,
              songAuthor:
                filter.songAuthor === SongAuthorType.folk_song
                  ? undefined
                  : { contains: filter.songAuthor },
            }
          : null,
        {
          OR: [
            { access: SheetAccess.public },
            currentUser ? { sheetAuthorId: currentUser.id } : null,
          ].filter(notEmpty),
        },
      ].filter(notEmpty),
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-3">
      <Filter songAuthors={authors} />
      {sheets.map((sheet) => (
        <SheetPreview
          key={sheet.id}
          sheet={sheet}
          showPrivate={onlyCurrentUserSheets}
        />
      ))}
    </div>
  );
};

export default FilterableSheets;
