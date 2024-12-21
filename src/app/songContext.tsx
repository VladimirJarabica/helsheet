import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  CellItem,
  CellRow,
  CellNote,
  Song,
  SubCell,
  Direction,
  Beat,
  Cell,
  CellBass,
  EmptyCell,
  Note,
  Bass,
  DefinedDirection,
} from "./types";
import { uniqBy } from "ramda";

type CellPosition = {
  barIndex: number;
  beatIndex: number;
  row: CellRow;
};

type ActiveBeatPosition = {
  barIndex: number;
  beatIndex: number;
};

type ActiveSubBeatPosition = ActiveBeatPosition & {
  subBeatIndex: number;
};

type SongContext = {
  song: Song;
  activeCell: CellPosition | null;
  activeBeat: ActiveSubBeatPosition | null;
  setActiveCell: (position: CellPosition | null) => void;
  setActiveBeat: (position: ActiveSubBeatPosition | null) => void;
  //   setMelodicSubCells: (newItems: SubCell[], cellPosition: CellPosition) => void;
  //   splitCell: (position: CellPosition, splitBeat: boolean) => void;
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
  activeBeat: null,
  setActiveCell: () => {},
  setActiveBeat: () => {},
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
  const [activeBeat, setActiveBeat] = useState<ActiveSubBeatPosition | null>(
    null
  );

  console.log("song", song);

  //   const setMelodicSubCells = (
  //     newSubCells: SubCell<CellNote>[],
  //     cellPosition: CellPosition
  //   ) => {
  //     setSong((prev) => ({
  //       ...prev,
  //       bars: prev.bars.map((bar, barIndex) =>
  //         barIndex === cellPosition.barIndex
  //           ? {
  //               ...bar,
  //               beats: bar.beats.map((beat, beatIndex) =>
  //                 beatIndex === cellPosition.beatIndex
  //                   ? {
  //                       ...beat,
  //                       melodic: beat.melodic.map((cell) =>
  //                         cell.row === cellPosition.row
  //                           ? {
  //                               ...cell,
  //                               subCells: newSubCells,
  //                             }
  //                           : cell
  //                       ),
  //                     }
  //                   : beat
  //               ),
  //             }
  //           : bar
  //       ),
  //     }));
  //   };

  const setBeat = (newBeat: Beat, beatPosition: ActiveBeatPosition) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, barIndex) =>
        barIndex === beatPosition.barIndex
          ? {
              ...bar,
              beats: bar.beats.map((beat, beatIndex) =>
                beatIndex === beatPosition.beatIndex ? newBeat : beat
              ),
            }
          : bar
      ),
    }));
  };

  const getEmptyBeat = (oldBeat: Beat): Beat => ({
    ...oldBeat,
    melodic: oldBeat.melodic.map((cell) => ({
      ...cell,
      subCells: cell.subCells.map((subCell) => ({
        ...subCell,
        items: [{ type: "empty" }],
      })),
    })),
    bass: {
      ...oldBeat.bass,
      subCells: oldBeat.bass.subCells.map((subCell) => ({
        ...subCell,
        items: [{ type: "empty" }],
      })),
    },
    direction: "empty",
  });

  const setDirection = (newDirection: Direction) => {
    if (!activeBeat) return;
    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    if (oldBeat.direction === newDirection) return;

    const newBeat: Beat = { ...getEmptyBeat(oldBeat), direction: newDirection };

    setBeat(newBeat, activeBeat);
  };

  const setMelodicButton = (
    row: number,
    button: number,
    direction: DefinedDirection
  ) => {
    if (!activeBeat) return;

    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    const oldBeatToChange =
      oldBeat.direction !== direction ? getEmptyBeat(oldBeat) : oldBeat;

    const newBeat: Beat = {
      ...oldBeatToChange,
      melodic: oldBeatToChange.melodic.map<Cell<CellNote | EmptyCell>>(
        (cell) => ({
          ...cell,
          subCells: cell.subCells.map<SubCell<CellNote | EmptyCell>>(
            (subCell, index) => ({
              ...subCell,
              items:
                cell.row === row && index === activeBeat.subBeatIndex
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

    setBeat(newBeat, activeBeat);
  };

  const setMelodicButtons = (
    buttons: { row: number; button: number }[],
    direction: DefinedDirection
  ) => {
    if (!activeBeat) return;

    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    const oldBeatToChange =
      oldBeat.direction !== direction ? getEmptyBeat(oldBeat) : oldBeat;

    const newBeat: Beat = {
      ...oldBeatToChange,
      melodic: oldBeatToChange.melodic.map<Cell<CellNote | EmptyCell>>(
        (cell) => {
          const rowButton = buttons.filter((button) => button.row === cell.row);
          return {
            ...cell,
            subCells: cell.subCells.map<SubCell<CellNote | EmptyCell>>(
              (subCell, index) => ({
                ...subCell,
                items:
                  index === activeBeat.subBeatIndex
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

    setBeat(newBeat, activeBeat);
  };

  const setBassButton = (note: Bass, direction: DefinedDirection) => {
    if (!activeBeat) return;

    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    const oldBeatToChange =
      oldBeat.direction !== direction ? getEmptyBeat(oldBeat) : oldBeat;

    const newBeat: Beat = {
      ...oldBeatToChange,
      bass: {
        ...oldBeatToChange.bass,
        subCells: oldBeatToChange.bass.subCells.map<
          SubCell<CellBass | EmptyCell>
        >((subCell, index) => ({
          ...subCell,
          items:
            index === activeBeat.subBeatIndex
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

    setBeat(newBeat, activeBeat);
  };

  const splitMelodicPart = () => {
    if (!activeBeat) return;
    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];

    if (oldBeat.melodic[0].subCells.length > 1) return;

    const newBeat: Beat = {
      ...oldBeat,
      melodic: oldBeat.melodic.map((cell) => ({
        ...cell,
        subCells: [...cell.subCells, { items: [{ type: "empty" }] }],
      })),
    };

    setBeat(newBeat, activeBeat);
  };

  const joinMelodicPart = () => {
    if (!activeBeat) return;
    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];

    const newBeat: Beat = {
      ...oldBeat,
      melodic: oldBeat.melodic.map((cell) => ({
        ...cell,
        subCells: cell.subCells.filter(
          (_, index) => index === activeBeat.subBeatIndex
        ),
      })),
    };

    setBeat(newBeat, activeBeat);
  };
  const splitBassPart = () => {
    if (!activeBeat) return;
    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    if (oldBeat.bass.subCells.length > 1) return;

    const newBeat: Beat = {
      ...oldBeat,
      bass: {
        ...oldBeat.bass,
        subCells: [...oldBeat.bass.subCells, { items: [{ type: "empty" }] }],
      },
    };

    setBeat(newBeat, activeBeat);
  };

  const joinBassPart = () => {
    if (!activeBeat) return;
    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    if (oldBeat.bass.subCells.length === 1) return;

    const newBeat: Beat = {
      ...oldBeat,
      bass: {
        ...oldBeat.bass,
        subCells: oldBeat.bass.subCells.filter(
          (_, index) => index === activeBeat.subBeatIndex
        ),
      },
    };

    setBeat(newBeat, activeBeat);
  };

  //   const splitCell = (cellPosition: CellPosition, splitBeat: boolean) => {
  //     console.log("split", { cellPosition, splitBeat });
  //     setSong((prev) => ({
  //       ...prev,
  //       bars: prev.bars.map((bar, barIndex) =>
  //         barIndex === cellPosition.barIndex
  //           ? {
  //               ...bar,
  //               beats: bar.beats.map((beat, beatIndex) =>
  //                 beatIndex === cellPosition.beatIndex
  //                   ? {
  //                       ...beat,
  //                       melodic: beat.melodic.map((cell) =>
  //                         cell.row === cellPosition.row || splitBeat
  //                           ? {
  //                               ...cell,
  //                               subCells: [
  //                                 ...cell.subCells,
  //                                 { items: [{ type: "empty" }] },
  //                               ],
  //                             }
  //                           : cell
  //                       ),
  //                       bass:
  //                         cellPosition.row === "bass" || splitBeat
  //                           ? {
  //                               ...beat.bass,
  //                               subCells: [
  //                                 ...beat.bass.subCells,
  //                                 { items: [{ type: "empty" }] },
  //                               ],
  //                             }
  //                           : beat.bass,
  //                     }
  //                   : beat
  //               ),
  //             }
  //           : bar
  //       ),
  //     }));
  //   };

  console.log("activeCell", activeCell);

  return (
    <div>
      <songContext.Provider
        value={{
          song,
          activeCell,
          setActiveCell,
          //   setMelodicSubCells,
          activeBeat,
          setActiveBeat,
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
