"use server";
import { currentUser } from "@clerk/nextjs/server";
import { SheetAccess, SongAuthorType, User } from "@prisma/client";
import { dbClient } from "../../services/db";
import { FilterSortBy, parseFilter } from "../../utils/filter";
import { notEmpty } from "../../utils/fnUtils";
import { getSongAuthors } from "./actions";
import Filter from "./Filter";
import SheetPreview from "./SheetPreview";

interface FilterableSheetsProps {
  searchParams: Record<string, string>;
  user?: Pick<User, "id"> | null;
}

const FilterableSheets = async ({
  searchParams,
  user,
}: FilterableSheetsProps) => {
  const authors = await getSongAuthors();
  const authUser = await currentUser();

  const showPrivate = !!user && user.id === authUser?.id;

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
        user
          ? {
              sheetAuthorId: user.id,
              access: showPrivate ? undefined : SheetAccess.public,
            }
          : {
              OR: [
                { access: SheetAccess.public },
                authUser ? { sheetAuthorId: authUser.id } : null,
              ].filter(notEmpty),
            },
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
        ,
      ].filter(notEmpty),
    },
    orderBy: {
      ...(filter.sortBy === FilterSortBy.name && { name: filter.sortByOrder }),
      ...(filter.sortBy === FilterSortBy.date_created && {
        createdAt: filter.sortByOrder,
      }),
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Filter songAuthors={authors} filter={filter} />
      {sheets.map((sheet) => (
        <SheetPreview key={sheet.id} sheet={sheet} showPrivate={showPrivate} />
      ))}
    </div>
  );
};

export default FilterableSheets;
