import { Sheet } from "@prisma/client";
import {
  CellRow,
  Column,
  Direction,
  TimeSignature,
  Tuning,
} from "../app/types";
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
