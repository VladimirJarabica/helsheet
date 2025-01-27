"use client";
import React from "react";
import { CellItem, Direction, SubCell as SubCellType } from "./../../types";
import { sortNoteItems } from "../../../utils/sheet";

interface CellItemProps<Item extends CellItem> {
  type: Item["type"];
  subCell: SubCellType<Item>;
  isFirst: boolean;
  isMulti: boolean;
  isActive: boolean;
  onClick?: () => void;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
  direction: Direction;
  // onChange: (newSubCell: SubCellType) => void;
  // row: CellRow;
}

const SubCell = <Item extends CellItem>({
  type,
  subCell,
  isMulti,
  isFirst,
  isActive,
  onClick,
  onHoverChange,
  hovered,
  direction,
}: // onChange,
// row,
CellItemProps<Item>) => {
  const items = subCell.items;
  return (
    <div
      className={`flex flex-1 items-center flex-col justify-around leading-none overflow-hidden
        ${!isFirst ? "border-l border-gray-700 border-dashed" : ""}
        ${isActive && false ? "bg-green-50" : ""}
        ${(() => {
          if (items.length === 1) {
            if (type === "bass") return "text-xl";
            if (isMulti) return "text-base";
            return "text-2xl";
          }
          if (items.length === 2) {
            if (isMulti) return "text-base";
            return "text-lg";
          }
          if (items.length === 3) {
            if (isMulti) return "text-[9px]";
            return "text-xs";
          }
          if (items.length === 4) {
            return "text-[9px]";
          }
          return "text-[7px]";
        })()}
        ${hovered ? "bg-hel-bgHover text-hel-textHover" : ""}
        ${isActive ? "bg-hel-bgActive text-hel-textActive" : ""}
        ${direction === "push" && !isActive ? "bg-hel-bgEmphasis" : ""}
        `}
      onClick={onClick ? () => onClick() : undefined}
      onMouseOver={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {sortNoteItems(
        items.filter((item) => (item.type === "note" ? !!item.button : true))
      ).map((item, index) => (
        <React.Fragment key={index}>
          {item.type === "note" && <div>{item.button}</div>}
          {item.type === "bass" && <div>{item.note.note}</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SubCell;
