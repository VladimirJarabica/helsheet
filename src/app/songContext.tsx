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
} from "./types";
import { uniqBy } from "ramda";

type CellPosition = {
  barIndex: number;
  beatIndex: number;
  row: CellRow;
};

type ActiveBeat = {
  barIndex: number;
  beatIndex: number;
  subBeatIndex: number;
};

type SongContext = {
  song: Song;
  activeCell: CellPosition | null;
  activeBeat: ActiveBeat | null;
  setActiveCell: (position: CellPosition | null) => void;
  setActiveBeat: (position: ActiveBeat | null) => void;
  setMelodicSubCells: (newItems: SubCell[], cellPosition: CellPosition) => void;
  splitCell: (position: CellPosition, splitBeat: boolean) => void;
  setMelodicButton: (
    row: number,
    button: number,
    direction: Exclude<Direction, "empty">
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
  setMelodicSubCells: () => {},
  splitCell: () => {},
  setMelodicButton: () => {},
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
  const [activeBeat, setActiveBeat] = useState<ActiveBeat | null>(null);

  console.log("song", song);

  const setMelodicSubCells = (
    newSubCells: SubCell[],
    cellPosition: CellPosition
  ) => {
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, barIndex) =>
        barIndex === cellPosition.barIndex
          ? {
              ...bar,
              beats: bar.beats.map((beat, beatIndex) =>
                beatIndex === cellPosition.beatIndex
                  ? {
                      ...beat,
                      melodic: beat.melodic.map((cell) =>
                        cell.row === cellPosition.row
                          ? {
                              ...cell,
                              subCells: newSubCells,
                            }
                          : cell
                      ),
                    }
                  : beat
              ),
            }
          : bar
      ),
    }));
  };

  const setMelodicButton = (
    row: number,
    button: number,
    direction: Exclude<Direction, "empty">
  ) => {
    if (!activeBeat) return;

    const oldBeat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
    const differentDirection = oldBeat.direction !== direction;

    const newBeat: Beat = differentDirection
      ? {
          // TODO: clean also bass part
          ...oldBeat,
          direction,
          melodic: oldBeat.melodic.map<Cell>((cell) => ({
            ...cell,
            subCells: cell.subCells.map<SubCell>((_, index) => ({
              items:
                cell.row === row && index === activeBeat.subBeatIndex
                  ? [{ type: "note", button }]
                  : [{ type: "empty" }],
            })),
          })),
        }
      : {
          ...oldBeat,
          direction,
          melodic: oldBeat.melodic.map<Cell>((cell) => ({
            ...cell,
            subCells: cell.subCells.map<SubCell>((subCell, index) => ({
              ...subCell,
              items:
                cell.row === row && index === activeBeat.subBeatIndex
                  ? // TODO: filter out duplicities
                    uniqBy<CellItem, number | string>(
                      (i) => ("button" in i ? i.button : i.type),
                      [...subCell.items, { type: "note", button }]
                    )
                  : subCell.items,
            })),
          })),
        };

    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, barIndex) =>
        barIndex === activeBeat.barIndex
          ? {
              ...bar,
              beats: bar.beats.map((beat, beatIndex) =>
                beatIndex === activeBeat.beatIndex ? newBeat : beat
              ),
            }
          : bar
      ),
    }));
  };

  const splitCell = (cellPosition: CellPosition, splitBeat: boolean) => {
    console.log("split", { cellPosition, splitBeat });
    setSong((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, barIndex) =>
        barIndex === cellPosition.barIndex
          ? {
              ...bar,
              beats: bar.beats.map((beat, beatIndex) =>
                beatIndex === cellPosition.beatIndex
                  ? {
                      ...beat,
                      melodic: beat.melodic.map((cell) =>
                        cell.row === cellPosition.row || splitBeat
                          ? {
                              ...cell,
                              subCells: [
                                ...cell.subCells,
                                { items: [{ type: "empty" }] },
                              ],
                            }
                          : cell
                      ),
                      bass:
                        cellPosition.row === "bass" || splitBeat
                          ? {
                              ...beat.bass,
                              subCells: [
                                ...beat.bass.subCells,
                                { items: [{ type: "empty" }] },
                              ],
                            }
                          : beat.bass,
                    }
                  : beat
              ),
            }
          : bar
      ),
    }));
  };

  console.log("activeCell", activeCell);

  return (
    <div>
      <songContext.Provider
        value={{
          song,
          activeCell,
          setActiveCell,
          setMelodicSubCells,
          activeBeat,
          setActiveBeat,
          splitCell,
          setMelodicButton,
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
