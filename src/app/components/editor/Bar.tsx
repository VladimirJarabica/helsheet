"use client";
import { useEffect, useRef, useState } from "react";
import { Bar as BarType } from "./../../types";
import Column from "./Column";
import LineHeading from "./LineHeading";
import RepeatSign from "./RepeatSign";
import { useSongContext } from "./songContext";

interface BarProps {
  bar: BarType;
  previousBar?: BarType;
  followingBar?: BarType;
  barIndex: number;
  onNewLine: boolean;
}
const Bar = ({
  bar,
  previousBar,
  followingBar,
  barIndex,
  onNewLine,
}: BarProps) => {
  const { duplicateBar, removeBar, setRepeatOfBar, editable } =
    useSongContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="group flex relative">
      {onNewLine && <LineHeading />}
      {bar.repeat?.start && <RepeatSign type="start" />}
      {bar.repeat?.end && <RepeatSign type="end" />}
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
      {editable && (
        <div
          className="absolute right-0 top-0 bg-transparent z-10 print:hidden"
          ref={menuRef}
        >
          {!isMenuOpen && (
            <button
              className="border border-black hidden group-hover:block px-2 text-xs rounded-md bg-[#e3d9bc] shadow"
              onClick={() => {
                setIsMenuOpen(true);
              }}
            >
              ...
            </button>
          )}
          {isMenuOpen && (
            <div className="border border-black bg-[#e3d9bc] m-2 flex flex-col">
              <button
                onClick={() => duplicateBar(barIndex)}
                className="px-2 hover:bg-[#dbc991]"
              >
                Duplikovať takt
              </button>
              <button
                onClick={() => {
                  removeBar(barIndex);
                  setIsMenuOpen(false);
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                Vymazať takt
              </button>
              <button
                onClick={() => {
                  handleChangeRepeat("start");
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                {bar.repeat?.start
                  ? "Zrušiť začiatok opakovania"
                  : "Začať opakovanie"}
              </button>
              <button
                onClick={() => {
                  handleChangeRepeat("end");
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                {bar.repeat?.end
                  ? "Zrušiť koniec opakovania"
                  : "Ukončiť opakovanie"}
              </button>
              <button onClick={() => {}} className="px-2 hover:bg-[#dbc991]">
                Pridať do skupiny
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bar;
