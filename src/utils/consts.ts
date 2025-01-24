import { Country, Genre, SongAuthorType } from "@prisma/client";
import { TimeSignature } from "../app/types";

export const CELL_SIZE = 36;

export const LINE_HEADING_WIDTH = CELL_SIZE * 0.75;

// Double 2x border
export const LINE_HEADING_WIDTH_WITH_BORDER = LINE_HEADING_WIDTH + 4;

export const DIRECTION_CELL_SIZE = 12;

export const VARIANT_CELL_HEIGHT = 16;

export const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  "3/4": 3,
  "4/4": 4,
  "2/4": 4,
};

export const WHOLE_NOTE_LENGTH_FOR_TIME_SIGNATURE = {
  "2/4": 8,
  "3/4": 4,
  "4/4": 4,
};

export const BAR_LINES_PER_PAGE = 5;

export const AUTHOR_TYPE_VALUE: Record<SongAuthorType, string> = {
  [SongAuthorType.folk_song]: "Ľudová pieseň",
  [SongAuthorType.original_song]: "Autorská pieseň",
};

export const GENRE_VALUE: Record<Genre, string> = {
  [Genre.country]: "Country",
  [Genre.folk_music]: "Ľudová pieseň",
  [Genre.sea_shanty]: "Sea shanty",
};

export const COUNTRY_VALUE: Record<Country, string> = {
  [Country.slovakia]: "🇸🇰 Slovensko",
  [Country.czech_republic]: "🇨🇿 Česká republika",
  [Country.poland]: "🇵🇱 Poľsko",
  [Country.hungary]: "🇭🇺 Maďarsko",
  [Country.austria]: "🇦🇹 Rakúsko",
  [Country.ireland]: "🇮🇪 Írsko",
  [Country.scotland]: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Škótsko",
  [Country.england]: "🇬🇧 Anglicko",
  [Country.france]: "🇫🇷 Francúzsko",
};
