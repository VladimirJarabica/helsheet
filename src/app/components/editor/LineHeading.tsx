import { CELL_SIZE, DIRECTION_CELL_SIZE } from "../../../utils/consts";
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
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
        >
          {TO_ROMAN_NUMBER[row as keyof typeof TO_ROMAN_NUMBER]}.
        </div>
      ))}
      <div
        className="border-b border-black text-2xl flex justify-center items-center"
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
      >
        B
      </div>
      <div
        style={{
          width: CELL_SIZE,
          height: DIRECTION_CELL_SIZE,
        }}
        className="text-md flex justify-center items-center border-t border-black"
      >
        smer
      </div>
    </div>
  );
};

export default LineHeading;
