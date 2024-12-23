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
      className={`border border-black h-5
         ${hovered ? "bg-[#e3d9bc]" : ""}
        ${active ? "bg-[#dbc991]" : ""}
        `}
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
