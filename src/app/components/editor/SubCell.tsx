"use client";
import React from "react";
import { CellItem, SubCell as SubCellType } from "./../../types";

interface CellItemProps<Item extends CellItem> {
  subCell: SubCellType<Item>;
  isFirst: boolean;
  isActive: boolean;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
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
}: // onChange,
// row,
CellItemProps<Item>) => {
  const items = subCell.items;
  return (
    <div
      className={`flex flex-1 items-center flex-col justify-around ${
        !isFirst ? "border-l border-gray-700 border-dotted" : ""
      }
        ${isActive && false ? "bg-green-50" : ""}
        ${items.length > 2 ? "text-xs leading-none" : ""}
        ${hovered && false ? "bg-purple-100" : ""}
        ${hovered ? "bg-[#e3d9bc]" : ""}
        ${isActive ? "bg-[#dbc991]" : ""}
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
