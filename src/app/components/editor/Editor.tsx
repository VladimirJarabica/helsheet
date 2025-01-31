"use client";
import {
  CheckIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Sheet, SheetAccess, SongAuthorType, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  BAR_LINES_PER_PAGE,
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
  LINE_HEADING_WIDTH_WITH_BORDER,
  TIME_SIGNATURE_VALUE,
  VARIANT_CELL_HEIGHT,
} from "../../../utils/consts";
import { formatScaleId } from "../../../utils/scale";
import { getSheetUrl } from "../../../utils/sheet";
import { SongContent } from "../../types";
import { changeSheetAccess, deleteSheet, updateSheet } from "../actions";
import Button from "../Button";
import ToggleButton from "../ToggleButton";
import Bar from "./Bar";
import ColumnSettings from "./ColumnSettings";
import HelpButton from "./HelpModal";
import {
  KeyboardListenerContextProvider,
  useKeyboardListener,
} from "./keyboardListenerContext";
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
    | "timeSignature"
    | "tempo"
    | "genre"
    | "country"
    | "songAuthorType"
    | "songAuthor"
    | "originalSheetAuthor"
    | "source"
    | "access"
    | "updatedAt"
  > & {
    SheetAuthor: Pick<User, "id" | "nickname">;
  };
  editable: boolean;
}

const SongWrapper = ({ sheet, editable }: SongWrapperProps) => {
  const router = useRouter();
  const {
    song,
    saveStatus,
    activeColumn,
    addBar,
    save,
    setActiveColumn,
    isEditing,
    setEditing,
    tuning,
  } = useSheetContext();

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
      <div className="flex max-w-[930px] print:max-w-[700px] w-11/12 pt-5 print:pt-2 flex-col gap-4 justify-between">
        <div className="flex items-start gap-2 justify-between ">
          <div>
            <div className="text-2xl font-bold flex gap-2 items-start">
              {sheet.name}
              {isEditing && (
                <div className="text-sm text-gray-600 font-normal mt-2">
                  ({saveStatus === "saved" ? "uložené" : "ukladám..."})
                </div>
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

            <div className="print:hidden flex items-center gap-2 justify-end flex-wrap md:flex-nowrap">
              {isEditing && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSettingOpen(true);
                    }}
                    icon={<Cog6ToothIcon className="w-5" />}
                    smOnlyIcon
                  >
                    Nastavenia
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (saveStatus === "unsaved") {
                        await save();
                      }
                      setEditing(false);
                    }}
                    icon={<CheckIcon className="w-5" />}
                    smOnlyIcon
                  >
                    Hotovo
                  </Button>
                  <HelpButton />
                </>
              )}
              {editable && (
                <>
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(true);
                      }}
                      icon={<PencilIcon className="w-5" />}
                      smOnlyIcon
                    >
                      Upraviť
                    </Button>
                  )}
                  <ToggleButton
                    options={[
                      { label: "Verejné", value: SheetAccess.public },
                      { label: "Skryté", value: SheetAccess.private },
                    ]}
                    value={sheet.access}
                    onChange={async (value) => {
                      if (value !== sheet.access) {
                        await changeSheetAccess(sheet, value);
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`px-2 pt-5 print:pt-5 sm:px-4 max-w-[930px] w-11/12`}>
        <div className="flex justify-between text-sm flex-wrap">
          <div className="flex gap-4">
            {sheet.tempo && (
              <div className="flex gap-1">
                <Image
                  src={`/quarter-note.png`}
                  className="h-[15px] mt-0.5"
                  width={4.75}
                  height={15}
                  alt="note"
                />
                = {sheet.tempo}
              </div>
            )}
            {sheet.scale && <div>{formatScaleId(sheet.scale)}</div>}
            <div>{TIME_SIGNATURE_VALUE[sheet.timeSignature]}</div>
          </div>
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
          
          ${activeColumn ? "pb-[50vh]" : ""}
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
      <div className="w-full max-w-[930px] flex justify-between text-xs flex-wrap mt-8 px-2 sm:px-4">
        <div>
          Naposledy upravené:{" "}
          {`${sheet.updatedAt.getDate()}.${
            sheet.updatedAt.getMonth() + 1
          }.${sheet.updatedAt.getFullYear()}`}
        </div>
        <a href="https://martincernansky.com/" target="_blank">
          Tabuľková metóda zápisu podľa Martina Čerňanského
        </a>
      </div>
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
    | "timeSignature"
    | "tempo"
    | "genre"
    | "country"
    | "songAuthorType"
    | "songAuthor"
    | "originalSheetAuthor"
    | "source"
    | "content"
    | "access"
    | "updatedAt"
  > & {
    SheetAuthor: Pick<User, "id" | "nickname">;
  };
  editable: boolean;
}
const Editor = ({ sheet, editable }: EditorProps) => {
  console.log("Sheet", sheet);
  return (
    <SheetContextProvider
      editable={editable}
      sheet={sheet}
      initialSong={sheet.content as SongContent}
    >
      <KeyboardListenerContextProvider>
        <SongWrapper sheet={sheet} editable={editable} />
      </KeyboardListenerContextProvider>
    </SheetContextProvider>
  );
};

export default Editor;
