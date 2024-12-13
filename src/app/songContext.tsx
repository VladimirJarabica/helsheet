import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CellItem, CellRow, Note, Song, SubCell } from "./types";

type CellPosition = {
  barIndex: number;
  beatIndex: number;
  row: CellRow;
};

type SongContext = {
  song: Song;
  activeCell: CellPosition | null;
  setActiveCell: (position: CellPosition | null) => void;
  setMelodicSubCells: (newItems: SubCell[], cellPosition: CellPosition) => void;
  splitCell: (position: CellPosition, splitBeat: boolean) => void;
};

const songContext = createContext<SongContext>({
  song: {
    timeSignature: "4/4",
    bars: [],
  },
  activeCell: null,
  setActiveCell: () => {},
  setMelodicSubCells: () => {},
  splitCell: () => {},
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
          splitCell,
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
