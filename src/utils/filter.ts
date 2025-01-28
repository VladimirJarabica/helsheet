import { Country, Genre, Scale, SongAuthorType, Tuning } from "@prisma/client";

export type FilterValue = {
  country?: Country;
  genre?: Genre;
  tuning?: Tuning;
  scale?: Scale;
  songAuthor?: Extract<SongAuthorType, "folk_song"> | string;
};
export type FilterKey = keyof FilterValue;

export const parseFilter = (
  searchParams: Record<keyof FilterValue, string>
): FilterValue => {
  const country = searchParams.country
    ? Country[searchParams.country as keyof typeof Country]
    : undefined;
  const genre = searchParams.genre
    ? Genre[searchParams.genre as keyof typeof Genre]
    : undefined;
  const tuning = searchParams.tuning
    ? Tuning[searchParams.tuning as keyof typeof Tuning]
    : undefined;
  const scale = searchParams.scale
    ? Scale[searchParams.scale as keyof typeof Scale]
    : undefined;
  const songAuthor = searchParams.songAuthor
    ? SongAuthorType[searchParams.songAuthor as keyof typeof SongAuthorType] ??
      searchParams.songAuthor
    : undefined;

  return { country, genre, tuning, scale, songAuthor };
};
