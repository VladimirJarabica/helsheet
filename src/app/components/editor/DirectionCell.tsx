import { DIRECTION_CELL_SIZE } from "../../../utils/consts";
import { Direction } from "../../types";

interface DirectionCellProps {
  direction: Direction;
  isFirst: boolean;
  previousDirection?: Direction;
  followingDirection?: Direction;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
  active: boolean;
  onClick: () => void;
}

const DirectionCell = ({
  direction,
  isFirst,
  previousDirection,
  followingDirection,
  onHoverChange,
  hovered,
  active,
  onClick,
}: DirectionCellProps) => {
  return (
    <div
      className={`border-t border-black flex-1 cursor-pointer
        ${
          !isFirst
            ? "border-l border-l-gray-700 [border-left-style:dashed]"
            : ""
        }
        ${hovered ? "bg-hel-bgHover text-hel-textHover" : ""}
        ${active ? "bg-hel-bgActive text-hel-textActive" : ""}
        ${direction === "push" ? "bg-hel-bgEmphasis" : ""}
        `}
      style={{ height: DIRECTION_CELL_SIZE }}
      onMouseOver={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={() => onClick()}
    >
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
          {direction === "pull" && previousDirection !== direction && (
            <span className="-mr-1">◄</span>
          )}
          <div className={`h-[2px] flex-1 bg-black`} />
          {direction === "push" && followingDirection !== direction && (
            <span className="-ml-1">►</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectionCell;
