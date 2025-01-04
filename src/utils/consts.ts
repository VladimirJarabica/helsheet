import { TimeSignature } from "../app/types";

export const CELL_SIZE = 40;

export const LINE_HEADING_WIDTH = CELL_SIZE + 4; // Double 2x border

export const DIRECTION_CELL_SIZE = 20;

export const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  "3/4": 3,
  "4/4": 4,
  "2/4": 4,
};

export const BAR_LINES_PER_PAGE = 5;
