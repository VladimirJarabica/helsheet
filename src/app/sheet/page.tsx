"use server";
import { currentUser } from "@clerk/nextjs/server";
import { SheetAccess, SongAuthorType } from "@prisma/client";
import { dbClient } from "../../services/db";
import { parseFilter } from "../../utils/filter";
import { notEmpty } from "../../utils/fnUtils";
import { getOrCreateUser } from "../../utils/user";
import { getSongAuthors } from "../components/actions";
import Filter from "../components/Filter";
import SheetPreview from "../components/SheetPreview";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const authUser = await currentUser();
  const user = authUser ? await getOrCreateUser(authUser.id) : null;

  const searchParamsValue = await searchParams;

  const filter = parseFilter(searchParamsValue);
  console.log("filter", searchParamsValue, filter);

  const authors = await getSongAuthors();

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
    },
    where: {
      AND: [
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
            user ? { sheetAuthorId: user.id } : null,
          ].filter(notEmpty),
        },
      ].filter(notEmpty),
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col max-w-[700px] w-11/12 gap-2">
      <Filter songAuthors={authors} />
      {sheets.map((sheet) => (
        <SheetPreview key={sheet.id} sheet={sheet} />
      ))}
    </div>
  );
}
