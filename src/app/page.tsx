"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { drunkenSailor } from "../data/songs/drunken-sailor";
import { SongContextProvider, useSong, useSongContext } from "./songContext";
import {
  Bar as BarType,
  Column as ColumnType,
  CellRow,
  Cell as CellType,
  CellNote,
  SubCell as SubCellType,
  CellItem,
} from "./types";
import MelodicSettings from "./components/MelodicSettings";
import { TuningContextProvider } from "./tuningContext";
import { empty } from "../data/songs/empty";

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
  const { song, setActiveCell, activeColumn, addBar } = useSongContext();

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

export default function Home() {
  return (
    <TuningContextProvider>
      <SongContextProvider initialSong={empty}>
        <SongWrapper />
      </SongContextProvider>
    </TuningContextProvider>
  );
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
