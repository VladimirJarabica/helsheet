import { DIRECTION_CELL_SIZE } from "../../../utils/consts";
import { Direction } from "../../types";

interface DirectionCellProps {
  direction: Direction;
  isFirst: boolean;
  previousDirection?: Direction | null;
  followingDirection?: Direction | null;
  onHoverChange?: (hovered: boolean) => void;
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
      className={`border-t border-black flex-1
        ${
          !isFirst
            ? "border-l border-l-gray-700 [border-left-style:dashed]"
            : ""
        }
          ${(() => {
            if (active) {
              return "bg-hel-bgActive text-hel-textActive";
            }
            if (hovered) {
              return "bg-hel-bgHover text-hel-textHover";
            }
            if (direction === "push") {
              return "bg-hel-bgEmphasis";
            }
            return "";
          })()}
        ${onHoverChange ? "cursor-pointer" : ""}
        `}
      style={{ height: DIRECTION_CELL_SIZE }}
      onMouseOver={onHoverChange ? () => onHoverChange(true) : undefined}
      onMouseLeave={onHoverChange ? () => onHoverChange(false) : undefined}
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
          style={{ lineHeight: DIRECTION_CELL_SIZE + "px", fontSize: "10px" }}
        >
          {direction === "pull" && previousDirection !== direction && (
            <span className="-mr-1">◄</span>
          )}
          <div className={`h-[1px] flex-1 bg-black`} />
          {direction === "push" && followingDirection !== direction && (
            <span className="-ml-1">►</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectionCell;
