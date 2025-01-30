import { Sheet, SheetAccess, TimeSignature } from "@prisma/client";
import { unstable_cache as cache } from "next/cache";
import { CellItem, CellRow, Column, Direction, Tuning } from "../app/types";
import { dbClient } from "../services/db";
import { COLUMNS_FOR_TIME_SIGNATURES } from "./consts";

export const getSheetUrl = (sheet: Pick<Sheet, "id" | "name">) => {
  const name = sheet.name.replace(/ /g, "-");
  return `/sheet/${sheet.id}_${name}`;
};

export const getSheetNameFromSlug = (slug: string) => {
  return decodeURIComponent(slug).split("_")[1]?.replace(/-/g, " ");
};

const getUrl = (str: string) => {
  try {
    return new URL(str);
  } catch {
    return null;
  }
};

export const getHostname = (str: string) => {
  const url = getUrl(str);

  if (!url) {
    return null;
  }
  return url.hostname;
};

export const getSheetIdFromParam = (slug: string) => {
  const id = slug.split("_")[0];
  const parsed = parseInt(id, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getNoteFromTuningByButton = ({
  button,
  row,
  direction,
  tuning,
}: {
  button: number;
  row: CellRow;
  direction: Direction;
  tuning: Tuning;
}) => {
  const melodic = tuning.melodic.find((m) => m.row === row);
  if (!melodic || direction === "empty") {
    return null;
  }

  return melodic.buttons[button - 1][direction];
};

export const getColumnsInBar = (timeSignature: TimeSignature) =>
  COLUMNS_FOR_TIME_SIGNATURES[timeSignature];

export const hasMelodicPart = (column: Column, subColumnIndex: number) =>
  column.melodic.some((cell) => !!cell.subCells[subColumnIndex]);
export const isMelodicPartSplit = (column: Column) =>
  column.melodic.some((cell) => cell.subCells.length > 1);
export const isBassPartSplit = (column: Column) =>
  column.bass.subCells.length > 1;

export const sortNoteItems = <Item extends CellItem>(items: Item[]): Item[] =>
  items.toSorted((a, b) => {
    if (a.type === "bass" && b.type === "bass") {
      const aNote = a.note.note;
      const bNote = b.note.note;
      if (aNote === aNote.toUpperCase()) {
        if (bNote === bNote.toUpperCase()) {
          return aNote.localeCompare(bNote);
        }
        return -1;
      }
      if (bNote === bNote.toUpperCase()) {
        return 1;
      }
      return aNote.localeCompare(bNote);
    }
    return 0;
  });

export const getGlobalSheetCacheTag = (sheetId: number) => `sheet-${sheetId}`;
export const getSheetForUserCacheTag = (sheetId: number, userId: string) =>
  `sheet-${sheetId}-${userId}`;

export const getSheetDetail = async (
  sheetId: number,
  authUserId: string = ""
) => {
  const getCachedSheet = cache(
    async (sId: number, userId: string) => {
      const sheet = await dbClient.sheet.findFirst({
        select: {
          id: true,
          name: true,
          description: true,
          tuning: true,
          scale: true,
          timeSignature: true,
          content: true,
          version: true,
          tempo: true,
          genre: true,
          country: true,
          songAuthorType: true,
          songAuthor: true,
          originalSheetAuthor: true,
          source: true,
          SheetAuthor: { select: { id: true, nickname: true } },
          access: true,
          updatedAt: true,
        },
        where: {
          AND: [
            { id: sId },
            {
              OR: [{ access: SheetAccess.public }, { sheetAuthorId: userId }],
            },
          ],
        },
      });

      return sheet;
    },
    [],
    {
      tags: [
        getGlobalSheetCacheTag(sheetId),
        getSheetForUserCacheTag(sheetId, authUserId),
      ],
    }
  );

  const cachedSheet = await getCachedSheet(sheetId, authUserId);

  return cachedSheet
    ? {
        ...cachedSheet,
        // Cached value might be a string
        updatedAt: new Date(cachedSheet.updatedAt),
      }
    : cachedSheet;
};
