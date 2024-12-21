import { uniqBy } from "ramda";
import { createContext, useContext, useState } from "react";
import {
  Bass,
  Column,
  Cell,
  CellBass,
  CellNote,
  CellRow,
  DefinedDirection,
  Direction,
  EmptyCell,
  Song,
  SubCell,
} from "./types";

type CellPosition = {
  barIndex: number;
  columnIndex: number;
  row: CellRow;
};

type ActiveColumnPosition = {
  barIndex: number;
  columnIndex: number;
};

type ActiveSubColumnPosition = ActiveColumnPosition & {
  subColumnIndex: number;
};

type SongContext = {
  song: Song;
  activeCell: CellPosition | null;
  activeColumn: ActiveSubColumnPosition | null;
  setActiveCell: (position: CellPosition | null) => void;
  setActiveColumn: (position: ActiveSubColumnPosition | null) => void;

  setMelodicButton: (
    row: number,
    button: number,
    direction: DefinedDirection
  ) => void;
  setBassButton: (note: Bass, direction: DefinedDirection) => void;
  setDirection: (newDirection: Direction) => void;
  splitMelodicPart: () => void;
  splitBassPart: () => void;
  joinMelodicPart: () => void;
  joinBassPart: () => void;
  setMelodicButtons: (
    buttons: { row: number; button: number }[],
    direction: DefinedDirection
  ) => void;
};

const songContext = createContext<SongContext>({
  song: {
    timeSignature: "4/4",
    bars: [],
  },
  activeCell: null,
  activeColumn: null,
  setActiveCell: () => {},
  setActiveColumn: () => {},
  //   setMelodicSubCells: () => {},
  //   splitCell: () => {},
  setMelodicButton: () => {},
  setBassButton: () => {},
  setDirection: () => {},
  splitMelodicPart: () => {},
  splitBassPart: () => {},
  joinMelodicPart: () => {},
  joinBassPart: () => {},
  setMelodicButtons: () => {},
});

interface SongContextProviderProps {
  children: React.ReactNode;
  initialSong: Song;
}
export const SongContextProvider = ({
  children,
  initialSong,
}: SongContextProviderProps) => {
  const [song, setSong] = useState<Song>(initialSong);
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [activeColumn, setActiveColumn] =
    useState<ActiveSubColumnPosition | null>(null);

  console.log("song", song);

  const setColumn = (
    newColumn: Column,
    columnPosition: ActiveColumnPosition
  ) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, barIndex) =>
        barIndex === columnPosition.barIndex
          ? {
              ...bar,
              columns: bar.columns.map((column, columnIndex) =>
                columnIndex === columnPosition.columnIndex ? newColumn : column
              ),
            }
          : bar
      ),
    }));
  };

  const getEmptyColumn = (oldColumn: Column): Column => ({
    ...oldColumn,
    melodic: oldColumn.melodic.map((cell) => ({
      ...cell,
      subCells: cell.subCells.map((subCell) => ({
        ...subCell,
        items: [{ type: "empty" }],
      })),
    })),
    bass: {
      ...oldColumn.bass,
      subCells: oldColumn.bass.subCells.map((subCell) => ({
        ...subCell,
        items: [{ type: "empty" }],
      })),
    },
    direction: "empty",
  });

  const setDirection = (newDirection: Direction) => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    if (oldColumn.direction === newDirection) return;

    const newColumn: Column = {
      ...getEmptyColumn(oldColumn),
      direction: newDirection,
    };

    setColumn(newColumn, activeColumn);
  };

  const setMelodicButton = (
    row: number,
    button: number,
    direction: DefinedDirection
  ) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldColumnToChange =
      oldColumn.direction !== direction ? getEmptyColumn(oldColumn) : oldColumn;

    const newColumn: Column = {
      ...oldColumnToChange,
      melodic: oldColumnToChange.melodic.map<Cell<CellNote | EmptyCell>>(
        (cell) => ({
          ...cell,
          subCells: cell.subCells.map<SubCell<CellNote | EmptyCell>>(
            (subCell, index) => ({
              ...subCell,
              items:
                cell.row === row && index === activeColumn.subColumnIndex
                  ? uniqBy<CellNote | EmptyCell, number | string>(
                      (i) => ("button" in i ? i.button : i.type),
                      [
                        ...subCell.items.filter(
                          (subCellItem) => subCellItem.type !== "empty"
                        ),
                        { type: "note", button },
                      ]
                    ).toSorted((a, b) =>
                      a.type === "note" && b.type === "note"
                        ? b.button - a.button
                        : 0
                    )
                  : subCell.items,
            })
          ),
        })
      ),
      direction,
    };

    setColumn(newColumn, activeColumn);
  };

  const setMelodicButtons = (
    buttons: { row: number; button: number }[],
    direction: DefinedDirection
  ) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldColumnToChange =
      oldColumn.direction !== direction ? getEmptyColumn(oldColumn) : oldColumn;

    const newColumn: Column = {
      ...oldColumnToChange,
      melodic: oldColumnToChange.melodic.map<Cell<CellNote | EmptyCell>>(
        (cell) => {
          const rowButton = buttons.filter((button) => button.row === cell.row);
          return {
            ...cell,
            subCells: cell.subCells.map<SubCell<CellNote | EmptyCell>>(
              (subCell, index) => ({
                ...subCell,
                items:
                  index === activeColumn.subColumnIndex
                    ? rowButton
                        .map<CellNote>((button) => ({
                          type: "note",
                          button: button.button,
                        }))
                        .toSorted((a, b) =>
                          a.type === "note" && b.type === "note"
                            ? b.button - a.button
                            : 0
                        )
                    : subCell.items,
              })
            ),
          };
        }
      ),
      direction,
    };

    setColumn(newColumn, activeColumn);
  };

  const setBassButton = (note: Bass, direction: DefinedDirection) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldColumnToChange =
      oldColumn.direction !== direction ? getEmptyColumn(oldColumn) : oldColumn;

    const newColumn: Column = {
      ...oldColumnToChange,
      bass: {
        ...oldColumnToChange.bass,
        subCells: oldColumnToChange.bass.subCells.map<
          SubCell<CellBass | EmptyCell>
        >((subCell, index) => ({
          ...subCell,
          items:
            index === activeColumn.subColumnIndex
              ? uniqBy<CellBass | EmptyCell, string>(
                  (i) => ("note" in i ? i.note.note : i.type),
                  [
                    ...subCell.items.filter(
                      (subCellItem) => subCellItem.type !== "empty"
                    ),
                    { type: "bass", note },
                  ]
                ).toSorted((a, b) =>
                  // TODO: correctly sort basses
                  a.type === "bass" && b.type === "bass"
                    ? b.note.note.localeCompare(a.note.note)
                    : 0
                )
              : subCell.items,
        })),
      },
      direction,
    };

    setColumn(newColumn, activeColumn);
  };

  const splitMelodicPart = () => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];

    if (oldColumn.melodic[0].subCells.length > 1) return;

    const newColumn: Column = {
      ...oldColumn,
      melodic: oldColumn.melodic.map((cell) => ({
        ...cell,
        subCells: [...cell.subCells, { items: [{ type: "empty" }] }],
      })),
    };

    setColumn(newColumn, activeColumn);
  };

  const joinMelodicPart = () => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];

    const newColumn: Column = {
      ...oldColumn,
      melodic: oldColumn.melodic.map((cell) => ({
        ...cell,
        subCells: cell.subCells.filter(
          (_, index) => index === activeColumn.subColumnIndex
        ),
      })),
    };

    setColumn(newColumn, activeColumn);
  };
  const splitBassPart = () => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    if (oldColumn.bass.subCells.length > 1) return;

    const newColumn: Column = {
      ...oldColumn,
      bass: {
        ...oldColumn.bass,
        subCells: [...oldColumn.bass.subCells, { items: [{ type: "empty" }] }],
      },
    };

    setColumn(newColumn, activeColumn);
  };

  const joinBassPart = () => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    if (oldColumn.bass.subCells.length === 1) return;

    const newColumn: Column = {
      ...oldColumn,
      bass: {
        ...oldColumn.bass,
        subCells: oldColumn.bass.subCells.filter(
          (_, index) => index === activeColumn.subColumnIndex
        ),
      },
    };

    setColumn(newColumn, activeColumn);
  };

  console.log("activeCell", activeCell);

  return (
    <div>
      <songContext.Provider
        value={{
          song,
          activeCell,
          setActiveCell,
          //   setMelodicSubCells,
          activeColumn: activeColumn,
          setActiveColumn: setActiveColumn,
          setMelodicButton,
          setBassButton,
          setDirection,
          splitMelodicPart,
          splitBassPart,
          joinMelodicPart,
          joinBassPart,
          setMelodicButtons,
        }}
      >
        {children}
      </songContext.Provider>
    </div>
  );
};

export const useSongContext = () => useContext(songContext);

export const useSong = () => {
  const { song } = useSongContext();

  return song;
};
