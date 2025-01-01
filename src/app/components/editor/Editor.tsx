"use client";
import { Tuning } from "@prisma/client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Song } from "../../types";
import MelodicSettings from "../MelodicSettings";
import Bar from "./Bar";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider, useTuningContext } from "./tuningContext";
import { getColumnsInBar } from "../../../utils/sheet";
import { CELL_SIZE, DIRECTION_CELL_SIZE } from "../../../utils/consts";

const SongWrapper = () => {
  const { song, activeColumn, addBar, save, setActiveColumn } =
    useSongContext();

  const { tuning } = useTuningContext();

  const barsWrapperRef = useRef<HTMLDivElement>(null);
  console.log("barsWrapperRef", barsWrapperRef.current);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const columnsInBar = getColumnsInBar(song.timeSignature);

  const [barsPerLine, setBarsPerLine] = useState(6);
  console.log("barsPerLine", barsPerLine);

  useEffect(() => {
    const element = barsWrapperRef.current;
    console.log("calculate more", element);
    if (!element) return;

    const handleResize = () => {
      if (element) {
        const width = element.offsetWidth;
        // Firstly remove the heading space, than calculate how many bars fits into the current width
        const columns = Math.floor(
          (width - CELL_SIZE) / (CELL_SIZE * columnsInBar + 1) // Bar has 44*x + 1 as border
        );
        console.log("Width", { width, columnsInBar, columns });
        setBarsPerLine(columns);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [columnsInBar]);

  // useEffect(() => {
  //   const handleClick = (event: MouseEvent) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as HTMLElement)
  //     ) {
  //       setActiveColumn(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //   };
  // });

  return (
    <div
      className="max-h-[100vh] flex flex-col"
      onClick={(e) => {
        console.log("Wrapper on click", e.target);
        if (
          activeColumn &&
          !barsWrapperRef.current?.contains(e.target as Node)
        ) {
          setActiveColumn(null);
        }
      }}
      ref={wrapperRef}
    >
      <div>
        <button
          className="border border-black p-1 ml-4 rounded-md bg-[#0a0809] text-[#e0dac8]"
          onClick={() => {
            save();
          }}
        >
          Uložiť
        </button>
      </div>
      <div className="w-full flex justify-center pt-10 overflow-y-auto flex-1 px-4">
        <div
          className="flex flex-wrap w-[700px] max-w-full"
          ref={barsWrapperRef}
        >
          {song.bars.map((bar, i) => (
            <Bar
              key={i}
              bar={bar}
              barIndex={i}
              previousBar={song.bars[i - 1]}
              followingBar={song.bars[i + 1]}
              onNewLine={i % barsPerLine === 0}
            />
          ))}
          <div className="">
            <button
              className="border border-black p-1 ml-4 rounded-sm bg-[#e3d9bc] hover:bg-[#dfd5b7] text-black w-10 text-xs"
              onClick={() => {
                addBar();
              }}
              style={{
                height:
                  (tuning.melodic.length + 1) * CELL_SIZE +
                  DIRECTION_CELL_SIZE +
                  3,
              }}
            >
              Nový takt
            </button>
          </div>
        </div>
      </div>
      <div
        className="max-h-[75%]"
        onClick={(e) => {
          console.log("Setting on click", e);
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {activeColumn && <MelodicSettings />}
      </div>
    </div>
  );
};

interface EditorProps {
  id: number;
  editSecret?: string;
  song: Song;
  tuning: Tuning;
  readonly: boolean;
}
const Editor = ({ id, editSecret, song, tuning }: EditorProps) => {
  return (
    <TuningContextProvider tuning={tuning}>
      <SongContextProvider id={id} editSecret={editSecret} initialSong={song}>
        <SongWrapper />
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
