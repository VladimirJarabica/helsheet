"use client";
import { Sheet, Tag, User } from "@prisma/client";
import CreatableSelect from "react-select/creatable";
import { useEffect, useRef, useState } from "react";
import {
  BAR_LINES_PER_PAGE,
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
} from "../../../utils/consts";
import { getColumnsInBar } from "../../../utils/sheet";
import { SongContent } from "../../types";
import MelodicSettings from "./MelodicSettings";
import Bar from "./Bar";
import LikeSheetButton from "./LikeSheetButton";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider, useTuningContext } from "./tuningContext";
import { useTags } from "../TagsContext";
import { createTag, setTagToSheet } from "../../../utils/tags";

interface SongWrapperProps {
  sheet: Pick<Sheet, "id" | "name"> & {
    Author: Pick<User, "id" | "nickname">;
    Tags: Pick<Tag, "id" | "name">[];
  };
  liked: boolean;
}

const SongWrapper = ({ sheet, liked }: SongWrapperProps) => {
  const { song, activeColumn, addBar, save, setActiveColumn, editable } =
    useSongContext();
  const tags = useTags();
  console.log("tags", tags);

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
      className="max-h-[100vh] flex flex-col items-center"
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
      <div className="flex w-[700px] pt-5 justify-between">
        <div className="flex items-end gap-2">
          <div className="text-2xl">{sheet.name}</div>
          <span className="text-base">(zapísal {sheet.Author.nickname})</span>
        </div>
        {!editable && <LikeSheetButton sheetId={sheet.id} liked={liked} />}
        {editable && (
          <div className="print:hidden flex">
            <div>
              {sheet.Tags.map((tag) => (
                <span key={tag.id} className="mr-2">
                  {tag.name}
                </span>
              ))}
              <CreatableSelect<{ value: number; label: string }>
                className="w-40 z-20"
                options={tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                onCreateOption={async (option) => {
                  console.log("new tag", option);
                  const newTag = await createTag(option);
                  setTagToSheet(sheet.id, newTag.id);
                }}
                value={null}
                onChange={(value) => {
                  console.log("value", value);
                  if (value) {
                    setTagToSheet(sheet.id, value.value);
                  }
                }}
              />
            </div>
            <button
              className="border border-black p-1 ml-4 rounded-md bg-[#0a0809] text-hel-bgDefault"
              onClick={() => {
                save();
              }}
            >
              Uložiť
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center pt-5 overflow-y-auto flex-1">
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
                className="border border-black p-1 ml-4 rounded-sm bg-[#e3d9bc] hover:bg-hel-bgEmphasis text-black w-10 text-xs"
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
    Tags: Pick<Tag, "id" | "name">[];
  };
  editable: boolean;
  liked: boolean;
}
const Editor = ({ sheet, editable, liked }: EditorProps) => {
  return (
    <TuningContextProvider tuning={sheet.tuning}>
      <SongContextProvider
        id={sheet.id}
        editable={editable}
        initialSong={sheet.content as SongContent}
      >
        <SongWrapper sheet={sheet} liked={liked} />
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
