import { Country, Genre, SongAuthorType, Tuning } from "@prisma/client";

export type FilterValue = {
  country?: Country;
  genre?: Genre;
  tuning?: Tuning;
  songAuthor?: Extract<SongAuthorType, "folk_song"> | string;
};
export type FilterKey = keyof FilterValue;

export const parseFilter = (
  searchParams: Record<keyof FilterValue, string>
): FilterValue => {
  const country = searchParams.country
    ? Country[searchParams.country.toLowerCase() as keyof typeof Country]
    : undefined;
  const genre = searchParams.genre
    ? Genre[searchParams.genre.toLowerCase() as keyof typeof Genre]
    : undefined;
  const tuning = searchParams.tuning
    ? Tuning[searchParams.tuning.toLowerCase() as keyof typeof Tuning]
    : undefined;
  const songAuthor = searchParams.songAuthor
    ? SongAuthorType[
        searchParams.songAuthor.toLowerCase() as keyof typeof SongAuthorType
      ] ?? searchParams.songAuthor
    : undefined;

  return { country, genre, tuning, songAuthor };
};
