"use client";
import { Sheet, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import {
  BAR_LINES_PER_PAGE,
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
} from "../../../utils/consts";
import { getColumnsInBar } from "../../../utils/sheet";
import { SongContent } from "../../types";
import MelodicSettings from "../MelodicSettings";
import Bar from "./Bar";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider, useTuningContext } from "./tuningContext";

interface SongWrapperProps {
  sheet: Pick<Sheet, "id" | "name"> & { Author: Pick<User, "id" | "nickname"> };
}

const SongWrapper = ({ sheet }: SongWrapperProps) => {
  const { song, activeColumn, addBar, save, setActiveColumn, editable } =
    useSongContext();

  const { tuning } = useTuningContext();

  const barsWrapperRef = useRef<HTMLDivElement>(null);
  console.log("barsWrapperRef", barsWrapperRef.current);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const columnsInBar = getColumnsInBar(song.timeSignature);

  const [barsPerLine, setBarsPerLine] = useState(4);
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
      <div className="w-[700px] mx-auto flex pt-5 justify-between">
        <div className="text-2xl">
          {sheet.name}{" "}
          <span className="text-base">(zapísal {sheet.Author.nickname})</span>
        </div>
        {editable && (
          <div className="print:hidden">
            <button
              className="border border-black p-1 ml-4 rounded-md bg-[#0a0809] text-[#e0dac8]"
              onClick={() => {
                save();
              }}
            >
              Uložiť
            </button>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center pt-5 overflow-y-auto flex-1 px-4">
        <div
          className="flex flex-wrap w-[700px] max-w-full print:visible"
          ref={barsWrapperRef}
        >
          {song.bars.map((bar, i) => (
            <div
              key={i}
              className={`${
                (i + 1) % (barsPerLine * BAR_LINES_PER_PAGE) === 0
                  ? "break-after-page"
                  : ""
              }`}
            >
              <Bar
                bar={bar}
                barIndex={i}
                previousBar={song.bars[i - 1]}
                followingBar={song.bars[i + 1]}
                onNewLine={i % barsPerLine === 0}
              />
            </div>
          ))}
          {editable && (
            <div className="print:hidden">
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
          )}
        </div>
      </div>
      {editable && (
        <div
          className="max-h-[75%] print:hidden"
          onClick={(e) => {
            console.log("Setting on click", e);
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {activeColumn && <MelodicSettings />}
        </div>
      )}
      {/* <BarGroups /> */}
    </div>
  );
};

interface EditorProps {
  sheet: Pick<Sheet, "id" | "content" | "name" | "tuning"> & {
    Author: Pick<User, "id" | "nickname">;
  };
  editable: boolean;
}
const Editor = ({ sheet, editable }: EditorProps) => {
  return (
    <TuningContextProvider tuning={sheet.tuning}>
      <SongContextProvider
        id={sheet.id}
        editable={editable}
        initialSong={sheet.content as SongContent}
      >
        <SongWrapper sheet={sheet} />
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
