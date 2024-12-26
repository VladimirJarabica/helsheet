"use client";
import { Tuning } from "@prisma/client";
import { useRef } from "react";
import { Song } from "../../types";
import MelodicSettings from "../MelodicSettings";
import Bar from "./Bar";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider } from "./tuningContext";

const SongWrapper = () => {
  const { song, activeColumn, addBar } = useSongContext();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClick = (event: MouseEvent) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as HTMLElement)
  //     ) {
  //       setActiveCell(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //   };
  // });

  return (
    <div className="h-[100vh] flex flex-col">
      <div
        className="w-full flex justify-center pt-10 overflow-y-auto flex-1"
        ref={wrapperRef}
      >
        <div className="flex flex-wrap w-[1100px] max-w-full">
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
      <div className="max-h-[75%]">{activeColumn && <MelodicSettings />}</div>
    </div>
  );
};

interface EditorProps {
  song: Song;
  tuning: Tuning;
  readonly: boolean;
}
const Editor = ({ song, tuning, readonly }: EditorProps) => {
  console.log("readonly", readonly);
  return (
    <TuningContextProvider tuning={tuning}>
      <SongContextProvider initialSong={song}>
        <SongWrapper />
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
