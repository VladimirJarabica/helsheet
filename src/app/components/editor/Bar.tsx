"use client";
import { Bar as BarType } from "./../../types";
import Column from "./Column";

interface BarProps {
  bar: BarType;
  lastBar: BarType;
  barIndex: number;
}
const Bar = ({ bar, lastBar, barIndex }: BarProps) => {
  return (
    <div className="flex">
      {bar.columns.map((column, i) => (
        <Column
          key={i}
          columnIndex={i}
          barIndex={barIndex}
          last={i === bar.columns.length - 1}
          column={column}
          previousColumn={
            i === 0
              ? lastBar?.columns[bar.columns.length - 1]
              : bar.columns[i - 1]
          }
        />
      ))}
    </div>
  );
};

export default Bar;
