export type Note = {
  note: "c" | "d" | "dis" | "e" | "f" | "fis" | "g" | "gis" | "a" | "h" | "b";
  pitch: 0 | 1 | 2 | 3 | 4;
};
export type Bass = {
  note: "F" | "f" | "G" | "g" | "A" | "a" | "B" | "b" | "C" | "c" | "D" | "d";
};

export type TuningNoteButton = {
  button: number;
  pull: Note;
  push: Note;
};

export type TuningBassButton = {
  button: number;
  pull: Bass;
  push: Bass;
};

export type Tuning = {
  name: string;
  melodic: Array<{
    row: number;
    buttons: TuningNoteButton[];
  }>;
  bass: Array<{
    row: number;
    buttons: TuningBassButton[];
  }>;
};

export type CellNote = {
  type: "note";
  note?: Note; // e.g. "c0", "a1"...
  button: number; // "1" | "2" | "D";
  finger?: 1 | 2 | 3 | 4 | 5;
};

export type CellBass = {
  type: "bass";
  note?: Bass;
  button: number;
  finger?: 1 | 2 | 3 | 4 | 5;
};

// type Ligature = {
//   type: "ligature";
// };

type Empty = {
  type: "empty";
};

export type CellItem = CellNote | CellBass | Empty;

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

export type Direction = "pull" | "push" | "empty";

export type Beat = {
  melodic: Cell[];
  bass: Cell;
  direction: Direction;
};

export type Bar = {
  beats: Beat[];
  repeat: "start" | "end" | null;
};

export type Song = {
  timeSignature: "3/4" | "4/4";
  bars: Bar[];
};
