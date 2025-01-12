"use client";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Sheet, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import {
  BAR_LINES_PER_PAGE,
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
  LINE_HEADING_WIDTH_WITH_BORDER,
  VARIANT_CELL_HEIGHT,
} from "../../../utils/consts";
import { getSheetUrl } from "../../../utils/sheet";
import {
  createTag,
  removeTagFromSheet,
  setTagToSheet,
} from "../../../utils/tags";
import { SongContent } from "../../types";
import { deleteSheet, updateSheet } from "../actions";
import Button from "../Button";
import TagPill from "../TagPill";
import { useTags } from "../TagsContext";
import Bar from "./Bar";
import ColumnSettings from "./ColumnSettings";
import { KeyboardListenerContextProvider } from "./keyboardListenerContext";
import LikeSheetButton from "./LikeSheetButton";
import ModalWrapper from "./ModalWrapper";
import SheetSettings from "./SheetSettings";
import { SongContextProvider, useSongContext } from "./songContext";
import { TuningContextProvider, useTuningContext } from "./tuningContext";
import Verses from "./Verses";

interface SongWrapperProps {
  sheet: Pick<Sheet, "id" | "name" | "tuning" | "sourceText" | "sourceUrl"> & {
    Author: Pick<User, "id" | "nickname">;
    Tags: Pick<Tag, "id" | "name">[];
  };
  liked: boolean;
  editable: boolean;
}

const SongWrapper = ({ sheet, liked, editable }: SongWrapperProps) => {
  const router = useRouter();
  const {
    song,
    activeColumn,
    addBar,
    save,
    setActiveColumn,
    isEditing,
    setEditing,
  } = useSongContext();
  const tags = useTags();

  const { tuning } = useTuningContext();

  const barsWrapperRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [settingOpen, setSettingOpen] = useState(false);

  return (
    <div
      className="max-h-[100vh] w-screen flex flex-col items-center"
      onClick={(e) => {
        if (
          activeColumn &&
          !barsWrapperRef.current?.contains(e.target as Node)
        ) {
          setActiveColumn(null);
        }
      }}
      ref={wrapperRef}
    >
      <div className="flex max-w-[700px] w-11/12 pt-5 print:pt-2 flex-col gap-4 justify-between">
        <div className="flex items-end gap-2 justify-between">
          <div className="text-2xl font-bold flex gap-2 items-center">
            {sheet.name}
            {!isEditing && (
              <div className="print:hidden">
                <LikeSheetButton sheetId={sheet.id} liked={liked} />
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {!isEditing && (
              <span className="text-base print:hidden">
                (zapísal {sheet.Author.nickname})
              </span>
            )}
            <div className="print:hidden flex gap-2">
              {isEditing && (
                <>
                  <Button
                    onClick={() => {
                      setSettingOpen(true);
                    }}
                  >
                    <Cog6ToothIcon className="w-5" />
                  </Button>
                  <Button
                    onClick={async () => {
                      await save();
                    }}
                  >
                    Uložiť
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Ukončiť
                  </Button>
                </>
              )}
              {!isEditing && editable && (
                <Button
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  Upraviť
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="print:hidden flex gap-1 items-center">
          {sheet.Tags.map((tag) => (
            <TagPill
              key={tag.id}
              tag={tag}
              onRemove={
                isEditing
                  ? () => {
                      removeTagFromSheet(sheet.id, tag.id);
                    }
                  : undefined
              }
            />
          ))}
          {isEditing && (
            <CreatableSelect<{ value: number; label: string }>
              className="w-40 z-20"
              options={tags
                .filter((tag) => !sheet.Tags.some((t) => t.id === tag.id))
                .map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
              onCreateOption={async (option) => {
                const newTag = await createTag(option);
                setTagToSheet(sheet.id, newTag.id);
              }}
              value={null}
              onChange={(value) => {
                if (value) {
                  setTagToSheet(sheet.id, value.value);
                }
              }}
            />
          )}
        </div>
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
          style={{ paddingLeft: LINE_HEADING_WIDTH_WITH_BORDER }}
        >
          {song.bars.map((bar, i) => (
            <div
              key={i}
              className={
                (i + 1) % (4 * BAR_LINES_PER_PAGE) === 0
                  ? "--print:break-after-page"
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
          {isEditing && (
            <div
              className="print:hidden"
              style={{ marginTop: VARIANT_CELL_HEIGHT }}
            >
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
      {isEditing && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {activeColumn && <ColumnSettings />}
        </div>
      )}
      {settingOpen && (
        <ModalWrapper close={() => setSettingOpen(false)}>
          <SheetSettings
            onSubmit={async (data) => {
              const updatedSheet = await updateSheet(sheet, data);
              if (updatedSheet) {
                setSettingOpen(false);
                router.replace(getSheetUrl(updatedSheet));
              }
            }}
            onDelete={async () => {
              await deleteSheet(sheet);
              router.push("/");
            }}
            sheet={sheet}
            timeSignature={song.timeSignature}
            nickname={sheet.Author.nickname}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

interface EditorProps {
  sheet: Pick<
    Sheet,
    "id" | "name" | "tuning" | "sourceText" | "sourceUrl" | "content"
  > & {
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
        <KeyboardListenerContextProvider>
          <SongWrapper sheet={sheet} liked={liked} editable={editable} />
        </KeyboardListenerContextProvider>
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
