"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Column as ColumnType } from "./../../types";
import Cell from "./Cell";
import { useSongContext } from "./songContext";
import DirectionCell from "./DirectionCell";
import { CELL_SIZE } from "../../../utils/consts";

interface ColumnProps {
  lastColumnInBar: boolean;
  column: ColumnType;
  previousColumn?: ColumnType;
  followingColumn?: ColumnType;
  barIndex: number;
  columnIndex: number;
}

const Column = ({
  column,
  lastColumnInBar,
  previousColumn,
  followingColumn,
  barIndex,
  columnIndex,
}: ColumnProps) => {
  const { setText, activeColumn } = useSongContext();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const [hoveredSubColumnIndex, setHoveredSubColumnIndex] = useState<
    number | null
  >(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = Math.max(33, e.target.scrollHeight) + "px";
      console.log("setting height", Math.max(33, e.target.scrollHeight) + "px");
    }
    setText(e.target.value, { barIndex, columnIndex });
  };

  useEffect(() => {
    if (textRef.current) {
      // textRef.current.style.height = "32px";
    }
  }, []);

  return (
    <div style={{ width: CELL_SIZE }}>
      <div
        className={`border-t-2 border-b-2 border-black ${
          lastColumnInBar ? "border-r-2" : "border-r"
        }
         ${
           column.direction === "push"
             ? "bg-hel-bgEmphasis text-hel-textEmphasis"
             : ""
         }
         `}
      >
        {column.melodic
          .toSorted((cellA, cellB) =>
            typeof cellA.row === "number" && typeof cellB.row === "number"
              ? cellB.row - cellA.row
              : 0
          )
          .map((cell, i) => (
            <Cell
              key={i}
              lastColumnInBar={lastColumnInBar}
              cell={cell}
              barIndex={barIndex}
              columnIndex={columnIndex}
              setHoveredSubColumnIndex={setHoveredSubColumnIndex}
              hoveredSubColumnIndex={hoveredSubColumnIndex}
            />
          ))}
        <Cell
          lastColumnInBar={lastColumnInBar}
          cell={column.bass}
          barIndex={barIndex}
          columnIndex={columnIndex}
          setHoveredSubColumnIndex={setHoveredSubColumnIndex}
          hoveredSubColumnIndex={hoveredSubColumnIndex}
        />
        <DirectionCell
          direction={column.direction}
          previousDirection={previousColumn?.direction}
          followingDirection={followingColumn?.direction}
          onHoverChange={(hovered) =>
            setHoveredSubColumnIndex(hovered ? 0 : null)
          }
          hovered={hoveredSubColumnIndex === 0}
          active={
            activeColumn?.barIndex === barIndex &&
            activeColumn?.columnIndex === columnIndex &&
            activeColumn?.subColumnIndex === 0
          }
        />
      </div>
      <textarea
        ref={textRef}
        className="border-gray-500 mt-1 bg-transparent border-b w-full text-xs outline-none mx-[1px] resize-none print:border-none"
        value={column.text ?? ""}
        onChange={handleInput}
      />
    </div>
  );
};

export default Column;
