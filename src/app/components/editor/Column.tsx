"use client";
import { ChangeEvent, useRef, useState } from "react";
import { Column as ColumnType } from "./../../types";
import Cell from "./Cell";
import { useSongContext } from "./songContext";
import DirectionCell from "./DirectionCell";

interface ColumnProps {
  last: boolean;
  column: ColumnType;
  previousColumn?: ColumnType;
  barIndex: number;
  columnIndex: number;
}

const Column = ({ column, last, barIndex, columnIndex }: ColumnProps) => {
  const { setText, activeColumn } = useSongContext();
  const ref = useRef<HTMLTextAreaElement>(null);

  const [hoveredSubColumnIndex, setHoveredSubColumnIndex] = useState<
    number | null
  >(null);
  console.log("hoveredSubColumnIndex", hoveredSubColumnIndex);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = e.target.scrollHeight + "px";
    }
    setText(e.target.value, { barIndex, columnIndex });
  };

  return (
    <div className="w-11">
      {column.melodic
        .toSorted((cellA, cellB) =>
          typeof cellA.row === "number" && typeof cellB.row === "number"
            ? cellB.row - cellA.row
            : 0
        )
        .map((cell, i) => (
          <Cell
            key={i}
            lastColumn={last}
            cell={cell}
            barIndex={barIndex}
            columnIndex={columnIndex}
            setHoveredSubColumnIndex={setHoveredSubColumnIndex}
            hoveredSubColumnIndex={hoveredSubColumnIndex}
          />
        ))}
      <Cell
        lastColumn={last}
        cell={column.bass}
        barIndex={barIndex}
        columnIndex={columnIndex}
        setHoveredSubColumnIndex={setHoveredSubColumnIndex}
        hoveredSubColumnIndex={hoveredSubColumnIndex}
      />
      <DirectionCell
        direction={column.direction}
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
      <textarea
        ref={ref}
        className="border-gray-500 bg-transparent border-b w-full text-sm outline-none mx-[1px] resize-none h-10 print:border-none"
        value={column.text ?? ""}
        onChange={handleInput}
      />
    </div>
  );
};

export default Column;
