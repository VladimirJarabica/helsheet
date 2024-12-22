import { useEffect, useMemo, useState } from "react";
import * as R from "ramda";
import { useTuningContext } from "../tuningContext";
import MelodeonButton, { MelodeonButtonWrapper } from "./MelodeonButton";
import {
  Bass,
  DefinedDirection,
  Direction,
  Note,
  TuningNoteButton,
} from "../types";
import { useSongContext } from "../songContext";
import MusicSheetSelector from "./MusicSheetSelector";

const MelodicSettings = () => {
  const { tuning } = useTuningContext();
  const {
    activeColumn,
    song,
    setMelodicButton,
    setBassButton,
    setDirection,
    splitMelodicPart,
    splitBassPart,
    joinMelodicPart,
    joinBassPart,
    setMelodicButtons,
    setLength,
  } = useSongContext();
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

  const [hoveredNote, setHoveredNote] = useState<Note | null>({
    note: "c",
    pitch: 2,
  });

  const [selectedMelodicButtons, setSelectedMelodicButtons] = useState<{
    buttons: { row: number; button: number }[];
    direction: DefinedDirection;
  } | null>(null);
  const [hoveredBass, setHoveredBass] = useState<Bass | null>(null);

  useEffect(() => {
    setSelectedNotes([]);
    setHoveredNote(null);
    setHoveredBass(null);
    setSelectedMelodicButtons(null);
  }, [activeColumn]);

  const handleAddSelectedNote = (note: Note, newDirection?: Direction) => {
    setSelectedNotes((sn) =>
      sn.find((n) => n.note === note.note && n.pitch === note.pitch)
        ? sn.filter((n) => n.note !== note.note || n.pitch !== note.pitch)
        : [...sn, note]
    );

    // if (newDirection) {
    //   setSelectedDirection(newDirection);
    // }
  };

  if (!activeColumn) {
    return null;
  }

  const column =
    song.bars[activeColumn.barIndex].columns[activeColumn.columnIndex];
  const direction: Direction = column.direction;

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
    console.log("pullButtons", pullButtons);
    console.log("pushButtons", pushButtons);

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
      console.log("get suggestions", {
        firstNote,
        noteButtons,
        restSuggestions,
      });

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
    // console.log(
    //   "Pull suggestion",
    //   getSuggestion(selectedNotes, pullButtons, "pull")
    // );
    console.log(
      "Push suggestion",
      getSuggestion(selectedNotes, pushButtons, "push")
    );

    return {
      push: getSuggestion(selectedNotes, pushButtons, "push").filter(
        (suggestion) => suggestion.length === selectedNotes.length
      ),
      pull: getSuggestion(selectedNotes, pullButtons, "pull").filter(
        (suggestion) => suggestion.length === selectedNotes.length
      ),
    };
  }, [selectedNotes, tuning.melodic]);

  const hasBassPart = !!column.bass.subCells[activeColumn.subColumnIndex];
  const hasMelodicPart = column.melodic.some(
    (cell) => !!cell.subCells[activeColumn.subColumnIndex]
  );

  const isMelodicPartSplit =
    hasMelodicPart && column.melodic.some((cell) => cell.subCells.length > 1);
  const isBasPartSplit = hasBassPart && column.bass.subCells.length > 1;

  return (
    <div className="absolute p-20">
      <div className="flex gap-4 flex-wrap">
        <div>
          Výber nôt zo stupnice:
          <MusicSheetSelector
            setHoveredNote={setHoveredNote}
            onSelectNote={handleAddSelectedNote}
          />
        </div>
        <div className="flex items-center justify-between">
          {hasBassPart && (
            <div className="flex items-center flex-row">
              {tuning.bass.map((row) => {
                const cellItems =
                  column.bass.subCells[activeColumn.subColumnIndex].items;
                const activeNotes = new Set(
                  cellItems.map((item) =>
                    item.type === "bass" ? item.note.note : null
                  )
                );
                return (
                  <div key={row.row} className="flex flex-col">
                    {row.buttons.map((button) => (
                      <MelodeonButton
                        onClick={(direction) => {
                          console.log("clicked");
                          // const note =
                          //   direction === "pull" ? button.pull : button.push;
                          setBassButton(button[direction], direction);
                          // handleAddSelectedBass(button[direction], direction);
                        }}
                        // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                        button={button}
                        buttonNumberHidden
                        hoveredNote={hoveredBass}
                        setHoveredNote={setHoveredBass}
                        direction={
                          selectedMelodicButtons?.direction ?? direction
                        }
                        selected={
                          activeNotes.has(button.pull.note) ||
                          activeNotes.has(button.push.note)
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-5 mx-8">
            <MelodeonButtonWrapper
              selected={
                selectedMelodicButtons
                  ? selectedMelodicButtons.direction === "pull"
                  : direction === "pull"
              }
              onClick={() => setDirection("pull")}
            >
              {"<----"}
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
              {"--->"}
            </MelodeonButtonWrapper>
          </div>
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
                        onClick={(direction) => {
                          console.log("clicked");
                          // setMelodicButton(row.row, button.button, direction);
                          handleAddSelectedNote(button[direction], direction);
                        }}
                        // disabled={!!hoveredNote && button.pull.note != hoveredNote}
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
      <div className="flex">
        Vybrané noty:
        {selectedNotes.map((note) => (
          <div>
            {note.note}
            <sup className="top-[-0.5em]">{note.pitch}</sup>
          </div>
        ))}
        <button
          className="border border-black px-1 rounded-md bg-gray-50"
          onClick={() => {
            setSelectedNotes([]);
            // setSelectedDirection("empty");
          }}
        >
          Vymazať vybrané noty
        </button>
      </div>
      <button
        className="border border-black px-1 rounded-md bg-gray-50"
        onClick={() =>
          isMelodicPartSplit ? joinMelodicPart() : splitMelodicPart()
        }
      >
        {isMelodicPartSplit
          ? "Zlúčiť melodickú časť"
          : "Rozdeliť melodickú časť"}
      </button>
      <button
        className="border border-black px-1 rounded-md bg-gray-50"
        onClick={() => (isBasPartSplit ? joinBassPart() : splitBassPart())}
      >
        {isBasPartSplit ? "Zlúčiť basovú časť" : "Rozdeliť basovú časť"}
      </button>
      <div className="flex">
        Navrhované kombinácie:
        {selectedNotes.length > 0 &&
          suggestedButtons.pull.length === 0 &&
          suggestedButtons.push.length === 0 &&
          " Pre zadané noty neexistujú žiadne kombinácie"}
        {[...suggestedButtons.push, ...suggestedButtons.pull].map((buttons) => {
          const suggestedDirection = buttons[0]?.direction;
          return (
            <div
              className="flex border border-black p-1 cursor-pointer mx-1"
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
              {suggestedDirection &&
                (buttons[0].direction === "pull" ? "<" : ">")}
              {buttons.map((button) => (
                <div>
                  {button.button}
                  <sup className="top-[-0.5em]">{button.row}</sup>
                </div>
              ))}
              {suggestedDirection &&
                direction !== "empty" &&
                suggestedDirection !== direction && <div>Opačný smer</div>}
            </div>
          );
        })}
        {/* {suggestedButtons.pull.map((buttons) => (
          <div
            className="flex border border-black p-1 cursor-pointer mx-1"
            onMouseEnter={() =>
              setSelectedMelodicButtons({
                buttons: buttons.map((button) => ({
                  row: button.row,
                  button: button.button,
                })),
                direction: "pull",
              })
            }
            onMouseLeave={() => setSelectedMelodicButtons(null)}
          >
            {"<"}
            {buttons.map((button) => (
              <div>
                {button.button}
                <sup className="top-[-0.5em]">{button.row}</sup>
              </div>
            ))}
          </div>
        ))} */}
      </div>
      <div>
        <div>Dĺžka nôt (počet stĺpcov)</div>
        {tuning.melodic
          .toSorted((a, b) => b.row - a.row)
          .map((row) => (
            <div key={row.row}>
              Rada {row.row}:
              <select
                className="w-20"
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("value", value, typeof value, parseFloat(value));
                  setLength(parseFloat(value), row.row);
                }}
              >
                {Array.from({ length: 16 }).map((_, index) => {
                  const value = (index + 1) / 2;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        <div>
          Basy:
          <select
            className="w-20"
            onChange={(e) => {
              const value = e.target.value;
              console.log("value", value, typeof value, parseFloat(value));
              setLength(parseFloat(value), "bass");
            }}
          >
            {Array.from({ length: 16 }).map((_, index) => {
              const value = (index + 1) / 2;
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MelodicSettings;
