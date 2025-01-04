import { useEffect, useMemo, useState } from "react";
import { notEmpty } from "../../../utils/fnUtils";
import {
  isBassPartSplit as getIsBassPartSplit,
  isMelodicPartSplit as getIsMelodicPartSplit,
  getNoteFromTuningByButton,
} from "../../../utils/sheet";
import {
  Bass,
  DefinedDirection,
  Direction,
  Note,
  TuningNoteButton,
} from "../../types";
import MelodeonButton, { MelodeonButtonWrapper } from "../MelodeonButton";
import MusicSheetSelector from "./MusicSheetSelector";
import { useSongContext } from "./songContext";
import { useTuningContext } from "./tuningContext";
import Button from "../Button";

const MelodicSettings = () => {
  const { tuning } = useTuningContext();
  const {
    activeColumn,
    song,
    setBassButton,
    setDirection,
    splitMelodicPart,
    splitBassPart,
    joinMelodicPart,
    joinBassPart,
    setMelodicButtons,
    setLength,
    clearColumn,
    setMelodicButton,
  } = useSongContext();
  const [tab, setTab] = useState<"notes" | "length" | "fingers">("notes");

  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

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

  useEffect(() => {
    setSelectedNotes(
      hasMelodicPart
        ? column?.melodic.flatMap((cell) =>
            cell.subCells[activeColumn.subColumnIndex].items
              .filter((item) => item.type === "note")
              .map((item) =>
                getNoteFromTuningByButton({
                  button: item.button,
                  row: cell.row,
                  direction,
                  tuning,
                })
              )
              .filter(notEmpty)
          ) ?? []
        : []
    );
    setHoveredNote(null);
    setHoveredBass(null);
    setSelectedMelodicButtons(null);
  }, [hasMelodicPart, column, direction, tuning, activeColumn?.subColumnIndex]);

  const handleAddSelectedNote = (note: Note) => {
    setSelectedNotes((sn) =>
      sn.find((n) => n.note === note.note && n.pitch === note.pitch)
        ? sn.filter((n) => n.note !== note.note || n.pitch !== note.pitch)
        : [...sn, note]
    );
  };

  const suggestedButtons = useMemo(() => {
    const pullButtons = tuning.melodic.flatMap((row) => {
      return row.buttons
        .filter(({ pull }) =>
          selectedNotes.find(
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
          selectedNotes.find(
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
      push: getSuggestion(selectedNotes, pushButtons, "push").filter(
        (suggestion) => suggestion.length === selectedNotes.length
      ),
      pull: getSuggestion(selectedNotes, pullButtons, "pull").filter(
        (suggestion) => suggestion.length === selectedNotes.length
      ),
    };
  }, [selectedNotes, tuning.melodic]);

  if (!activeColumn || !column) {
    return null;
  }

  const isMelodicPartSplit = getIsMelodicPartSplit(column);
  const isBasPartSplit = getIsBassPartSplit(column);

  const canSetDirection = hasMelodicPart && hasBassPart;

  const bassItems = hasBassPart
    ? column.bass.subCells[activeColumn.subColumnIndex].items
    : [];

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
              {tab === "length" && (
                <>
                  <div className="flex w-full flex-col">
                    {tuning.melodic.toReversed().map((row) => {
                      const subCells = column.melodic[row.row - 1].subCells;
                      const items = subCells[activeColumn.subColumnIndex].items;

                      return (
                        <div key={row.row}>
                          <div>Rad {row.row}</div>
                          {items.map((item) => {
                            if (item.type === "note") {
                              const length =
                                // If split, allow minimum 0.5 length, 1 otherwise
                                item.length ?? (subCells.length > 1 ? 0.5 : 1);
                              return (
                                <div key={row.row + item.button}>
                                  {item.button}
                                  <select
                                    className="bg-transparent"
                                    value={length}
                                    onChange={(e) => {
                                      setLength(parseFloat(e.target.value), {
                                        row: row.row,
                                        button: item.button,
                                      });
                                    }}
                                  >
                                    {new Array(16).fill(0).map((_, i) => {
                                      const val = (i + 1) / 2;
                                      return (
                                        <option key={val} value={val}>
                                          {val}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })}
                    <div>
                      <div>Basy</div>
                      {
                        // const subCells = column.melodic[row.row - 1].subCells;
                        hasBassPart &&
                          column.bass.subCells[
                            activeColumn.subColumnIndex
                          ].items.map((item) => {
                            if (item.type === "bass") {
                              const length =
                                // If split, allow minimum 0.5 length, 1 otherwise
                                item.length ??
                                (column.bass.subCells.length > 1 ? 0.5 : 1);
                              return (
                                <div key={item.note.note}>
                                  {item.note.note}
                                  <select
                                    className="bg-transparent"
                                    value={length}
                                    onChange={(e) => {
                                      setLength(parseFloat(e.target.value), {
                                        row: "bass",
                                        bass: item.note,
                                      });
                                    }}
                                  >
                                    {new Array(16).fill(0).map((_, i) => {
                                      const val = (i + 1) / 2;
                                      return (
                                        <option key={val} value={val}>
                                          {val}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              );
                            }
                          })
                      }
                    </div>
                  </div>
                </>
              )}
              {tab === "notes" && (
                <>
                  <div className="flex gap-10 w-full mb-4 flex-col sm:flex-row">
                    <div className="flex flex-col items-start">
                      <div className="flex h-8">
                        <div>Vybrané noty:</div>
                        {/* <div>Dĺžka:</div> */}

                        {selectedNotes.map((note) => (
                          <div key={note.note + note.pitch}>
                            <MelodeonButtonWrapper
                              onHover={(hovered) =>
                                setHoveredNote(hovered ? note : null)
                              }
                              onClick={() =>
                                setSelectedNotes((sn) =>
                                  sn.filter(
                                    (s) =>
                                      s.note != note.note ||
                                      s.pitch != note.pitch
                                  )
                                )
                              }
                            >
                              {note.note}
                              <sup className="top-[-0.5em]">{note.pitch}</sup>
                            </MelodeonButtonWrapper>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 mt-4 flex-col sm:flex-row">
                        <Button
                          onClick={() => {
                            setSelectedNotes([]);
                            clearColumn();
                          }}
                        >
                          Vymazať
                        </Button>
                        <Button
                          onClick={() =>
                            isMelodicPartSplit
                              ? joinMelodicPart()
                              : splitMelodicPart()
                          }
                        >
                          {isMelodicPartSplit
                            ? "Zlúčiť melodickú časť"
                            : "Rozdeliť melodickú časť"}
                        </Button>
                        <Button
                          onClick={() =>
                            isBasPartSplit ? joinBassPart() : splitBassPart()
                          }
                        >
                          {isBasPartSplit
                            ? "Zlúčiť basovú časť"
                            : "Rozdeliť basovú časť"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex">
                      Navrhované kombinácie:
                      {selectedNotes.length > 0 &&
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
                              onMouseLeave={() =>
                                setSelectedMelodicButtons(null)
                              }
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
                                      ${
                                        rowButtons.length > 2
                                          ? "text-xs"
                                          : "text-sm"
                                      }
                                      `}
                                  >
                                    {
                                      rowButtons.map((button) => (
                                        <>{button.button} </>
                                      ))
                                      // .join(<>&nbsp;</>)
                                    }
                                  </div>
                                );
                              })}
                              <div className="border-b border-black w-8 h-8 flex justify-center items-center">
                                {isOppositeDirection
                                  ? ""
                                  : bassItems.map((bassItem) =>
                                      "note" in bassItem ? (
                                        <>{bassItem.note.note} </>
                                      ) : null
                                    )}
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
                      <div>
                        Výber nôt zo stupnice:
                        <MusicSheetSelector
                          setHoveredNote={setHoveredNote}
                          onSelectNote={handleAddSelectedNote}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      {hasBassPart && (
                        <div className="flex items-center flex-row">
                          {tuning.bass.map((row) => {
                            const activeBasses = new Set(
                              bassItems.map((item) =>
                                item.type === "bass" ? item.note.note : null
                              )
                            );
                            return (
                              <div key={row.row} className="flex flex-col">
                                {row.buttons.map((button) => (
                                  <MelodeonButton
                                    key={button.button}
                                    onClick={(bassDirection) => {
                                      console.log("set bass button", {
                                        button,
                                        bassDirection,
                                      });
                                      // const note =
                                      //   bassDirection === "pull" ? button.pull : button.push;
                                      setBassButton(
                                        button[bassDirection],
                                        direction === "empty"
                                          ? bassDirection
                                          : direction
                                      );
                                      // handleAddSelectedBass(button[direction], direction);
                                    }}
                                    // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                                    button={button}
                                    buttonNumberHidden
                                    hoveredNote={hoveredBass}
                                    setHoveredNote={setHoveredBass}
                                    direction={
                                      selectedMelodicButtons?.direction ??
                                      direction
                                    }
                                    selected={
                                      // TODO: fix if direction is picked
                                      activeBasses.has(button.pull.note) ||
                                      activeBasses.has(button.push.note)
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
                            selected={
                              !selectedMelodicButtons && direction === "empty"
                            }
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
                              <div
                                key={row.row}
                                className="flex flex-col-reverse"
                              >
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
                                      selectedMelodicButtons?.direction ??
                                      direction
                                    }
                                    selected={
                                      activeButtons.has(button.button) ||
                                      !!selectedMelodicButtons?.buttons.find(
                                        (b) =>
                                          b.button === button.button &&
                                          b.row === row.row
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MelodicSettings;
