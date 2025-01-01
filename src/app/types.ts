export type Note = {
  note:
    | "c"
    | "cis"
    | "d"
    | "dis"
    | "e"
    | "es"
    | "f"
    | "fis"
    | "g"
    | "gis"
    | "a"
    | "h"
    | "b";
  pitch: 0 | 1 | 2 | 3 | 4;
};
export type Bass = {
  note: "F" | "f" | "G" | "g" | "A" | "a" | "B" | "b" | "C" | "c" | "D" | "d";
};

export type ScaleSignature =
  | ""
  | "b"
  | "bb"
  | "bbb"
  | "bbbb"
  | "bbbbb"
  | "bbbbbb"
  | "bbbbbbb"
  | "#"
  | "##"
  | "###"
  | "####"
  | "#####"
  | "######"
  | "#######";

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
  length?: number;
};

export type CellBass = {
  type: "bass";
  note: Bass;
  finger?: 1 | 2 | 3 | 4 | 5;
  length?: number;
};

// type Ligature = {
//   type: "ligature";
// };

export type EmptyCell = {
  type: "empty";
};

export type CellItem = CellNote | CellBass | EmptyCell;

export type CellRow = number | "bass" | "direction";

export type SubCell<Item extends CellItem> = {
  items: Item[];
};

export type Cell<Item extends CellItem> = {
  // E.g. [[Note]] one button pressed per beat
  // [[Note(D), Note(dm)]] both D and dm pressed together per one beat
  // [[Note(1)][Note(1)]] beat is split to 2 parts, pressing "1" in each
  // [[Ligature]] - ligature
  // [[Ligature], [Note(1)]] - ligature to half and then 1 pressed on second half
  // [] - empty
  subCells: SubCell<Item>[];
  row: CellRow;
};

export type DefinedDirection = "pull" | "push";

export type Direction = DefinedDirection | "empty";

export type Column = {
  melodic: Cell<CellNote | EmptyCell>[];
  bass: Cell<CellBass | EmptyCell>;
  direction: Direction;
  text: string | null;
};

export type Bar = {
  columns: Column[];
  repeat?: {
    start: boolean;
    end: boolean;
  };
};

export type TimeSignature = "3/4" | "4/4" | "2/4";
export type SongContent = {
  timeSignature: TimeSignature;
  bars: Bar[];
};

export type CellLigaturePosition = {
  // E.g. First (current) note of 4 notes (ofNotes). - will be rendered at the top position
  // or current=1 of 1 notes (center) - will be rendered in the middle
  current: number;
  ofNotes: number;
};
export type CellLigature = {
  type: "start" | "end" | "middle" | "full";
  // Position based
  position: CellLigaturePosition;
  fullLigatureLength: number;
  range: { from: number; to: number };
  renderLigatureLength: number;
  renderRange: { from: number; to: number };
  startOffset: number;
};
export type Ligatures = {
  [barIndex: number]: {
    [columnIndex: number]: {
      [rowIndex: number]: {
        ligatures: CellLigature[];
      };
      bass?: {
        ligatures: CellLigature[];
      };
    };
  };
};
