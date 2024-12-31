"use client";
import { Tuning } from "@prisma/client";
import { useRef } from "react";
import { Song } from "../../types";
import MelodicSettings from "../MelodicSettings";
import Bar from "./Bar";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider } from "./tuningContext";

const SongWrapper = () => {
  const { song, activeColumn, addBar, save, setActiveColumn } =
    useSongContext();

  const barsWrapperRef = useRef<HTMLDivElement>(null);
  console.log("barsWrapperRef", barsWrapperRef.current);

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
          className="flex flex-wrap w-[1100px] max-w-full"
          ref={barsWrapperRef}
        >
          {song.bars.map((bar, i) => (
            <Bar key={i} bar={bar} barIndex={i} lastBar={song.bars[i - 1]} />
          ))}
          <div className="">
            <button
              className="border border-black p-1 ml-4 rounded-md bg-[#0a0809] text-[#e0dac8]"
              onClick={() => {
                addBar();
              }}
            >
              Pridať takt
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
