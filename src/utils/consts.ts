import { TimeSignature } from "../app/types";

export const CELL_SIZE = 40;
export const DIRECTION_CELL_SIZE = 20;
export const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  "3/4": 3,
  "4/4": 4,
  "2/4": 4,
};
