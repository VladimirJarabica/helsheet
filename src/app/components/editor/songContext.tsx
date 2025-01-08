import { uniqBy } from "ramda";
import { createContext, useContext, useState } from "react";
import { groupByFn } from "../../../utils/fnUtils";
import {
  getColumnsInBar,
  isBassPartSplit,
  isMelodicPartSplit,
} from "../../../utils/sheet";
import {
  Bar,
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
  SongContent,
  SubCell,
} from "../../types";
import { saveSong } from "./actions";
import { useTuningContext } from "./tuningContext";
import { useLigatures } from "./useLigatures";

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

interface SongContextProviderProps {
  id: number;
  editable: boolean;
  children: React.ReactNode;
  initialSong: SongContent;
}

type SongContext = {
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  song: SongContent;
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
  setBassButton: (note: Bass, direction: DefinedDirection | null) => void;
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
  setLength: (
    length: number,
    position:
      | { row: Exclude<CellRow, "bass">; button: number; bass?: never }
      | { row: "bass"; bass: Bass; button?: never }
  ) => void;
  setText: (text: string, position: ColumnPosition) => void;
  save: () => Promise<void>;
  clearColumn: () => void;
  setRepeatOfBar: (
    barIndex: number,
    repeat: Exclude<Bar["repeat"], undefined>
  ) => void;
  removeLastColumnFromBar: (barIndex: number) => void;
  addColumnToBar: (barIndex: number) => void;
  addVerse: (text: string) => void;
  removeVerse: (index: number) => void;
  setVerseText: (index: number, text: string) => void;
  addVariant: (variant: string) => void;
  setBarVariant: (barIndex: number, variant?: number) => void;
};

const songContext = createContext<SongContext>({
  isEditing: false,
  song: {
    timeSignature: "4/4",
    bars: [],
  },
  ligatures: {},
  activeCell: null,
  activeColumn: null,
  columnsInBar: 4,
  setEditing: () => {},
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
  save: () => Promise.resolve(),
  clearColumn: () => {},
  setRepeatOfBar: () => {},
  removeLastColumnFromBar: () => {},
  addColumnToBar: () => {},
  addVerse: () => {},
  removeVerse: () => {},
  setVerseText: () => {},
  addVariant: () => {},
  setBarVariant: () => {},
});

export const SongContextProvider = ({
  id,
  editable,
  children,
  initialSong,
}: SongContextProviderProps) => {
  const [song, setSong] = useState<SongContent>(initialSong);
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [activeColumn, setActiveColumn] = useState<SubColumnPosition | null>(
    null
  );
  const { tuning } = useTuningContext();
  const [isEditing, setIsEditing] = useState(false);

  const setEditing = (editing: boolean) => {
    setIsEditing(editable && editing);
  };

  const columnsInBar = getColumnsInBar(song.timeSignature);

  const save = async () => {
    if (editable && isEditing) {
      await saveSong({ id, song });
    }
  };

  const getNewEmptyColumn = (): Column => ({
    melodic: tuning.melodic.map<Cell<CellNote | EmptyCell>>((row) => ({
      row: row.row,
      subCells: [{ items: [{ type: "empty" }] }],
    })),
    bass: {
      row: "bass",
      subCells: [{ items: [{ type: "empty" }] }],
    },
    directions: [{ direction: "empty" }],
    text: null,
  });

  const addBar = () => {
    setSong((prev) => ({
      ...prev,
      bars: [
        ...prev.bars,
        {
          columns: new Array(columnsInBar).fill(getNewEmptyColumn()),
          // .map(() => ({
          //   melodic: tuning.melodic.map<Cell<CellNote | EmptyCell>>((row) => ({
          //     row: row.row,
          //     subCells: [{ items: [{ type: "empty" }] }],
          //   })),
          //   bass: {
          //     row: "bass",
          //     subCells: [{ items: [{ type: "empty" }] }],
          //   },
          //   directions: [{ direction: "empty" }],
          //   text: null,
          // })),
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
    directions: [{ direction: "empty" }],
    // direction: "empty",
  });

  const setDirection = (newDirection: Direction) => {
    if (!activeColumn) return;
    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldDirection =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex]
        .directions?.[activeColumn.subColumnIndex]?.direction;
    if (oldDirection === newDirection) return;

    const newColumn: Column = {
      ...(oldDirection === "empty" || newDirection === "empty"
        ? oldColumn
        : getEmptyColumn(oldColumn)),
      directions: oldColumn.directions.map((direction, index) =>
        index === activeColumn.subColumnIndex
          ? { direction: newDirection }
          : direction
      ),
      // direction: newDirection,
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

    const activeColumnDirection =
      oldColumn.directions[activeColumn.subColumnIndex]?.direction ??
      oldColumn.directions[0]?.direction;

    const oldColumnToChange =
      activeColumnDirection !== direction
        ? getEmptyColumn(oldColumn)
        : oldColumn;

    const newColumn: Column = {
      ...oldColumnToChange,
      melodic: oldColumnToChange.melodic.map<Cell<CellNote | EmptyCell>>(
        (cell) => ({
          ...cell,
          subCells: cell.subCells.map<SubCell<CellNote | EmptyCell>>(
            (subCell, index) => {
              if (cell.row === row && index === activeColumn.subColumnIndex) {
                const isRemoving = subCell.items.some(
                  (item) => item.type === "note" && item.button === button
                );
                return {
                  ...subCell,
                  items: isRemoving
                    ? subCell.items.filter(
                        (item) => item.type !== "note" || item.button !== button
                      )
                    : uniqBy<CellNote | EmptyCell, number | string>(
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
                      ),
                };
              }
              return subCell;
            }
          ),
        })
      ),
      directions: oldColumn.directions.map((dir, index) =>
        index === activeColumn.subColumnIndex ? { direction } : dir
      ),
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
    direction?: DefinedDirection
  ) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldColumnToChange =
      direction &&
      oldColumn.directions[activeColumn.subColumnIndex].direction !== direction
        ? getEmptyColumn(oldColumn)
        : oldColumn;

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
      directions: direction
        ? oldColumn.directions.map((dir, index) =>
            index === activeColumn.subColumnIndex ? { direction } : dir
          )
        : oldColumn.directions,
    };

    setColumn(newColumn, activeColumn);
  };

  const setBassButton = (note: Bass, direction: DefinedDirection | null) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const oldColumnToChange =
      direction &&
      oldColumn.directions[activeColumn.subColumnIndex].direction !== direction
        ? getEmptyColumn(oldColumn)
        : oldColumn;

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
      directions: direction
        ? oldColumn.directions.map((dir, index) =>
            index === activeColumn.subColumnIndex ? { direction } : dir
          )
        : oldColumn.directions,
      // direction,
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
      // Only if both, bass and melodic part are split, also direction can be split
      directions: isBassPartSplit(oldColumn)
        ? [oldColumn.directions[0], { direction: "empty" }]
        : oldColumn.directions,
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
        subCells: cell.subCells
          .filter((_, index) => index === activeColumn.subColumnIndex)
          .map((subCell) => ({
            ...subCell,
            items: subCell.items.map((item) => ({
              ...item,
              length:
                item.type !== "empty" && item.length
                  ? Math.max(item.length, 1)
                  : undefined,
            })),
          })),
      })),
      directions: [oldColumn.directions[0]],
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
      // Only if both, bass and melodic part are split, also direction can be split
      directions: isMelodicPartSplit(oldColumn)
        ? [oldColumn.directions[0], { direction: "empty" }]
        : oldColumn.directions,
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
      directions: [oldColumn.directions[0]],
    };

    setColumn(newColumn, activeColumn);
  };

  const setLength = (
    length: number,
    position:
      | { row: Exclude<CellRow, "bass">; button: number; bass?: never }
      | { row: "bass"; bass: Bass; button?: never }
  ) => {
    if (!activeColumn) return;

    const oldColumn =
      song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
    const newColumn: Column = {
      ...oldColumn,
      melodic:
        position.row !== "bass"
          ? oldColumn.melodic.map((cell) =>
              cell.row === position.row
                ? {
                    ...cell,
                    subCells: cell.subCells.map((subCell, index) =>
                      index === activeColumn.subColumnIndex
                        ? {
                            ...subCell,
                            items: subCell.items.map((item) =>
                              item.type === "note" &&
                              item.button === position.button
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
            )
          : oldColumn.melodic,
      bass:
        position.row === "bass"
          ? {
              ...oldColumn.bass,
              subCells: oldColumn.bass.subCells.map((subCell, index) =>
                index === activeColumn.subColumnIndex
                  ? {
                      ...subCell,
                      items: subCell.items.map((item) =>
                        item.type === "bass" &&
                        item.note.note === position.bass.note
                          ? { ...item, length }
                          : item
                      ),
                      // TODO: allow length: 1 only if cell is split
                      // length: length > 1 ? length : undefined,
                    }
                  : subCell
              ),
            }
          : oldColumn.bass,
    };

    setColumn(newColumn, activeColumn);
  };

  const setRepeatOfBar = (
    barIndex: number,
    repeat: Exclude<Bar["repeat"], undefined>
  ) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, index) =>
        index === barIndex ? { ...bar, repeat } : bar
      ),
    }));
  };

  const removeLastColumnFromBar = (barIndex: number) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, index) =>
        index === barIndex && bar.columns.length > 1
          ? {
              ...bar,
              columns: bar.columns.slice(0, bar.columns.length - 1),
            }
          : bar
      ),
    }));
  };

  const addColumnToBar = (barIndex: number) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, index) =>
        index === barIndex
          ? {
              ...bar,
              columns: [...bar.columns, getNewEmptyColumn()],
            }
          : bar
      ),
    }));
  };

  const addVerse = (text: string) => {
    setSong((prev) => ({
      ...prev,
      verses: [...(prev.verses ?? []), { text }],
    }));
  };

  const removeVerse = (index: number) => {
    setSong((prev) => ({
      ...prev,
      verses: prev.verses?.filter((_, i) => i !== index),
    }));
  };

  const setVerseText = (index: number, text: string) => {
    setSong((prev) => ({
      ...prev,
      verses: prev.verses?.map((verse, i) => (i === index ? { text } : verse)),
    }));
  };

  const addVariant = (variant: string) => {
    console.log("add variant", variant);
    setSong((prev) => {
      const lastId = prev.variants?.[prev.variants.length - 1]?.id ?? 0;

      console.log("add variant", { id: lastId + 1, name: variant });
      return {
        ...prev,
        variants: [...(prev.variants ?? []), { id: lastId + 1, name: variant }],
      };
    });
  };

  const setBarVariant = (barIndex: number, variant?: number) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, index) =>
        index === barIndex ? { ...bar, variant } : bar
      ),
    }));
  };

  const ligatures = useLigatures({
    columnsInTuning: columnsInBar,
    bars: song.bars,
  });

  console.log("song", song);

  return (
    <div>
      <songContext.Provider
        value={{
          isEditing,
          setEditing,
          song,
          ligatures,
          activeCell,
          setActiveCell,
          columnsInBar,
          //   setMelodicSubCells,
          activeColumn,
          setActiveColumn,
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
          setRepeatOfBar,
          addColumnToBar,
          removeLastColumnFromBar,
          addVerse,
          removeVerse,
          setVerseText,
          addVariant,
          setBarVariant,
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
