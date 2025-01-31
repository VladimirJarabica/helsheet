"use client";
import { CELL_SIZE } from "../../../utils/consts";
import { CellItem, Cell as CellType, DirectionSubCell } from "./../../types";
import { useSheetContext } from "./sheetContext";
import SubCell from "./SubCell";

const LIGATURE_POSITIONS_BASE: {
  [ofNotes: number]: { [current: number]: number };
} = {
  1: {
    1: 80, // If cell has one note, the ligature at note 1 is at x% of the cell height
  },
  2: {
    1: 45, // If cell has two notes, the ligature at note 1 is at x% of the cell height
    2: 90, // If cell has two notes, the ligature at note 2 is at x% of the cell height
  },
  3: { 1: 30, 2: 65, 3: 95 },
  4: { 1: 25, 2: 48, 3: 71, 4: 94 },
  // TODO: 4 and 5 notes
};

interface ColumnCellProps<Item extends CellItem> {
  type: Item["type"];
  lastColumnInBar: boolean;
  cell: CellType<Item>;
  barIndex: number;
  columnIndex: number;
  setHoveredSubColumnIndex: (index: number | null) => void;
  hoveredSubColumnIndex: number | null;
  directions: DirectionSubCell[];
}

const Cell = <Item extends CellItem>({
  type,
  lastColumnInBar,
  cell,
  barIndex,
  columnIndex,
  setHoveredSubColumnIndex,
  hoveredSubColumnIndex,
  directions,
}: ColumnCellProps<Item>) => {
  const { setActiveColumn, activeColumn, ligatures, isEditing } =
    useSheetContext();

  const cellLigatures =
    ligatures[barIndex]?.[columnIndex]?.[cell.row as number | "bass"];

  return (
    <div
      className={`flex border-b border-black relative 
        ${lastColumnInBar ? "" : "border-r-0"}
        ${isEditing ? "cursor-pointer" : ""}
      `}
      style={{ height: CELL_SIZE }}
    >
      {cellLigatures?.ligatures && (
        <svg
          className="absolute pointer-events-none z-[1]"
          width={CELL_SIZE}
          height={CELL_SIZE * 1.5}
          xmlns="http://www.w3.org/2000/svg"
        >
          {cellLigatures.ligatures.map((ligature, i) => {
            const position =
              LIGATURE_POSITIONS_BASE[ligature.position.ofNotes]?.[
                ligature.position.current
              ];

            const isStart = ligature.type === "start";

            const svgFullLigatureWidth =
              CELL_SIZE * ligature.renderLigatureLength;
            const svgLigatureOffset = isStart
              ? -(CELL_SIZE * ligature.startOffset)
              : CELL_SIZE * ligature.renderRange.from;

            const ligatureArchDepth = ligature.fullLigatureLength > 3 ? 70 : 40;

            return (
              <path
                key={i}
                d={`M ${-svgLigatureOffset},${
                  (CELL_SIZE * position) / 100
                } A ${svgFullLigatureWidth},${ligatureArchDepth} 0 0 0 ${
                  svgFullLigatureWidth - svgLigatureOffset
                },${(CELL_SIZE * position) / 100}`}
                fill="none"
                stroke="black"
                strokeWidth={0.75}
              />
            );
          })}
        </svg>
      )}
      {cell.subCells.map((subCell, i) => {
        const isSubCellActive =
          activeColumn &&
          activeColumn.barIndex === barIndex &&
          activeColumn.columnIndex === columnIndex &&
          activeColumn.subColumnIndex === i;

        return (
          <SubCell
            key={i}
            type={type}
            isMulti={cell.subCells.length > 1}
            subCell={subCell}
            direction={directions[i]?.direction ?? directions[0]?.direction}
            isFirst={i === 0}
            isActive={!!isSubCellActive}
            onClick={
              isEditing
                ? () => {
                    setActiveColumn({
                      barIndex,
                      columnIndex: columnIndex,
                      subColumnIndex: i,
                    });
                  }
                : undefined
            }
            hovered={hoveredSubColumnIndex === i}
            onHoverChange={(hovered: boolean) =>
              isEditing && setHoveredSubColumnIndex(hovered ? i : null)
            }
          />
        );
      })}
    </div>
  );
};

export default Cell;
