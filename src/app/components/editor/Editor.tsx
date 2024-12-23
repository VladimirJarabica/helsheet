"use client";
import React, { ChangeEvent, useRef } from "react";
import MelodicSettings from "../MelodicSettings";
import {
  Bar as BarType,
  CellItem,
  Cell as CellType,
  Column as ColumnType,
  SubCell as SubCellType,
} from "./../../types";
import { Song } from "../../types";
import { TuningContextProvider } from "../../tuningContext";
import { SongContextProvider, useSongContext } from "../../songContext";
import { Tuning } from "@prisma/client";

interface CellItemProps<Item extends CellItem> {
  subCell: SubCellType<Item>;
  isFirst: boolean;
  isActive: boolean;
  onClick: () => void;
  // onChange: (newSubCell: SubCellType) => void;
  // row: CellRow;
}

const SubCell = <Item extends CellItem>({
  subCell,
  isFirst,
  isActive,
  onClick,
}: // onChange,
// row,
CellItemProps<Item>) => {
  const items = subCell.items;
  return (
    <div
      className={`flex flex-1 items-center flex-col justify-around ${
        !isFirst ? "border-l border-gray-700 border-dotted" : ""
      }
      ${isActive ? "bg-green-50" : ""}
      ${items.length > 2 ? "text-xs leading-none" : ""}
      `}
      onClick={() => onClick()}
    >
      {items
        .filter((item) => (item.type === "note" ? !!item.button : true))
        .map((item, index) => (
          <React.Fragment key={index}>
            {item.type === "note" && <div>{item.button}</div>}
            {item.type === "bass" && <div>{item.note.note}</div>}
            {item.type === "empty" && <div>-</div>}
          </React.Fragment>
        ))}
    </div>
  );
};
interface ColumnCellProps<Item extends CellItem> {
  lastColumn: boolean;
  cell: CellType<Item>;
  barIndex: number;
  columnIndex: number;
}

const Cell = <Item extends CellItem>({
  lastColumn,
  cell,
  barIndex,
  columnIndex,
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
      className={`flex border border-black  h-12 border-b-0 hover:bg-yellow-50 cursor-pointer relative ${
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

interface ColumnProps {
  last: boolean;
  column: ColumnType;
  previousColumn?: ColumnType;
  barIndex: number;
  columnIndex: number;
}

const Column = ({ column, last, barIndex, columnIndex }: ColumnProps) => {
  const { setText } = useSongContext();
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = e.target.scrollHeight + "px";
    }
    setText(e.target.value, { barIndex, columnIndex });
  };

  return (
    <div className="w-12">
      {column.melodic
        .toSorted((cellA, cellB) =>
          typeof cellA.row === "number" && typeof cellB.row === "number"
            ? cellB.row - cellA.row
            : 0
        )
        .map((cell, i) => (
          <Cell
            key={i}
            lastColumn={last}
            cell={cell}
            barIndex={barIndex}
            columnIndex={columnIndex}
          />
        ))}
      <Cell
        lastColumn={last}
        cell={column.bass}
        barIndex={barIndex}
        columnIndex={columnIndex}
      />
      <div className="border border-black h-5">
        {column.direction === "pull" && "<"}
        {column.direction === "push" && ">"}
        {column.direction === "empty" && "-"}
      </div>
      <textarea
        ref={ref}
        className="border-gray-500 border-b w-full text-sm outline-none mx-[1px] resize-none h-10 print:border-none"
        value={column.text ?? ""}
        onChange={handleInput}
      />
    </div>
  );
};

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

const SongWrapper = () => {
  const { song, activeColumn, addBar } = useSongContext();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClick = (event: MouseEvent) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as HTMLElement)
  //     ) {
  //       setActiveCell(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //   };
  // });

  return (
    <>
      <div className="w-full flex justify-center pt-10" ref={wrapperRef}>
        <div className="flex flex-wrap">
          {song.bars.map((bar, i) => (
            <Bar key={i} bar={bar} barIndex={i} lastBar={song.bars[i - 1]} />
          ))}
          <button
            className="border border-black px-1 rounded-md bg-gray-50"
            onClick={() => {
              addBar();
            }}
          >
            Pridať takt
          </button>
        </div>
      </div>
      {activeColumn && <MelodicSettings />}
    </>
  );
};

interface EditorProps {
  song: Song;
  tuning: Tuning;
  readonly: boolean;
}
const Editor = ({ song, tuning, readonly }: EditorProps) => {
  console.log("readonly", readonly);
  return (
    <TuningContextProvider tuning={tuning}>
      <SongContextProvider initialSong={song}>
        <SongWrapper />
      </SongContextProvider>
    </TuningContextProvider>
  );
};

export default Editor;
