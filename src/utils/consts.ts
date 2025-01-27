import { Country, Genre, SongAuthorType, TimeSignature } from "@prisma/client";
import { Note } from "../app/types";

export const CELL_SIZE = 36;

export const LINE_HEADING_WIDTH = CELL_SIZE * 0.75;

// Double 2x border
export const LINE_HEADING_WIDTH_WITH_BORDER = LINE_HEADING_WIDTH + 4;

export const DIRECTION_CELL_SIZE = 12;

export const VARIANT_CELL_HEIGHT = 16;

export const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  [TimeSignature.sig_3_4]: 3,
  [TimeSignature.sig_4_4]: 4,
  [TimeSignature.sig_2_4]: 4,
};

export const WHOLE_NOTE_LENGTH_FOR_TIME_SIGNATURE = {
  [TimeSignature.sig_3_4]: 8,
  [TimeSignature.sig_4_4]: 4,
  [TimeSignature.sig_2_4]: 4,
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

export const TIME_SIGNATURE_VALUE: Record<TimeSignature, string> = {
  [TimeSignature.sig_2_4]: "2/4",
  [TimeSignature.sig_3_4]: "3/4",
  [TimeSignature.sig_4_4]: "4/4",
};

export const Notes: (Note & {
  position: number;
})[] = [
  { note: "g", pitch: -1, position: -13 },
  { note: "gis", pitch: -1, position: -13 },
  { note: "a", pitch: -1, position: -12 },
  { note: "as", pitch: -1, position: -12 },
  { note: "h", pitch: -1, position: -11 },
  { note: "b", pitch: -1, position: -11 },
  { note: "c", pitch: 0, position: -10 },
  { note: "cis", pitch: 0, position: -10 },
  { note: "d", pitch: 0, position: -9 },
  { note: "dis", pitch: 0, position: -9 },
  { note: "des", pitch: 0, position: -9 },
  { note: "e", pitch: 0, position: -8 },
  { note: "es", pitch: 0, position: -8 },
  { note: "f", pitch: 0, position: -7 },
  { note: "fis", pitch: 0, position: -7 },
  { note: "g", pitch: 0, position: -6 },
  { note: "gis", pitch: 0, position: -6 },
  { note: "a", pitch: 0, position: -5 },
  { note: "as", pitch: 0, position: -5 },
  { note: "h", pitch: 0, position: -4 },
  { note: "b", pitch: 0, position: -4 },
  { note: "c", pitch: 1, position: -3 },
  { note: "cis", pitch: 1, position: -3 },
  { note: "d", pitch: 1, position: -2 },
  { note: "dis", pitch: 1, position: -2 },
  { note: "des", pitch: 1, position: -2 },
  { note: "e", pitch: 1, position: -1 },
  { note: "es", pitch: 1, position: -1 },
  { note: "f", pitch: 1, position: 0 },
  { note: "fis", pitch: 1, position: 0 },
  { note: "g", pitch: 1, position: 1 },
  { note: "gis", pitch: 1, position: 1 },
  { note: "a", pitch: 1, position: 2 },
  { note: "as", pitch: 1, position: 2 },
  { note: "b", pitch: 1, position: 3 },
  { note: "h", pitch: 1, position: 3 },
  { note: "c", pitch: 2, position: 4 },
  { note: "cis", pitch: 2, position: 4 },
  { note: "d", pitch: 2, position: 5 },
  { note: "dis", pitch: 2, position: 5 },
  { note: "des", pitch: 2, position: 5 },
  { note: "e", pitch: 2, position: 6 },
  { note: "es", pitch: 2, position: 6 },
  { note: "f", pitch: 2, position: 7 },
  { note: "fis", pitch: 2, position: 7 },
  { note: "g", pitch: 2, position: 8 },
  { note: "gis", pitch: 2, position: 8 },
  { note: "a", pitch: 2, position: 9 },
  { note: "as", pitch: 2, position: 9 },
  { note: "h", pitch: 2, position: 10 },
  { note: "b", pitch: 2, position: 10 },
  { note: "c", pitch: 3, position: 11 },
  { note: "cis", pitch: 3, position: 11 },
  { note: "d", pitch: 3, position: 12 },
  { note: "dis", pitch: 3, position: 12 },
  { note: "des", pitch: 3, position: 12 },
];
