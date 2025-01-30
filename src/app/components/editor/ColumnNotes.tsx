"use client";
import * as R from "ramda";
import React, { useMemo, useState } from "react";
import { notEmpty } from "../../../utils/fnUtils";
import {
  isBassPartSplit as getIsBassPartSplit,
  isMelodicPartSplit as getIsMelodicPartSplit,
  getNoteFromTuningByButton,
  sortNoteItems,
} from "../../../utils/sheet";
import {
  Bass,
  CellRow,
  DefinedDirection,
  Direction,
  Note,
  TuningNoteButton,
} from "../../types";
import Button from "../Button";
import MelodeonButton, { MelodeonButtonWrapper } from "../MelodeonButton";
import {
  useKeyboardListener,
  useKeyboardListeners,
} from "./keyboardListenerContext";
import MusicSheetSelector from "./MusicSheetSelector";
import { useSheetContext } from "./sheetContext";

const ColumnNotes = () => {
  const {
    tuning,
    activeColumn,
    song,
    setBassButton,
    setDirection,
    splitMelodicPart,
    splitBassPart,
    joinMelodicPart,
    joinBassPart,
    setMelodicButtons,
    clearColumn,
    setMelodicButton,
  } = useSheetContext();

  const [hoveredNote, setHoveredNote] = useState<Note | null>(null);

  const [selectedMelodicButtons, setSelectedMelodicButtons] = useState<{
    buttons: { row: number; button: number }[];
    direction: DefinedDirection;
  } | null>(null);
  const [hoveredBass, setHoveredBass] = useState<Bass | null>(null);

  const column = activeColumn
    ? song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex]
    : null;
  const direction: Direction =
    activeColumn && column
      ? column.directions[activeColumn.subColumnIndex]?.direction ??
        column.directions[0]?.direction ??
        "empty"
      : "empty";

  const isMelodicPartSplit = !!column && getIsMelodicPartSplit(column);
  const isBasPartSplit = !!column && getIsBassPartSplit(column);

  const hasMelodicPart = !!(
    column &&
    activeColumn &&
    column.melodic.some((cell) => !!cell.subCells[activeColumn.subColumnIndex])
  );

  const hasBassPart = !!(
    column &&
    activeColumn &&
    column.bass.subCells[activeColumn.subColumnIndex]
  );

  const canSetDirection = hasMelodicPart && hasBassPart;

  const bassItems = hasBassPart
    ? column.bass.subCells[activeColumn.subColumnIndex].items
    : [];

  const activeBasses = new Set(
    bassItems.map((item) => (item.type === "bass" ? item.note.note : null))
  );

  const notes = useMemo(
    () =>
      hasMelodicPart
        ? column?.melodic.flatMap((cell) =>
            cell.subCells[activeColumn.subColumnIndex].items
              .filter((item) => item.type === "note")
              .map<(Note & { button: number; row: CellRow }) | null>((item) => {
                const note = getNoteFromTuningByButton({
                  button: item.button,
                  row: cell.row,
                  direction,
                  tuning,
                });
                if (!note) {
                  return null;
                }
                return {
                  ...note,
                  button: item.button,
                  row: cell.row,
                };
              })
              .filter(notEmpty)
          ) ?? []
        : [],
    [column, activeColumn, direction, hasMelodicPart, tuning]
  );

  useKeyboardListener({
    id: "directionLeft",
    key: "ArrowLeft",
    listener: () => {
      if (canSetDirection) {
        setDirection("pull");
      }
    },
  });

  useKeyboardListener({
    id: "directionLeft",
    key: "ArrowRight",
    listener: () => {
      if (canSetDirection) {
        setDirection("push");
      }
    },
  });

  const basses = tuning.bass.flatMap((row) =>
    row.buttons.flatMap((button) => [
      {
        direction: "pull" as DefinedDirection,
        bass: button.pull.note,
        shortcutKey: button.pull.shortcutKey ?? button.pull.note,
      },
      {
        direction: "push" as DefinedDirection,
        bass: button.push.note,
        shortcutKey: button.push.shortcutKey ?? button.push.note,
      },
    ])
  );

  useKeyboardListeners({
    id: "bass",
    keys: R.uniq(basses.map((bass) => bass.shortcutKey)),
    listener: (bass: string) => {
      if (!hasBassPart) {
        return;
      }
      const selectedBasses = basses.filter(
        (item) =>
          item.shortcutKey === bass &&
          (direction !== "empty" ? item.direction === direction : true)
      );

      if (selectedBasses.length > 1) {
        alert("Nemožno priradiť bass, pretože je viacero možností");
      }
      if (selectedBasses.length === 1 && selectedBasses[0]) {
        setBassButton(
          { note: selectedBasses[0].bass },
          selectedBasses[0].direction
        );
      }
    },
  });

  useKeyboardListeners({
    id: "melodic",
    keys: [...new Array(9).fill(0).map((_, i) => `${i + 1}`), "x", "y"],
    listener: (key: string, options) => {
      if (direction === "empty") {
        alert("Najprv zvoľ smer ťahu");
        return;
      }
      const parsed = parseInt(key, 10);
      const buttonNumber = Number.isNaN(parsed)
        ? ["x", "y"].indexOf(key) + 10
        : parsed;

      const row = options.ctrlKey ? 2 : 1;

      if (buttonNumber <= tuning.melodic[row - 1].buttons.length) {
        setMelodicButton(options.ctrlKey ? 2 : 1, buttonNumber, direction);
      }
    },
  });

  const handleAddSelectedNote = (note: Note) => {
    const possibleNoteButton = tuning.melodic.flatMap((row) => {
      return row.buttons
        .flatMap((button) => {
          return [
            (direction === "empty" || direction === "pull") &&
            button.pull.note === note.note &&
            button.pull.pitch === note.pitch
              ? {
                  button: button.button,
                  row: row.row,
                  direction: "pull" as DefinedDirection,
                }
              : null,
            (direction === "empty" || direction === "push") &&
            button.push.note === note.note &&
            button.push.pitch === note.pitch
              ? {
                  button: button.button,
                  row: row.row,
                  direction: "push" as DefinedDirection,
                }
              : null,
          ];
        })
        .filter(notEmpty);
    });

    if (possibleNoteButton.length > 0 && possibleNoteButton[0]) {
      setMelodicButton(
        possibleNoteButton[0].row,
        possibleNoteButton[0].button,
        possibleNoteButton[0].direction
      );
      // alert("Pre zadanú notu neexistuje žiadny tlačidlo");
      return;
    }
    // setSelectedNotes((sn) =>
    //   sn.find((n) => n.note === note.note && n.pitch === note.pitch)
    //     ? sn.filter((n) => n.note !== note.note || n.pitch !== note.pitch)
    //     : [...sn, note]
    // );
  };

  const suggestedButtons = useMemo(() => {
    const pullButtons = tuning.melodic.flatMap((row) => {
      return row.buttons
        .filter(({ pull }) =>
          notes.find(
            (selectedNote) =>
              selectedNote.note === pull.note &&
              selectedNote.pitch === pull.pitch
          )
        )
        .map((button) => ({
          ...button,
          direction: "pull" as const,
          row: row.row,
        }));
    });

    const pushButtons = tuning.melodic.flatMap((row) => {
      return row.buttons
        .filter(({ push }) =>
          notes.find(
            (selectedNote) =>
              selectedNote.note === push.note &&
              selectedNote.pitch === push.pitch
          )
        )
        .map((button) => ({
          ...button,
          direction: "push" as const,
          row: row.row,
        }));
    });

    const getSuggestion = <B extends TuningNoteButton>(
      notes: Note[],
      buttons: B[],
      direction: DefinedDirection
    ): B[][] => {
      if (notes.length === 0) {
        return [];
      }
      const [firstNote, ...restNotes] = notes;
      const noteButtons = buttons.filter(
        (button) =>
          button[direction].note === firstNote.note &&
          button[direction].pitch === firstNote.pitch
      );

      const restSuggestions = getSuggestion(restNotes, buttons, direction);

      if (restSuggestions.length === 0) {
        return noteButtons.map((noteButton) => [noteButton]);
      }

      return noteButtons.flatMap((noteButton) =>
        restSuggestions.map((restSuggestion) => [noteButton, ...restSuggestion])
      );

      // return noteButtons.flatMap((noteButton) => [
      //   noteButton,
      //   ...getSuggestion(restNotes, buttons, direction),
      // ]);
    };

    return {
      push: getSuggestion(notes, pushButtons, "push").filter(
        (suggestion) => suggestion.length === notes.length
      ),
      pull: getSuggestion(notes, pullButtons, "pull").filter(
        (suggestion) => suggestion.length === notes.length
      ),
    };
  }, [notes, tuning.melodic]);

  if (!activeColumn || !column) {
    return null;
  }

  return (
    <>
      <div className="flex gap-10 w-full mb-4 flex-col sm:flex-row">
        <div className="flex flex-col items-start">
          <div className="flex h-9">
            <div>Vybrané noty:</div>

            {notes.map((note) => (
              <div key={note.note + note.pitch}>
                <MelodeonButtonWrapper
                  onHover={(hovered) => setHoveredNote(hovered ? note : null)}
                  onClick={() => {
                    if (typeof note.row === "number" && direction !== "empty") {
                      setMelodicButton(note.row, note.button, direction);
                    }
                  }}
                >
                  {note.note}
                  <sup className="top-[-0.5em]">{note.pitch}</sup>
                </MelodeonButtonWrapper>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-4 flex-col sm:flex-row">
            <Button
              variant="secondary"
              onClick={() => {
                // setSelectedNotes([]);
                clearColumn();
              }}
            >
              Vymazať
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                isMelodicPartSplit ? joinMelodicPart() : splitMelodicPart()
              }
            >
              {isMelodicPartSplit
                ? "Zlúčiť melodickú časť"
                : "Rozdeliť melodickú časť"}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                isBasPartSplit ? joinBassPart() : splitBassPart()
              }
            >
              {isBasPartSplit ? "Zlúčiť basovú časť" : "Rozdeliť basovú časť"}
            </Button>
          </div>
        </div>
        <div className="flex h-[130px] items-start">
          Navrhované kombinácie:
          {notes.length > 0 &&
            suggestedButtons.pull.length === 0 &&
            suggestedButtons.push.length === 0 &&
            " Pre zadané noty neexistujú žiadne kombinácie"}
          {[...suggestedButtons.push, ...suggestedButtons.pull].map(
            (buttons) => {
              const suggestedDirection = buttons[0]?.direction;

              const isOppositeDirection =
                suggestedDirection &&
                direction !== "empty" &&
                suggestedDirection !== direction;
              return (
                <div
                  key={buttons
                    .map(
                      (button) =>
                        button[suggestedDirection].note +
                        button[suggestedDirection].pitch +
                        button.row +
                        button.button +
                        suggestedDirection
                    )
                    .join("")}
                  data-key={buttons
                    .map(
                      (button) =>
                        button[suggestedDirection].note +
                        button[suggestedDirection].pitch +
                        button.row +
                        button.button +
                        suggestedDirection
                    )
                    .join("")}
                  className="flex border border-black cursor-pointer mx-1 flex-col"
                  onMouseEnter={() =>
                    buttons[0] &&
                    setSelectedMelodicButtons({
                      buttons: buttons.map((button) => ({
                        row: button.row,
                        button: button.button,
                      })),
                      direction: buttons[0].direction,
                    })
                  }
                  onMouseLeave={() => setSelectedMelodicButtons(null)}
                  onClick={() => {
                    setMelodicButtons(
                      buttons.map((button) => ({
                        row: button.row,
                        button: button.button,
                      })),
                      suggestedDirection
                    );
                  }}
                >
                  {tuning.melodic.toReversed().map((row) => {
                    const rowButtons = buttons.filter(
                      (button) => button.row === row.row
                    );
                    return (
                      <div
                        key={row.row}
                        className={`border-b border-black w-8 h-8 flex justify-center items-center text-center
                    ${rowButtons.length > 2 ? "text-xs" : "text-sm"}
                    `}
                      >
                        {rowButtons.map((button) => (
                          <>{button.button} </>
                        ))}
                      </div>
                    );
                  })}
                  <div className="border-b border-black w-8 h-8 flex justify-center items-center">
                    {sortNoteItems(
                      bassItems.filter(
                        (bassItem) =>
                          "note" in bassItem &&
                          tuning.bass.some((bassRow) =>
                            bassRow.buttons.some(
                              (bassButton) =>
                                bassButton[suggestedDirection].note ===
                                bassItem.note.note
                            )
                          )
                      )
                    )
                      .map((bassItem) =>
                        "note" in bassItem ? bassItem.note.note : null
                      )
                      .filter(notEmpty)
                      .map((bassNote) => (
                        <React.Fragment key={bassNote}>
                          {bassNote}
                        </React.Fragment>
                      ))}
                  </div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center ${
                      isOppositeDirection ? "bg-red-100" : ""
                    }`}
                  >
                    {suggestedDirection === "pull" ? "<" : ">"}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {hasMelodicPart && (
          <MusicSheetSelector
            setHoveredNote={setHoveredNote}
            hoveredNote={hoveredNote}
            onSelectNote={handleAddSelectedNote}
            selectedNotes={notes}
          />
        )}
        <div className="flex items-center justify-between">
          {hasBassPart && (
            <div className="flex items-center flex-row">
              {tuning.bass.map((row) => {
                return (
                  <div key={row.row} className="flex flex-col">
                    {row.buttons.map((button) => (
                      <MelodeonButton
                        key={button.button}
                        onClick={(bassDirection) => {
                          setBassButton(
                            button[bassDirection],
                            direction === "empty" ? bassDirection : direction
                          );
                        }}
                        button={button}
                        buttonNumberHidden
                        hoveredNote={hoveredBass}
                        setHoveredNote={setHoveredBass}
                        direction={
                          selectedMelodicButtons?.direction ?? direction
                        }
                        selected={
                          (direction !== "push" &&
                            activeBasses.has(button.pull.note)) ||
                          (direction !== "pull" &&
                            activeBasses.has(button.push.note))
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {canSetDirection && (
            <div className="flex flex-col sm:flex-row gap-2 mx-4">
              <MelodeonButtonWrapper
                selected={
                  selectedMelodicButtons
                    ? selectedMelodicButtons.direction === "pull"
                    : direction === "pull"
                }
                onClick={() => setDirection("pull")}
              >
                {"<--"}
              </MelodeonButtonWrapper>
              <MelodeonButtonWrapper
                selected={!selectedMelodicButtons && direction === "empty"}
                onClick={() => setDirection("empty")}
              >
                {"-"}
              </MelodeonButtonWrapper>
              <MelodeonButtonWrapper
                selected={
                  selectedMelodicButtons
                    ? selectedMelodicButtons.direction === "push"
                    : direction === "push"
                }
                onClick={() => setDirection("push")}
              >
                {"-->"}
              </MelodeonButtonWrapper>
            </div>
          )}
          {hasMelodicPart && (
            <div className="flex items-center flex-row-reverse">
              {tuning.melodic.map((row) => {
                const cellItems =
                  column.melodic[row.row - 1].subCells[
                    activeColumn.subColumnIndex
                  ].items;
                const activeButtons = new Set(
                  cellItems.map((item) =>
                    item.type === "note" ? item.button : null
                  )
                );
                return (
                  <div key={row.row} className="flex flex-col-reverse">
                    {row.buttons.map((button) => (
                      <MelodeonButton
                        key={row.row + button.button}
                        onClick={(buttonDirection) => {
                          setMelodicButton(
                            row.row,
                            button.button,
                            buttonDirection
                          );
                        }}
                        button={button}
                        hoveredNote={hoveredNote}
                        setHoveredNote={setHoveredNote}
                        direction={
                          selectedMelodicButtons?.direction ?? direction
                        }
                        selected={
                          activeButtons.has(button.button) ||
                          !!selectedMelodicButtons?.buttons.find(
                            (b) =>
                              b.button === button.button && b.row === row.row
                          )
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ColumnNotes;
