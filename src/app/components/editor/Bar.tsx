"use client";
import { useEffect, useRef, useState } from "react";
import { Bar as BarType } from "./../../types";
import Column from "./Column";
import { useSongContext } from "./songContext";

interface BarProps {
  bar: BarType;
  lastBar: BarType;
  barIndex: number;
}
const Bar = ({ bar, lastBar, barIndex }: BarProps) => {
  const { duplicateBar, removeBar } = useSongContext();
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

  return (
    <div className="group flex relative">
      {bar.columns.map((column, i) => (
        <Column
          key={i}
          columnIndex={i}
          barIndex={barIndex}
          last={i === bar.columns.length - 1}
          column={column}
          previousColumn={
            i === 0
              ? lastBar?.columns[bar.columns.length - 1]
              : bar.columns[i - 1]
          }
        />
      ))}
      <div className="absolute right-0 top-0 bg-transparent" ref={menuRef}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Bar;
