"use client";
import { useState } from "react";
import ColumnNotes from "./ColumnNotes";
import { useKeyboardListener } from "./keyboardListenerContext";
import NoteLengthSelect from "./NoteLengthSelect";
import { useSheetContext } from "./sheetContext";

const ColumnSettings = () => {
  const { activeColumn, song, setActiveColumn } = useSheetContext();
  const [tab, setTab] = useState<"notes" | "length" | "fingers">("notes");

  useKeyboardListener({
    id: "settingsTab",
    key: " ",
    listener: () => {
      const tabs = ["notes", "length", "fingers"] as const;
      setTab((activeTab) => tabs[(tabs.indexOf(activeTab) + 1) % tabs.length]);
    },
    preventDefault: true,
  });

  useKeyboardListener({
    id: "closeSettings",
    key: "Escape",
    listener: () => {
      setActiveColumn(null);
    },
  });

  useKeyboardListener({
    id: "moveColumn",
    key: "Tab",
    listener: ({ shiftKey }) => {
      if (activeColumn) {
        // Going back
        if (shiftKey) {
          if (activeColumn.subColumnIndex > 0) {
            setActiveColumn({
              barIndex: activeColumn.barIndex,
              columnIndex: activeColumn.columnIndex,
              subColumnIndex: activeColumn.subColumnIndex - 1,
            });
          } else if (activeColumn.columnIndex > 0) {
            const currentBar = song.bars[activeColumn.barIndex];
            setActiveColumn({
              barIndex: activeColumn.barIndex,
              columnIndex: activeColumn.columnIndex - 1,
              subColumnIndex:
                currentBar.columns[activeColumn.columnIndex - 1].melodic[0]
                  .subCells.length - 1,
            });
          } else {
            const previousBarIndex =
              activeColumn.barIndex > 0
                ? activeColumn.barIndex - 1
                : song.bars.length - 1;
            const previousBar = song.bars[previousBarIndex];
            setActiveColumn({
              barIndex: previousBarIndex,
              columnIndex: previousBar.columns.length - 1,
              subColumnIndex:
                previousBar.columns[previousBar.columns.length - 1].melodic[0]
                  .subCells.length - 1,
            });
          }
          return;
        }
        if (
          activeColumn.subColumnIndex <
          song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex]
            .melodic[0].subCells.length -
            1
        ) {
          setActiveColumn({
            barIndex: activeColumn.barIndex,
            columnIndex: activeColumn.columnIndex,
            subColumnIndex: activeColumn.subColumnIndex + 1,
          });
        } else if (
          activeColumn.columnIndex <
          song.bars[activeColumn.barIndex].columns.length - 1
        ) {
          setActiveColumn({
            barIndex: activeColumn.barIndex,
            columnIndex: activeColumn.columnIndex + 1,
            subColumnIndex: 0,
          });
        } else {
          setActiveColumn({
            barIndex:
              activeColumn.barIndex < song.bars.length - 1
                ? activeColumn.barIndex + 1
                : 0,
            columnIndex: 0,
            subColumnIndex: 0,
          });
        }
      }
    },
    preventDefault: true,
  });

  return (
    <div className="print:hidden min-h-0 h-[50vh] fixed bottom-0 left-0 right-0 z-10 flex justify-center border-t border-black">
      <div className="flex gap-4 fixed bottom-[50vh] translate-y-2 bg-hel-bgDefault border-gray-700 shadow rounded shadow-gray-700 border-b-0 px-3 py-2 z-20">
        <div onClick={() => setTab("notes")}>Noty</div>
        <div onClick={() => setTab("length")}>Dĺžka nôt</div>
        <div onClick={() => setTab("fingers")}>Prstoklad</div>
      </div>
      <div className="min-h-0 h-[50vh] overflow-y-scroll bg-hel-bgDefault">
        <div className="w-screen p-5 flex flex-col items-center shadow shadow-gray-700 h-fit">
          <div className="flex flex-col items-center min-h-0 justify-center">
            <div>
              {tab === "length" && <NoteLengthSelect />}
              {tab === "notes" && <ColumnNotes />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnSettings;
