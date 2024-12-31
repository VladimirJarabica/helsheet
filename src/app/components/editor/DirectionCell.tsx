import { DIRECTION_CELL_SIZE } from "../../../utils/variables";
import { Direction } from "../../types";

interface DirectionCellProps {
  direction: Direction;
  previousDirection?: Direction;
  followingDirection?: Direction;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
  active: boolean;
}

const DirectionCell = ({
  direction,
  previousDirection,
  followingDirection,
  onHoverChange,
  hovered,
  active,
}: DirectionCellProps) => {
  return (
    <div
      className={`border border-black
         ${hovered ? "bg-[#e3d9bc]" : ""}
        ${active ? "bg-[#dbc991]" : ""}
        ${direction === "push" ? "bg-[#dfd5b7]" : ""}
        `}
      style={{ height: DIRECTION_CELL_SIZE }}
      onMouseOver={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* {direction === "pull" && previousDirection !== direction && ( */}
      {direction !== "empty" && (
        <div
          className={`flex items-center h-full
            ${
              direction === "pull" && followingDirection !== direction
                ? "pr-1"
                : ""
            }
            ${
              direction === "push" && previousDirection !== direction
                ? "pl-1"
                : ""
            }
            `}
          style={{ lineHeight: DIRECTION_CELL_SIZE + "px", fontSize: "14px" }}
        >
          {/* ◄<div className="w-full" /> */}
          {direction === "pull" && previousDirection !== direction && (
            <span className="-mr-1">◄</span>
          )}
          <div className="h-[1px] flex-1 bg-black" />
          {direction === "push" && followingDirection !== direction && (
            <span className="-ml-1">►</span>
          )}
        </div>
      )}
      {/* {direction === "push" && followingDirection !== direction && "►"} */}
      {/* {direction === "empty" && "-"} */}
    </div>
  );
};

export default DirectionCell;
