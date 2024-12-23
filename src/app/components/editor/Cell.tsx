"use client";
import { CellItem, Cell as CellType } from "./../../types";
import { useSongContext } from "./songContext";
import SubCell from "./SubCell";

interface ColumnCellProps<Item extends CellItem> {
  lastColumn: boolean;
  cell: CellType<Item>;
  barIndex: number;
  columnIndex: number;
  setHoveredSubColumnIndex: (index: number | null) => void;
  hoveredSubColumnIndex: number | null;
}

const Cell = <Item extends CellItem>({
  lastColumn,
  cell,
  barIndex,
  columnIndex,
  setHoveredSubColumnIndex,
  hoveredSubColumnIndex,
}: ColumnCellProps<Item>) => {
  const { setActiveColumn, activeColumn, ligatures } = useSongContext();

  const cellLigatures =
    ligatures[barIndex]?.[columnIndex]?.[cell.row as number | "bass"];
  if (cellLigatures) {
    console.log("cellLigatures", cellLigatures, cell, barIndex, columnIndex);
  }

  const hasMultipleSubcells = cell.subCells.length > 1;

  return (
    <div
      className={`flex border border-black h-11 border-b-0 cursor-pointer relative ${
        lastColumn ? "" : "border-r-0"
      }`}
    >
      {cellLigatures?.ligatures &&
        cellLigatures.ligatures.map((ligature, i) => {
          const length = ligature.range.to - ligature.range.from;
          return (
            <div
              key={i}
              className={`
              absolute
              w-full
              h-[1px]
              bg-black
              top-3/4
  
              ${ligature.type === "start" ? "w-1/2 left-1/2" : ""}
              ${
                ligature.type === "start" && length === 0.5
                  ? "w-1/4 left-3/4"
                  : ""
              }
              ${ligature.type === "end" ? "w-1/2" : ""}
              ${ligature.type === "end" && length === 0.5 ? "w-1/4" : ""}
              ${
                hasMultipleSubcells && ligature.type === "end" && length === 1
                  ? "w-3/4"
                  : ""
              }
              `}
            />
          );
        })}
      {cell.subCells.map((subCell, i) => {
        const isSubCellActive =
          activeColumn &&
          activeColumn.barIndex === barIndex &&
          activeColumn.columnIndex === columnIndex &&
          activeColumn.subColumnIndex === i;

        return (
          <SubCell
            key={i}
            subCell={subCell}
            isFirst={i === 0}
            isActive={!!isSubCellActive}
            onClick={() => {
              console.log("on click");
              // setActiveCell(cellPosition);
              // setActiveSubCell(i);
              setActiveColumn({
                barIndex,
                columnIndex: columnIndex,
                subColumnIndex: i,
              });
            }}
            hovered={hoveredSubColumnIndex === i}
            onHoverChange={(hovered: boolean) =>
              setHoveredSubColumnIndex(hovered ? i : null)
            }
            // onChange={(newSubCell: SubCellType<CellNote>) => {
            //   setMelodicSubCells(
            //     cell.subCells.map((sc, ii) => (ii === i ? newSubCell : sc)),
            //     {
            //       barIndex,
            //       beatIndex,
            //       row: cell.row,
            //     }
            //   );
            // }}
          />
        );
      })}
      {/* <AnimatePresence>
          {isCellActive && (
            <motion.div
              key="menu"
              exit={{ opacity: 0 }}
              className="min-w-10 min-h-4 border-gray-400 border ml-1 -mt-1 bg-white rounded-sm py-2 absolute z-10 left-12 mr-1 drop-shadow-md text-sm"
            >
              <button
                className="text-nowrap px-2 py-1 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  console.log("rozdeliť bunku");
                  splitCell(cellPosition, false);
                  setActiveSubCell(null);
                }}
              >
                Rozdeliť bunku
              </button>
              <button
                className="text-nowrap px-2 py-1 hover:bg-gray-100 w-full text-left"
                onClick={() => splitCell(cellPosition, true)}
              >
                Rozdeliť dobu
              </button>
            </motion.div>
          )}
        </AnimatePresence> */}
    </div>
  );
};

export default Cell;
