import {
  CELL_SIZE,
  DIRECTION_CELL_SIZE,
  LINE_HEADING_WIDTH,
} from "../../../utils/consts";
import { useTuningContext } from "./tuningContext";

const TO_ROMAN_NUMBER = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
};

const LineHeading = () => {
  const { tuning } = useTuningContext();

  return (
    <div className="border-2 border-black w-fit h-fit">
      {tuning.melodic.toReversed().map(({ row }) => (
        <div
          key={row}
          className="border-b border-black text-2xl flex justify-center items-center"
          style={{ width: LINE_HEADING_WIDTH, height: CELL_SIZE }}
        >
          {TO_ROMAN_NUMBER[row as keyof typeof TO_ROMAN_NUMBER]}.
        </div>
      ))}
      <div
        className="border-b border-black text-2xl flex justify-center items-center"
        style={{ width: LINE_HEADING_WIDTH, height: CELL_SIZE }}
      >
        B
      </div>
      <div
        style={{
          width: LINE_HEADING_WIDTH,
          height: DIRECTION_CELL_SIZE,
        }}
        className="text-xs flex justify-center items-center border-t border-black"
      >
        M
      </div>
    </div>
  );
};

export default LineHeading;
