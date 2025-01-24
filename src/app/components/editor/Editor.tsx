"use client";
import {
  Cog6ToothIcon,
  GlobeEuropeAfricaIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Sheet, SheetAccess, SongAuthorType, Tag, User } from "@prisma/client";
import Image from "next/image";
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
import { createTag, setTagToSheet } from "../../../utils/tags";
import { SongContent } from "../../types";
import { changeSheetAccess, deleteSheet, updateSheet } from "../actions";
import Button from "../Button";
import { useTags } from "../TagsContext";
import Bar from "./Bar";
import ColumnSettings from "./ColumnSettings";
import {
  KeyboardListenerContextProvider,
  useKeyboardListener,
} from "./keyboardListenerContext";
import LikeSheetButton from "./LikeSheetButton";
import ModalWrapper from "./ModalWrapper";
import { SheetContextProvider, useSheetContext } from "./sheetContext";
import SheetSettings from "./SheetSettings";
import SourceUrl from "./SourceUrl";
import Verses from "./Verses";

interface SongWrapperProps {
  sheet: Pick<
    Sheet,
    | "id"
    | "name"
    | "description"
    | "tuning"
    | "scale"
    | "tempo"
    | "genre"
    | "country"
    | "songAuthorType"
    | "songAuthor"
    | "originalSheetAuthor"
    | "source"
    | "access"
  > & {
    SheetAuthor: Pick<User, "id" | "nickname">;
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
    tuning,
  } = useSheetContext();
  const tags = useTags();

  useKeyboardListener({ id: "newBar", key: "+", listener: () => addBar() });

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
          <div>
            <div className="text-2xl font-bold flex gap-2 items-center">
              {sheet.name}
              {!isEditing && (
                <LikeSheetButton
                  className="print:hidden"
                  sheetId={sheet.id}
                  liked={liked}
                />
              )}
            </div>
            {sheet.songAuthorType === SongAuthorType.original_song &&
              sheet.songAuthor && <div>{sheet.songAuthor}</div>}
          </div>
          <div className="flex gap-2 items-center">
            {!isEditing && (
              <span className="text-base print:hidden">
                ({sheet.SheetAuthor.nickname})
              </span>
            )}
            <div className="print:hidden flex gap-2">
              {isEditing && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSettingOpen(true);
                    }}
                  >
                    <Cog6ToothIcon className="w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await save();
                    }}
                  >
                    Uložiť
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Ukončiť
                  </Button>
                </>
              )}
              {!isEditing && editable && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Upraviť
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await changeSheetAccess(
                        sheet,
                        sheet.access === SheetAccess.private
                          ? SheetAccess.public
                          : SheetAccess.private
                      );
                    }}
                    className="flex"
                  >
                    {sheet.access === SheetAccess.private ? (
                      <>
                        <LockClosedIcon className="w-4 mr-1" />
                        Súkromné
                      </>
                    ) : (
                      <>
                        <GlobeEuropeAfricaIcon className="w-4 mr-1" />
                        Verejné
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="print:hidden flex gap-1 items-center">
          {/* {sheet.Tags.map((tag) => (
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
          ))} */}
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
      <div className={`px-2 pt-5 print:pt-5 sm:px-4`}>
        <div className="flex justify-between text-sm flex-wrap">
          {sheet.tempo ? (
            <div className="flex gap-1">
              <Image
                src={`/quarter-note.png`}
                className=" h-[15px] w-[auto] mt-0.5"
                width={20}
                height={20}
                alt="note"
              />
              = {sheet.tempo}
            </div>
          ) : (
            <div />
          )}
          <div>
            <div className="flex gap-x-4 flex-wrap">
              <div>
                Zapísal:&nbsp;
                {sheet.originalSheetAuthor ?? sheet.SheetAuthor.nickname}
              </div>
              <SourceUrl url={sheet.source} />
            </div>
          </div>
        </div>
        <div
          className={`
          flex flex-1 flex-wrap justify-center
          sm:justify-start
          print:w-full
          max-w-[930px]
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
        <div className="flex justify-end text-sm print:hidden">
          <a href="https://martincernansky.com/" target="_blank">
            Tabulátorový zápis podľa Martina Čerňanského
          </a>
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
            nickname={sheet.SheetAuthor.nickname}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

interface EditorProps {
  sheet: Pick<
    Sheet,
    | "id"
    | "name"
    | "description"
    | "tuning"
    | "scale"
    | "tempo"
    | "genre"
    | "country"
    | "songAuthorType"
    | "songAuthor"
    | "originalSheetAuthor"
    | "source"
    | "content"
    | "access"
  > & {
    SheetAuthor: Pick<User, "id" | "nickname">;
    Tags: Pick<Tag, "id" | "name">[];
  };
  editable: boolean;
  liked: boolean;
}
const Editor = ({ sheet, editable, liked }: EditorProps) => {
  console.log("Sheet", sheet);
  return (
    <SheetContextProvider
      editable={editable}
      sheet={sheet}
      initialSong={sheet.content as SongContent}
    >
      <KeyboardListenerContextProvider>
        <SongWrapper sheet={sheet} liked={liked} editable={editable} />
      </KeyboardListenerContextProvider>
    </SheetContextProvider>
  );
};

export default Editor;
