import { Country, Genre, Scale, SongAuthorType, Tuning } from "@prisma/client";

export enum FilterSortBy {
  date_created = "date_created",
  name = "name",
}
export const DEFAULT_SORT_BY: FilterSortBy = FilterSortBy.name;
export enum FilterSortByOrder {
  asc = "asc",
  desc = "desc",
}
export const DEFAULT_SORT_BY_ORDER: FilterSortByOrder = FilterSortByOrder.asc;

export type FilterValue = {
  country?: Country;
  genre?: Genre;
  tuning?: Tuning;
  scale?: Scale;
  songAuthor?: Extract<SongAuthorType, "folk_song"> | string;
  sortBy: FilterSortBy;
  sortByOrder: FilterSortByOrder;
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
  const sortBy = searchParams.sortBy
    ? FilterSortBy[searchParams.sortBy as keyof typeof FilterSortBy]
    : DEFAULT_SORT_BY;
  const sortByOrder = searchParams.sortByOrder
    ? FilterSortByOrder[
        searchParams.sortByOrder as keyof typeof FilterSortByOrder
      ]
    : DEFAULT_SORT_BY_ORDER;

  return { country, genre, tuning, scale, songAuthor, sortBy, sortByOrder };
};
