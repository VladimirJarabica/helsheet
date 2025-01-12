import { CELL_SIZE, DIRECTION_CELL_SIZE } from "../../../utils/consts";
import { Bar } from "../../types";
import { useSheetContext } from "./sheetContext";

interface RepeatSignProps {
  type: keyof Exclude<Bar["repeat"], undefined>;
  topOffset: number;
}

const RADIUS_SIZE = 10;

const RepeatSign = ({ type, topOffset }: RepeatSignProps) => {
  const { tuning } = useSheetContext();
  const height =
    (tuning.melodic.length + 1) * CELL_SIZE +
    DIRECTION_CELL_SIZE +
    RADIUS_SIZE * 2;
  return (
    <div
      // Right 3 px because 1 + 2px border
      className={`absolute w-[10px] overflow-hidden pointer-events-none
      ${type === "start" ? "left-[1px]" : "right-[3px]"}
    `}
      style={{ height, top: -10 + topOffset }}
    >
      <div
        className={`absolute ${
          type === "start" ? "left-0 border-l-2" : "right-0 border-r-2"
        } border-black z-10 rounded-[10px] border-t-2 border-b-2 w-10`}
        style={{ height }}
      >
        <div
          className={`flex flex-col justify-center gap-3 absolute  ${
            type === "start" ? "left-[2px]" : "right-[2px]"
          }`}
          style={{
            height: (tuning.melodic.length + 1) * CELL_SIZE,
            marginTop: RADIUS_SIZE,
          }}
        >
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RepeatSign;
