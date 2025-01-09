import { useMemo, useState } from "react";
import { TimeSignature } from "../../types";
import { MelodeonButtonWrapper } from "../MelodeonButton";
import NoteLength from "./NoteLength";
import { useSongContext } from "./songContext";
import { useTuningContext } from "./tuningContext";
import { useKeyboardListeners } from "./keyboardListenerContext";

interface NoteWithLengthProps {
  timeSignature: TimeSignature;
  length: number;
  onClick?: () => void;
  active?: boolean;
}

const NoteWithLength = ({
  length,
  onClick,
  timeSignature,
  active,
}: NoteWithLengthProps) => {
  return (
    <div
      onClick={() => onClick?.()}
      className={`w-12 flex flex-col items-center p-1 justify-between
        ${
          onClick
            ? "cursor-pointer border-gray-300 border rounded hover:bg-hel-bgHover"
            : ""
        }
        ${active ? "bg-hel-bgActive" : ""}
        `}
    >
      <NoteLength timeSignature={timeSignature} length={length} />
      <div>{length}</div>
    </div>
  );
};

interface NoteLengthSelectorProps {
  length: number;
  onChange: (length: number) => void;
  timeSignature: TimeSignature;
  min: 0.5 | 1;
}
const NoteLengthSelector = ({
  length,
  onChange,
  timeSignature,
  min,
}: NoteLengthSelectorProps) => {
  useKeyboardListeners({
    id: "singleNoteLengthSelect",
    keys: ["ArrowLeft", "ArrowRight"],
    listener: (key) => {
      if (key === "ArrowLeft") {
        onChange(Math.max(min, length - 0.5));
      } else if (key === "ArrowRight") {
        onChange(Math.min(16, length + 0.5));
      }
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {new Array(7).fill(0).map((_, i) => {
        const base = Math.max(length - 1.5, min);
        const val = base + i * 0.5;

        return (
          <NoteWithLength
            key={i}
            onClick={() => onChange(val)}
            timeSignature={timeSignature}
            length={val}
            active={val === length}
          />
        );
      })}
    </div>
  );
};

const NoteLengthSelect = () => {
  const { tuning } = useTuningContext();
  const { song, activeColumn, setLength } = useSongContext();

  const [activeButton, setActiveButton] = useState<{
    rowIndex: number;
    buttonIndex: number;
  }>({ rowIndex: 0, buttonIndex: 0 });

  console.log("activeButton", activeButton);

  const column = useMemo(
    () =>
      activeColumn
        ? song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex]
        : null,
    [activeColumn, song]
  );

  const melodicRows =
    column && activeColumn
      ? tuning.melodic
          .toReversed()
          // Filter before map, because the rowIndex has to start from 0
          .filter((row) => {
            const subCells = column.melodic[row.row - 1].subCells;
            const items = subCells[activeColumn.subColumnIndex].items.filter(
              (item) => item.type === "note"
            );

            return items.length > 0;
          })
      : [];

  useKeyboardListeners({
    id: "noteLengthSelect",
    keys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    listener: (key) => {
      if (!column || !activeColumn) {
        return;
      }
      if (key === "ArrowDown") {
        setActiveButton((ab) => {
          const row = melodicRows[ab.rowIndex];
          if (!row) {
            return ab;
          }
          const subCells = column.melodic[row.row - 1].subCells;
          const itemsLength = subCells[
            activeColumn.subColumnIndex
          ].items.filter((item) => item.type === "note").length;

          return ab.buttonIndex + 1 < itemsLength
            ? { ...ab, buttonIndex: ab.buttonIndex + 1 }
            : {
                rowIndex: Math.min(ab.rowIndex + 1, melodicRows.length),
                buttonIndex: 0,
              };
        });
      } else if (key === "ArrowUp") {
        setActiveButton((ab) => {
          if (ab.rowIndex === 0 && ab.buttonIndex === 0) {
            return ab;
          }
          const subCells =
            column.melodic[Math.max(ab.rowIndex - 1, 0)].subCells;
          const itemsLength = subCells[
            activeColumn.subColumnIndex
          ].items.filter((item) => item.type === "note").length;
          return ab.buttonIndex > 0
            ? { ...ab, buttonIndex: ab.buttonIndex - 1 }
            : {
                rowIndex: Math.max(ab.rowIndex - 1, 0),
                buttonIndex: itemsLength - 1,
              };
        });
      }
    },
  });

  if (!activeColumn || !column) {
    return null;
  }

  const hasBassPart = !!(
    column &&
    activeColumn &&
    column.bass.subCells[activeColumn.subColumnIndex]
  );

  const bassRowId = melodicRows.length;

  return (
    <div className="flex w-full flex-col">
      {melodicRows.map((row, rowIndex) => {
        const subCells = column.melodic[row.row - 1].subCells;

        const isMulti = subCells.length > 1;

        const items = subCells[activeColumn.subColumnIndex].items.filter(
          (item) => item.type === "note"
        );

        return (
          <>
            <div className="w-[800px] max-w-[90vw] border-b text-center my-2">
              Rad {row.row}
            </div>
            {items.map((item, buttonIndex) => {
              const isActive =
                rowIndex === activeButton.rowIndex &&
                buttonIndex === activeButton.buttonIndex;

              const length =
                // If split, allow minimum 0.5 length, 1 otherwise
                item.length ?? (subCells.length > 1 ? 0.5 : 1);

              return (
                <div
                  key={row.row + item.button}
                  className="flex items-center justify-between min-h-14 flex-wrap"
                >
                  <div className="flex items-center">
                    <MelodeonButtonWrapper
                      selected={isActive}
                      onClick={() => {
                        setActiveButton({ rowIndex, buttonIndex });
                      }}
                    >
                      {item.button}
                    </MelodeonButtonWrapper>
                    <div>
                      <div>Nota:</div>
                      <div>Stĺpce:</div>
                    </div>
                    <NoteWithLength
                      timeSignature={song.timeSignature}
                      length={length}
                    />
                  </div>
                  {isActive && (
                    <NoteLengthSelector
                      timeSignature={song.timeSignature}
                      length={item.length ?? 1}
                      onChange={(length) =>
                        setLength(length, {
                          row: row.row,
                          button: item.button,
                        })
                      }
                      min={isMulti ? 0.5 : 1}
                    />
                  )}
                </div>
              );
            })}
          </>
        );
      })}
      <div>
        <div>Basy</div>
        {
          // const subCells = column.melodic[row.row - 1].subCells;
          hasBassPart &&
            column.bass.subCells[activeColumn.subColumnIndex].items.map(
              (item, buttonIndex) => {
                if (item.type === "bass") {
                  const isMulti = column.bass.subCells.length > 1;
                  const length =
                    // If split, allow minimum 0.5 length, 1 otherwise
                    item.length ?? (column.bass.subCells.length > 1 ? 0.5 : 1);

                  // TODO:
                  const isActive =
                    activeButton.rowIndex === bassRowId &&
                    buttonIndex === activeButton.buttonIndex;

                  return (
                    <div
                      key={item.note.note}
                      className="flex items-center justify-between min-h-14 flex-wrap"
                    >
                      <div className="flex items-center">
                        <MelodeonButtonWrapper
                          selected={isActive}
                          onClick={() => {
                            setActiveButton({
                              rowIndex: bassRowId,
                              buttonIndex,
                            });
                          }}
                        >
                          {item.note.note}
                        </MelodeonButtonWrapper>
                        <div>
                          <div>Nota:</div>
                          <div>Stĺpce:</div>
                        </div>
                        <NoteWithLength
                          timeSignature={song.timeSignature}
                          length={length}
                        />
                      </div>
                      {isActive && (
                        <NoteLengthSelector
                          timeSignature={song.timeSignature}
                          length={item.length ?? 1}
                          onChange={(length) =>
                            setLength(length, {
                              row: "bass",
                              bass: item.note,
                            })
                          }
                          min={isMulti ? 0.5 : 1}
                        />
                      )}
                    </div>
                  );
                  // return (
                  //   <div key={item.note.note}>
                  //     {item.note.note}
                  //     <select
                  //       className="bg-transparent"
                  //       value={length}
                  //       onChange={(e) => {
                  //         setLength(parseFloat(e.target.value), {
                  //           row: "bass",
                  //           bass: item.note,
                  //         });
                  //       }}
                  //     >
                  //       {new Array(16).fill(0).map((_, i) => {
                  //         const val = (i + 1) / 2;
                  //         return (
                  //           <option key={val} value={val}>
                  //             {val}
                  //           </option>
                  //         );
                  //       })}
                  //     </select>
                  //   </div>
                  // );
                }
              }
            )
        }
      </div>
    </div>
  );
};

export default NoteLengthSelect;
