import { uniqBy } from "ramda";
import { createContext, useContext, useState } from "react";
import { groupByFn } from "../../../utils/fnUtils";
import {
  Bass,
  Cell,
  CellBass,
  CellNote,
  CellRow,
  Column,
  DefinedDirection,
  Direction,
  EmptyCell,
  Ligatures,
  Song,
  SubCell,
  TimeSignature,
} from "../../types";
import { useLigatures } from "../useLigatures";
import { saveSong } from "./actions";
import { useTuningContext } from "./tuningContext";

type CellPosition = {
  barIndex: number;
  columnIndex: number;
  row: CellRow;
};

type ColumnPosition = {
  barIndex: number;
  columnIndex: number;
};

export type SubColumnPosition = ColumnPosition & {
  subColumnIndex: number;
};

type SongContext = {
  song: Song;
  ligatures: Ligatures;
  activeCell: CellPosition | null;
  activeColumn: SubColumnPosition | null;
  columnsInBar: number;
  setActiveCell: (position: CellPosition | null) => void;
  setActiveColumn: (position: SubColumnPosition | null) => void;

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
  addBar: () => void;
  duplicateBar: (barIndex: number) => void;
  removeBar: (barIndex: number) => void;
  setLength: (length: number, row: CellRow, button: number) => void;
  setText: (text: string, position: ColumnPosition) => void;
  save: () => void;
  clearColumn: () => void;
};

const songContext = createContext<SongContext>({
  song: {
    timeSignature: "4/4",
    bars: [],
  },
  ligatures: {},
  activeCell: null,
  activeColumn: null,
  columnsInBar: 4,
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
  addBar: () => {},
  duplicateBar: () => {},
  removeBar: () => {},
  setLength: () => {},
  setText: () => {},
  save: () => {},
  clearColumn: () => {},
});

interface SongContextProviderProps {
  id: number;
  editSecret?: string;
  children: React.ReactNode;
  initialSong: Song;
}

const COLUMNS_FOR_TIME_SIGNATURES: Record<TimeSignature, number> = {
  "3/4": 3,
  "4/4": 4,
  "2/4": 4,
};
export const SongContextProvider = ({
  id,
  editSecret,
  children,
  initialSong,
}: SongContextProviderProps) => {
  const [song, setSong] = useState<Song>(initialSong);
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [activeColumn, setActiveColumn] = useState<SubColumnPosition | null>(
    null
  );
  const { tuning } = useTuningContext();

  const columnsInBar = COLUMNS_FOR_TIME_SIGNATURES[song.timeSignature];

  const save = async () => {
    if (editSecret) {
      await saveSong({ id, editSecret, song });
    }
  };

  const addBar = () => {
    setSong((prev) => ({
      ...prev,
      bars: [
        ...prev.bars,
        {
          columns: new Array(columnsInBar).fill(null).map(() => ({
            melodic: tuning.melodic.map<Cell<CellNote | EmptyCell>>((row) => ({
              row: row.row,
              subCells: [{ items: [{ type: "empty" }] }],
            })),
            bass: {
              row: "bass",
              subCells: [{ items: [{ type: "empty" }] }],
            },
            direction: "empty",
            text: null,
          })),
          repeat: null,
        },
      ],
    }));
  };

  const duplicateBar = (barIndex: number) => {
    setSong((prev) => {
      const barToDuplicate = prev.bars[barIndex];
      if (!barToDuplicate) return prev;
      return {
        ...prev,
        bars: [
          ...prev.bars.slice(0, barIndex + 1),
          barToDuplicate,
          ...prev.bars.slice(barIndex + 1),
        ],
      };
    });
  };

  const removeBar = (barIndex: number) => {
    setActiveColumn(null);
    setSong((prev) => {
      return {
        ...prev,
        bars: prev.bars.filter((_, index) => index !== barIndex),
      };
    });
  };

  const setColumn = (newColumn: Column, columnPosition: ColumnPosition) => {
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

  const clearColumn = () => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    setColumn(getEmptyColumn(oldColumn), activeColumn);
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
              (subCell, index) => {
                const existingItems = groupByFn<CellNote | EmptyCell>((item) =>
                  item.type === "note" ? item.button.toString() : "empty"
                )(subCell.items);
                return {
                  ...subCell,
                  items:
                    index === activeColumn.subColumnIndex
                      ? rowButton
                          .map<CellNote>((button) => ({
                            ...existingItems[button.button.toString()],
                            type: "note",
                            button: button.button,
                          }))
                          .toSorted((a, b) =>
                            a.type === "note" && b.type === "note"
                              ? b.button - a.button
                              : 0
                          )
                      : subCell.items,
                };
              }
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
        >((subCell, index) => {
          if (index !== activeColumn.subColumnIndex) {
            return subCell;
          }
          const alreadyHasBass = subCell.items.some(
            (item) => item.type === "bass" && item.note.note === note.note
          );
          const newItems = alreadyHasBass
            ? subCell.items.filter(
                (item) => item.type !== "bass" || item.note.note !== note.note
              )
            : uniqBy<CellBass | EmptyCell, string>(
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
              );
          return {
            ...subCell,
            items: newItems.length === 0 ? [{ type: "empty" }] : newItems,
          };
        }),
      },
      direction,
    };

    setColumn(newColumn, activeColumn);
  };

  const setText = (text: string, position: ColumnPosition) => {
    setColumn(
      { ...song.bars[position.barIndex].columns[position.columnIndex], text },
      position
    );
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

  const setLength = (length: number, row: CellRow, button: number) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const newColumn: Column = {
      ...oldColumn,
      melodic: oldColumn.melodic.map((cell) =>
        cell.row === row
          ? {
              ...cell,
              subCells: cell.subCells.map((subCell, index) =>
                index === activeColumn.subColumnIndex
                  ? {
                      ...subCell,
                      items: subCell.items.map((item) =>
                        item.type === "note" && item.button === button
                          ? { ...item, length }
                          : item
                      ),
                      // TODO: allow length: 1 only if cell is split
                      // length: length > 1 ? length : undefined,
                    }
                  : subCell
              ),
            }
          : cell
      ),
      // bass:
      //   row === "bass"
      //     ? {
      //         ...oldColumn.bass,
      //         subCells: oldColumn.bass.subCells.map((subCell, index) =>
      //           index === activeColumn.subColumnIndex
      //             ? {
      //                 ...subCell,
      //                 // TODO: allow length: 1 only if cell is split
      //                 length: length > 1 ? length : undefined,
      //               }
      //             : subCell
      //         ),
      //       }
      //     : oldColumn.bass,
    };

    setColumn(newColumn, activeColumn);
  };

  const ligatures = useLigatures({
    columnsInTuning: columnsInBar,
    bars: song.bars,
  });

  return (
    <div>
      <songContext.Provider
        value={{
          song,
          ligatures,
          activeCell,
          setActiveCell,
          columnsInBar,
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
          addBar,
          duplicateBar,
          removeBar,
          setLength,
          setText,
          save,
          clearColumn,
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
