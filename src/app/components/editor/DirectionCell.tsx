import { DIRECTION_CELL_SIZE } from "../../../utils/variables";
import { Direction } from "../../types";

interface DirectionCellProps {
  direction: Direction;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
  active: boolean;
}

const DirectionCell = ({
  direction,
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
      {direction === "pull" && "<"}
      {direction === "push" && ">"}
      {direction === "empty" && "-"}
    </div>
  );
};

export default DirectionCell;
