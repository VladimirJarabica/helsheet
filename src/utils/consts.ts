import { TimeSignature } from "../app/types";

export const CELL_SIZE = 36;

export const LINE_HEADING_WIDTH = CELL_SIZE * 0.75;

// Double 2x border
export const LINE_HEADING_WIDTH_WITH_BORDER = LINE_HEADING_WIDTH + 4;

export const DIRECTION_CELL_SIZE = 12;

export const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  "3/4": 3,
  "4/4": 4,
  "2/4": 4,
};

export const BAR_LINES_PER_PAGE = 5;
