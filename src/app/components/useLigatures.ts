import { useMemo } from "react";
import {
  Bar,
  CellLigature,
  CellLigaturePosition,
  CellRow,
  Ligatures,
} from "../types";
import { SubColumnPosition } from "./editor/songContext";

export const useLigatures = ({
  columnsInTuning,
  bars,
}: {
  columnsInTuning: number;
  bars: Bar[];
}) => {
  const ligatures = useMemo(() => {
    const lig: Ligatures = {};
    const setLigatures = ({
      position,
      row,
      length,
      cellLigaturePosition,
    }: {
      position: SubColumnPosition;
      row: CellRow;
      length: number;
      cellLigaturePosition: CellLigaturePosition;
    }) => {
      for (let i = 0; i < length; i++) {
        const columnIndex = (position.columnIndex + i) % columnsInTuning;

        const barIndex =
          position.barIndex +
          Math.floor((position.columnIndex + i) / columnsInTuning);

        if (!lig[barIndex]) {
          lig[barIndex] = {};
        }
        if (!lig[barIndex][columnIndex]) {
          lig[barIndex][columnIndex] = {};
        }
        if (!lig[barIndex][columnIndex][row as number | "bass"]) {
          lig[barIndex][columnIndex][row as number | "bass"] = {
            ligatures: [],
          };
        }

        const lengthOffset = position.subColumnIndex > 0 ? 0.5 : 0;

        const rangeValue = i - lengthOffset;

        const ligature: CellLigature = {
          type: "middle",
          fullLigatureLength: length,
          position: cellLigaturePosition,
          range: {
            // TODO: will need to update this once allow subcells ligatures
            from: Math.max(0, rangeValue),
            to: rangeValue + 1,
          },
        };

        // const numberOfMiddleParts = length - 2;

        if (i === 0) {
          ligature.type = "start";
          // ligature.range.from = 0;
        } else if (i >= length - 1) {
          ligature.type = "end";
          ligature.range.to = length;
        } else {
          ligature.type = "middle";
        }

        lig[barIndex][columnIndex][row as number | "bass"]?.ligatures.push(
          ligature
        );
      }
    };
    bars.forEach((bar, barIndex) => {
      bar.columns.forEach((column, columnIndex) => {
        column.melodic.forEach((cell) => {
          cell.subCells.forEach((subCell, subCellIndex) => {
            subCell.items.forEach((subCellItem, subCellItemIndex) => {
              const isMulti = subCell.items.length > 1;
              if (
                "length" in subCellItem &&
                subCellItem.length
                // &&
                // (isMulti ? subCellItem.length > 0.5 : subCellItem.length > 1)
              ) {
                setLigatures({
                  position: {
                    barIndex,
                    columnIndex,
                    subColumnIndex: subCellIndex,
                  },
                  row: cell.row as number,
                  length: subCellItem.length,
                  cellLigaturePosition: {
                    current: subCellItemIndex + 1,
                    ofNotes: subCell.items.length,
                  },
                });
              }
            });
            // if (subCell.length && subCell.length > 1) {
            //   setLigatures(
            //     { barIndex, columnIndex, subColumnIndex: subCellIndex },
            //     cell.row as number,
            //     subCell.length
            //   );
            // }
          });
        });

        // column.bass.subCells.forEach((subCell, subCellIndex) => {
        //   if (subCell.length && subCell.length > 1) {
        //     setLigatures(
        //       { barIndex, columnIndex, subColumnIndex: subCellIndex },
        //       "bass",
        //       subCell.length
        //     );
        //   }
        // });
      });
    });

    return lig;
  }, [bars, columnsInTuning]);

  return ligatures;
};
