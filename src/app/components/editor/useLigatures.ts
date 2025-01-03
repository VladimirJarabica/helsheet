import { useMemo } from "react";
import {
  Bar,
  Cell,
  CellItem,
  CellLigature,
  Ligatures,
  SubCell,
} from "../../types";

export const useLigatures = ({
  columnsInTuning,
  bars,
}: {
  columnsInTuning: number;
  bars: Bar[];
}) => {
  const ligatures = useMemo(() => {
    const lig: Ligatures = {};
    const setLigatures = <Item extends CellItem>({
      barIndex,
      columnIndex,
      subCellIndex,
      subCellItemIndex,
      cell,
      subCell,
      subCellItem,
    }: {
      barIndex: number;
      columnIndex: number;
      subCellIndex: number;
      subCellItemIndex: number;
      cell: Cell<Item>;
      subCell: SubCell<Item>;
      subCellItem: Item;
    }) => {
      if (!("length" in subCellItem) || !subCellItem.length) {
        return;
      }

      const row = cell.row;
      const isMulti = cell.subCells.length > 1;
      const isFirstSubCell = subCellIndex === 0;
      const position = {
        barIndex,
        columnIndex,
        subColumnIndex: subCellIndex,
      };
      const cellLigaturePosition = {
        current: subCellItemIndex + 1,
        ofNotes: subCell.items.length,
      };

      const length = subCellItem.length;

      const startOffset = isMulti ? (isFirstSubCell ? 0.25 : 0.75) : 0.5;

      // Get length of the last column in the ligature. Either 1 or 0.5
      const endColumnLength =
        (subCellItem.length -
          // If starting subcell is is second subcolumn, it takes only 0.5 of the length
          (!isFirstSubCell ? -0.5 : 0)) %
          1 || 1;

      const endOffset =
        subCellItem.length === 1 ? 0.25 : endColumnLength === 0.5 ? 0.75 : 0.5; // TODO ifEndColumnIsMulti ? 0.25 : 0.5;

      const numberOfCells = Math.ceil((subCellIndex > 0 ? 0.5 : 0) + length);
      const renderLigatureLength =
        Math.ceil(numberOfCells) - startOffset - endOffset;
      let lastRenderLigature = 0;
      for (let i = 0; i < numberOfCells; i++) {
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
          range: { from: Math.max(0, rangeValue), to: rangeValue + 1 },
          renderLigatureLength,
          startOffset,
          renderRange: {
            from: 0,
            to: 0,
          },
        };

        if (i === 0) {
          ligature.type = "start";
          ligature.renderRange.from = 0;
          ligature.renderRange.to = 1 - startOffset;
        } else if (i >= numberOfCells - 1) {
          ligature.type = "end";
          ligature.range.to = length;
          ligature.renderRange.from = lastRenderLigature;
          ligature.renderRange.to = lastRenderLigature + 1 - endOffset;
        } else {
          ligature.type = "middle";
          ligature.renderRange.from = lastRenderLigature;
          ligature.renderRange.to = lastRenderLigature + 1;
        }

        lastRenderLigature = ligature.renderRange.to;

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
              setLigatures({
                barIndex,
                columnIndex,
                subCellIndex,
                subCellItemIndex,
                cell,
                subCell,
                subCellItem,
              });
            });
          });
        });

        column.bass.subCells.forEach((subCell, subCellIndex) => {
          subCell.items.forEach((subCellItem, subCellItemIndex) => {
            setLigatures({
              barIndex,
              columnIndex,
              subCellIndex,
              subCellItemIndex,
              cell: column.bass,
              subCell,
              subCellItem,
            });
          });
        });
      });
    });

    return lig;
  }, [bars, columnsInTuning]);

  console.log("ligatures", ligatures);

  return ligatures;
};
