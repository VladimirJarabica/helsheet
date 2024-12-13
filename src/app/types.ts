export type Note = {
  type: "note";
  note?: string; // e.g. "c0", "a1"...
  button: string; // "1" | "2" | "D";
  finger?: 1 | 2 | 3 | 4 | 5;
};

type Ligature = {
  type: "ligature";
};

type Empty = {
  type: "empty";
};

export type CellItem = Note | Ligature | Empty;

export type CellRow = number | "bass" | "direction";

export type SubCell = {
  items: CellItem[];
};

export type Cell = {
  // E.g. [[Note]] one button pressed per beat
  // [[Note(D), Note(dm)]] both D and dm pressed together per one beat
  // [[Note(1)][Note(1)]] beat is split to 2 parts, pressing "1" in each
  // [[Ligature]] - ligature
  // [[Ligature], [Note(1)]] - ligature to half and then 1 pressed on second half
  // [] - empty
  subCells: SubCell[];
  row: CellRow;
};

export type Beat = {
  melodic: Cell[];
  bass: Cell;
  direction: "pull" | "push";
};

export type Bar = {
  beats: Beat[];
  repeat: "start" | "end" | null;
};

export type Song = {
  timeSignature: "3/4" | "4/4";
  bars: Bar[];
};
