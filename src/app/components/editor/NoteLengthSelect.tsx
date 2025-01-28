import { TimeSignature } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { MelodeonButtonWrapper } from "../MelodeonButton";
import { useKeyboardListeners } from "./keyboardListenerContext";
import NoteLength from "./NoteLength";
import { useSheetContext } from "./sheetContext";

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
  const { song, tuning, sheet, activeColumn, setLength } = useSheetContext();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeColumn]);

  const column = useMemo(
    () =>
      activeColumn
        ? song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex]
        : null,
    [activeColumn, song]
  );

  const hasBassPart = !!(
    column &&
    activeColumn &&
    column.bass.subCells[activeColumn.subColumnIndex]
  );

  const maxIndex = useMemo(() => {
    if (!activeColumn || !column) {
      return 0;
    }
    const melodicItems = column.melodic.flatMap(
      (row) => row.subCells[activeColumn.subColumnIndex].items
    ).length;
    const basItems = hasBassPart
      ? column.bass.subCells[activeColumn.subColumnIndex].items.length
      : 0;
    return melodicItems + basItems - 1;
  }, [activeColumn, column]);

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
        setActiveIndex((i) => Math.min(maxIndex, i + 1));
      } else if (key === "ArrowUp") {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
  });

  if (!activeColumn || !column) {
    return null;
  }

  let globalIndex = 0;

  return (
    <div className="flex w-full flex-col">
      {melodicRows.map((row) => {
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
            {items.map((item) => {
              const currentIndex = globalIndex;
              const isActive = currentIndex === activeIndex;
              globalIndex += 1;

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
                        setActiveIndex(currentIndex);
                      }}
                    >
                      {item.button}
                    </MelodeonButtonWrapper>
                    <div>
                      <div>Nota:</div>
                      <div>Stĺpce:</div>
                    </div>
                    <NoteWithLength
                      timeSignature={sheet.timeSignature}
                      length={length}
                    />
                  </div>
                  {isActive && (
                    <NoteLengthSelector
                      timeSignature={sheet.timeSignature}
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
        {hasBassPart &&
          column.bass.subCells[activeColumn.subColumnIndex].items.map(
            (item) => {
              if (item.type === "bass") {
                const isMulti = column.bass.subCells.length > 1;
                const length =
                  // If split, allow minimum 0.5 length, 1 otherwise
                  item.length ?? (column.bass.subCells.length > 1 ? 0.5 : 1);

                const currentIndex = globalIndex;
                const isActive = currentIndex === activeIndex;
                globalIndex += 1;

                return (
                  <div
                    key={item.note.note}
                    className="flex items-center justify-between min-h-14 flex-wrap"
                  >
                    <div className="flex items-center">
                      <MelodeonButtonWrapper
                        selected={isActive}
                        onClick={() => {
                          setActiveIndex(currentIndex);
                        }}
                      >
                        {item.note.note}
                      </MelodeonButtonWrapper>
                      <div>
                        <div>Nota:</div>
                        <div>Stĺpce:</div>
                      </div>
                      <NoteWithLength
                        timeSignature={sheet.timeSignature}
                        length={length}
                      />
                    </div>
                    {isActive && (
                      <NoteLengthSelector
                        timeSignature={sheet.timeSignature}
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
              }
            }
          )}
      </div>
    </div>
  );
};

export default NoteLengthSelect;
