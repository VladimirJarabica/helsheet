"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Genre, SheetAccess, SongAuthorType } from "@prisma/client";
import Link from "next/link";
import { dbClient } from "../../services/db";
import {
  AUTHOR_TYPE_VALUE,
  COUNTRY_VALUE,
  GENRE_VALUE,
  TIME_SIGNATURE_VALUE,
} from "../../utils/consts";
import { parseFilter } from "../../utils/filter";
import { notEmpty } from "../../utils/fnUtils";
import { formatScaleId } from "../../utils/scale";
import { getSheetUrl } from "../../utils/sheet";
import { getOrCreateUser } from "../../utils/user";
import TagPill from "./../components/TagPill";
import Filter from "../components/Filter";
import { getSongAuthors } from "../components/actions";

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
      SheetAuthor: { select: { nickname: true } },
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
    <div className="flex flex-col max-w-[700px] w-11/12">
      <Filter songAuthors={authors} />
      {sheets.map((sheet) => (
        <Link
          key={sheet.id}
          href={getSheetUrl(sheet)}
          className="shadow-md hover:shadow transition-shadow rounded-sm p-4 mt-4 border border-zinc-200 flex items-center justify-between"
        >
          <div>
            <span className="font-bold">{sheet.name}</span>
            <div className="flex mt-1 gap-1">
              {sheet.scale && <TagPill>{formatScaleId(sheet.scale)}</TagPill>}
              <TagPill>{sheet.tuning}</TagPill>
              <TagPill>{TIME_SIGNATURE_VALUE[sheet.timeSignature]}</TagPill>
              {sheet.country && (
                <TagPill>{COUNTRY_VALUE[sheet.country]}</TagPill>
              )}
              {sheet.songAuthorType && (
                <TagPill>
                  {sheet.songAuthorType && sheet.songAuthor
                    ? sheet.songAuthor
                    : AUTHOR_TYPE_VALUE[sheet.songAuthorType]}
                </TagPill>
              )}
              {sheet.genre &&
                // Do not show two "folk music" tags
                (sheet.genre !== Genre.folk_music ||
                  sheet.songAuthorType !== SongAuthorType.folk_song) && (
                  <TagPill>{GENRE_VALUE[sheet.genre]}</TagPill>
                )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              zapísal ({sheet.SheetAuthor.nickname})
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
