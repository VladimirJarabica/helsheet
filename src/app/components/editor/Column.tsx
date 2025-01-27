"use client";
import * as R from "ramda";
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import { CELL_SIZE } from "../../../utils/consts";
import { Column as ColumnType } from "./../../types";
import Cell from "./Cell";
import DirectionCell from "./DirectionCell";
import { useSheetContext } from "./sheetContext";

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
  const { setText, activeColumn, setActiveColumn, isEditing } =
    useSheetContext();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const [hoveredSubColumnIndex, setHoveredSubColumnIndex] = useState<
    number | null
  >(null);

  const resizeTextArea = () => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height =
        Math.max(17, textRef.current.scrollHeight) + "px";
    }
  };

  useLayoutEffect(() => {
    resizeTextArea();
  }, []);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    resizeTextArea();
    setText(e.target.value, { barIndex, columnIndex });
  };

  return (
    <div style={{ width: CELL_SIZE }}>
      <div
        className={`border-t-2 border-b-2 border-black ${
          lastColumnInBar ? "border-r-2" : "border-r"
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
              type="note"
              lastColumnInBar={lastColumnInBar}
              cell={cell}
              barIndex={barIndex}
              columnIndex={columnIndex}
              setHoveredSubColumnIndex={setHoveredSubColumnIndex}
              hoveredSubColumnIndex={hoveredSubColumnIndex}
              directions={column.directions}
            />
          ))}
        <Cell
          type="bass"
          lastColumnInBar={lastColumnInBar}
          cell={column.bass}
          barIndex={barIndex}
          columnIndex={columnIndex}
          setHoveredSubColumnIndex={setHoveredSubColumnIndex}
          hoveredSubColumnIndex={hoveredSubColumnIndex}
          directions={column.directions}
        />
        <div className="flex">
          {column.directions.map((direction, i) => {
            const isFirstDirectionInBar = columnIndex === 0 && i === 0;
            const isLastDirectionInBar =
              lastColumnInBar && i === column.directions.length - 1;

            const previousDirection =
              i > 0
                ? column.directions[i].direction
                : R.last(previousColumn?.directions ?? [])?.direction;

            const followingDirection =
              i < column.directions.length - 1
                ? column.directions[i + 1].direction
                : followingColumn?.directions[0]?.direction;
            return (
              <DirectionCell
                key={i}
                direction={direction.direction}
                isFirst={i === 0}
                previousDirection={
                  isFirstDirectionInBar ? null : previousDirection
                }
                followingDirection={
                  isLastDirectionInBar ? null : followingDirection
                }
                onHoverChange={
                  isEditing
                    ? (hovered) => setHoveredSubColumnIndex(hovered ? 0 : null)
                    : undefined
                }
                hovered={hoveredSubColumnIndex === i}
                onClick={() => {
                  setActiveColumn({
                    barIndex,
                    columnIndex: columnIndex,
                    subColumnIndex: i,
                  });
                }}
                active={
                  !!activeColumn &&
                  activeColumn.barIndex === barIndex &&
                  activeColumn.columnIndex === columnIndex &&
                  activeColumn.subColumnIndex === i
                }
              />
            );
          })}
        </div>
      </div>
      <textarea
        ref={textRef}
        disabled={!isEditing}
        rows={1}
        className={`
          border-gray-500 mt-1 bg-transparent w-full text-xs outline-none mx-[1px] resize-none print:border-none
          ${isEditing ? "border-b" : "border-none"}
          `}
        value={column.text ?? ""}
        onChange={handleInput}
      />
    </div>
  );
};

export default Column;
