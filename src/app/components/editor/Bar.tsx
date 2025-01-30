"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import {
  LINE_HEADING_WIDTH_WITH_BORDER,
  VARIANT_CELL_HEIGHT,
} from "../../../utils/consts";
import { Bar as BarType } from "./../../types";
import Column from "./Column";
import Instructions from "./Instructions";
import LineHeading from "./LineHeading";
import ModalWrapper from "./ModalWrapper";
import RepeatSign from "./RepeatSign";
import { useSheetContext } from "./sheetContext";

interface BarProps {
  bar: BarType;
  previousBar?: BarType;
  followingBar?: BarType;
  barIndex: number;
}
const Bar = ({ bar, previousBar, followingBar, barIndex }: BarProps) => {
  const {
    instructions,
    duplicateBar,
    copyBarToTheEnd,
    removeBar,
    setRepeatOfBar,
    addColumnToBar,
    removeLastColumnFromBar,
    setBarInstruction,
    isEditing,
  } = useSheetContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectingInstruction, setIsSelectingInstruction] = useState(false);

  const instruction = bar.instruction
    ? instructions.find((v) => v.id === bar.instruction)
    : null;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as HTMLElement)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  const handleChangeRepeat = (
    type: keyof Exclude<BarType["repeat"], undefined>
  ) => {
    setRepeatOfBar(barIndex, {
      start: false,
      end: false,
      ...bar.repeat,
      [type]: !bar.repeat?.[type],
    });
  };

  return (
    <div className={`flex group flex-col relative`}>
      <div
        className={`z-0 w-0 absolute`}
        style={{
          left: -LINE_HEADING_WIDTH_WITH_BORDER,
          marginTop: VARIANT_CELL_HEIGHT,
        }}
      >
        <LineHeading />
      </div>
      <div
        className={`text-xs 
          -ml-[2px]
          ${instruction ? "border-t-2 px-3 border-black" : "border-transparent"}
          ${
            previousBar?.instruction === bar.instruction
              ? "border-l-0"
              : "border-l-2"
          }
          ${
            followingBar?.instruction === bar.instruction
              ? "border-r-0"
              : "border-r-2"
          }
          `}
        style={{ height: VARIANT_CELL_HEIGHT }}
      >
        {previousBar?.instruction !== bar.instruction && instruction
          ? instruction.renderText ?? instruction.name
          : null}
      </div>
      <div className="flex z-10 bg-hel-bgDefault">
        {/* {onNewLine && <LineHeading />} */}
        {bar.repeat?.start && <RepeatSign type="start" topOffset={20} />}
        {bar.repeat?.end && <RepeatSign type="end" topOffset={20} />}
        {bar.columns.map((column, i) => (
          <Column
            key={i}
            columnIndex={i}
            barIndex={barIndex}
            lastColumnInBar={i === bar.columns.length - 1}
            column={column}
            previousColumn={
              i === 0
                ? previousBar?.columns[bar.columns.length - 1]
                : bar.columns[i - 1]
            }
            followingColumn={
              i === bar.columns.length - 1
                ? followingBar?.columns[0]
                : bar.columns[i + 1]
            }
          />
        ))}
      </div>
      {isEditing && (
        <div
          className="absolute right-0 -top-2 bg-transparent z-20 print:hidden w-fit"
          ref={menuRef}
        >
          {!isMenuOpen && (
            <div>
              <button
                type="button"
                className="hidden group-hover:inline-flex w-full justify-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => setIsMenuOpen(true)}
              >
                <ChevronDownIcon className="w-4 text-gray-400" />
              </button>
            </div>
            // <button
            //   className="border border-black hidden group-hover:block px-2 text-xs rounded-md bg-[#e3d9bc] shadow"
            //   onClick={() => {
            //     setIsMenuOpen(true);
            //   }}
            // >
            //   ...
            // </button>
          )}
          {isMenuOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                {(
                  [
                    {
                      label: "Duplikovať takt",
                      onClick: () => duplicateBar(barIndex),
                    },
                    {
                      label: "Vymazať takt",
                      onClick: () => {
                        removeBar(barIndex);
                        setIsMenuOpen(false);
                      },
                    },
                    {
                      label: "Skopírovať takt na koniec",
                      onClick: () => {
                        copyBarToTheEnd(barIndex);
                      },
                    },
                    null,
                    {
                      label: bar.repeat?.start
                        ? "Zrušiť začiatok opakovania"
                        : "Začať opakovanie",
                      onClick: () => {
                        handleChangeRepeat("start");
                      },
                    },
                    {
                      label: bar.repeat?.end
                        ? "Zrušiť koniec opakovania"
                        : "Ukončiť opakovanie",
                      onClick: () => {
                        handleChangeRepeat("end");
                      },
                    },
                    null,
                    {
                      label: bar.instruction
                        ? "Odobrať inštrukciu"
                        : "Pridať inštrukciu",
                      onClick: () => {
                        if (bar.instruction) {
                          setBarInstruction(barIndex, undefined);
                        } else {
                          setIsSelectingInstruction(true);
                        }
                        setIsMenuOpen(false);
                      },
                    },
                    null,
                    {
                      label: "Pridať stĺpec",
                      onClick: () => {
                        addColumnToBar(barIndex);
                      },
                    },
                    {
                      label: "Odstrániť stĺpec",
                      onClick: () => {
                        removeLastColumnFromBar(barIndex);
                      },
                    },
                  ] as const
                ).map((item, i) =>
                  item ? (
                    <div
                      key={i}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden"
                      role="menuitem"
                      id="menu-item-0"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </div>
                  ) : (
                    <hr key={i} className="my-1" />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {isSelectingInstruction && (
        <ModalWrapper close={() => setIsSelectingInstruction(false)}>
          <Instructions
            onSelect={(instructionId) => {
              setBarInstruction(barIndex, instructionId);
              setIsSelectingInstruction(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export default Bar;
