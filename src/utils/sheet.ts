import { Sheet } from "@prisma/client";
import { CellRow, Direction, TimeSignature, Tuning } from "../app/types";
import { COLUMNS_FOR_TIME_SIGNATURES } from "./consts";

export const getSheetUrl = (
  sheet: Pick<Sheet, "id" | "name"> & { editSecret?: string }
) => {
  const name = sheet.name.toLowerCase().replace(/ /g, "-");
  return `/sheet/${sheet.id}_${name}?${
    sheet.editSecret ? `editSecret=${sheet.editSecret}` : ""
  }`;
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
