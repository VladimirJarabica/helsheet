"use client";
import React from "react";
import { CellItem, Direction, SubCell as SubCellType } from "./../../types";

interface CellItemProps<Item extends CellItem> {
  subCell: SubCellType<Item>;
  isFirst: boolean;
  isActive: boolean;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
  direction: Direction;
  // onChange: (newSubCell: SubCellType) => void;
  // row: CellRow;
}

const SubCell = <Item extends CellItem>({
  subCell,
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
      className={`flex flex-1 items-center flex-col justify-around leading-none
        ${!isFirst ? "border-l border-gray-700 border-dashed" : ""}
        ${isActive && false ? "bg-green-50" : ""}
        ${items.length === 1 ? "text-2xl" : ""}
        ${items.length === 2 ? "text-lg" : ""}
        ${items.length === 3 ? "text-xs" : ""}
        ${items.length === 4 ? "text-[9px]" : ""}
        ${items.length > 4 ? "text-[7px]" : ""}
        ${hovered && false ? "bg-purple-100" : ""}
        ${hovered ? "bg-hel-bgHover text-hel-textHover" : ""}
        ${isActive ? "bg-hel-bgActive text-hel-textActive" : ""}
        ${direction === "push" ? "bg-hel-bgEmphasis" : ""}
        `}
      onClick={() => onClick()}
      onMouseOver={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {items
        .filter((item) => (item.type === "note" ? !!item.button : true))
        .map((item, index) => (
          <React.Fragment key={index}>
            {item.type === "note" && <div>{item.button}</div>}
            {item.type === "bass" && <div>{item.note.note}</div>}
          </React.Fragment>
        ))}
    </div>
  );
};

export default SubCell;
