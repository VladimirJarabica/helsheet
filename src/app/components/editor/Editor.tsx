"use client";
import { Sheet, Tag, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import {
  BAR_LINES_PER_PAGE,
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
  LINE_HEADING_WIDTH,
} from "../../../utils/consts";
import { getColumnsInBar } from "../../../utils/sheet";
import { createTag, setTagToSheet } from "../../../utils/tags";
import { SongContent } from "../../types";
import TagPill from "../TagPill";
import { useTags } from "../TagsContext";
import Bar from "./Bar";
import LikeSheetButton from "./LikeSheetButton";
import MelodicSettings from "./MelodicSettings";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider, useTuningContext } from "./tuningContext";
import Button from "../Button";
import Verses from "./Verses";

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
      className="max-h-[100vh] w-screen flex flex-col items-center"
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
      <div className="flex max-w-[700px] w-11/12 pt-5 flex-col gap-4 justify-between">
        <div className="flex items-end gap-2 justify-between">
          <div className="text-2xl font-bold">{sheet.name}</div>
          <div className="flex gap-2 items-center">
            <span className="text-base print:hidden">
              (zapísal {sheet.Author.nickname})
            </span>
            <div className="print:hidden">
              <Button
                onClick={async () => {
                  await save();
                }}
              >
                Uložiť
              </Button>
            </div>
          </div>
        </div>
        {!editable && (
          <div className="print:hidden">
            <LikeSheetButton sheetId={sheet.id} liked={liked} />
          </div>
        )}
        {editable && (
          <div className="print:hidden flex gap-1 items-center">
            {sheet.Tags.map((tag) => (
              <TagPill key={tag.id} tag={tag} />
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
        )}
      </div>
      <div className={`px-2 sm:px-4`}>
        <div
          className={`
          flex flex-1 pt-5 flex-wrap max-w-full justify-center
          sm:justify-start
          print:pt-5 print:w-full
          ${activeColumn ? "pb-[50vh] overflow-auto" : ""}
          `}
          ref={barsWrapperRef}
          style={{ paddingLeft: LINE_HEADING_WIDTH }}
        >
          {song.bars.map((bar, i) => (
            <div
              key={i}
              className={
                (i + 1) % (4 * BAR_LINES_PER_PAGE) === 0
                  ? "break-after-page"
                  : undefined
              }
            >
              <Bar
                bar={bar}
                barIndex={i}
                previousBar={song.bars[i - 1]}
                followingBar={song.bars[i + 1]}
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
      <Verses />
      {editable && (
        <div
          onClick={(e) => {
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
