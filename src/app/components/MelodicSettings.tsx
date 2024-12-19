import { useState } from "react";
import { useTuningContext } from "../tuningContext";
import MelodeonButton, { MelodeonButtonWrapper } from "./MelodeonButton";
import { Bass, Note } from "../types";
import { useSongContext } from "../songContext";
import MusicSheetSelector from "./MusicSheetSelector";

const MelodicSettings = () => {
  const { tuning } = useTuningContext();
  const { activeBeat, song, setMelodicButton, setBassButton, setDirection } =
    useSongContext();
  console.log("activeBeat", activeBeat);

  const [hoveredNote, setHoveredNote] = useState<Note | null>({
    note: "c",
    pitch: 2,
  });
  const [hoveredBass, setHoveredBass] = useState<Bass | null>(null);
  console.log("hoveredBass", hoveredBass);

  if (!activeBeat) {
    return null;
  }

  const beat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
  beat.melodic;

  console.log("beat", beat);

  return (
    <div className="absolute p-20">
      Settings
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-row">
          {tuning.bass.map((row) => {
            const cellItems = beat.bass.subCells[activeBeat.subBeatIndex].items;
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
                      const note =
                        direction === "pull" ? button.pull : button.push;
                      setBassButton(note, direction);
                    }}
                    // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                    button={button}
                    buttonNumberHidden
                    hoveredNote={hoveredBass}
                    setHoveredNote={setHoveredBass}
                    direction={beat.direction}
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
        <div className="flex gap-5 mx-8">
          <MelodeonButtonWrapper
            selected={beat.direction === "pull"}
            onClick={() => setDirection("pull")}
          >
            {"<----"}
          </MelodeonButtonWrapper>
          <MelodeonButtonWrapper
            selected={beat.direction === "empty"}
            onClick={() => setDirection("empty")}
          >
            {"-"}
          </MelodeonButtonWrapper>
          <MelodeonButtonWrapper
            selected={beat.direction === "push"}
            onClick={() => setDirection("push")}
          >
            {"--->"}
          </MelodeonButtonWrapper>
        </div>
        <div className="flex items-center flex-row-reverse">
          {tuning.melodic.map((row) => {
            const cellItems =
              beat.melodic[row.row - 1].subCells[activeBeat.subBeatIndex].items;
            const activeButtons = new Set(
              cellItems.map((item) =>
                item.type === "note" ? item.button : null
              )
            );
            console.log("Button for row", row, cellItems, activeButtons);
            return (
              <div key={row.row} className="flex flex-col-reverse">
                {row.buttons.map((button) => (
                  <MelodeonButton
                    key={button.button}
                    onClick={(direction) => {
                      console.log("clicked");
                      setMelodicButton(row.row, button.button, direction);
                    }}
                    // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                    button={button}
                    hoveredNote={hoveredNote}
                    setHoveredNote={setHoveredNote}
                    direction={beat.direction}
                    selected={activeButtons.has(button.button)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <MusicSheetSelector setHoveredNote={setHoveredNote} />
      {/* <div onMouseEnter={() => setHoveredNote("c")}>C</div>
      <div onMouseEnter={() => setHoveredNote("d")}>D</div>
      <div onMouseEnter={() => setHoveredNote("e")}>E</div>
      <div onMouseEnter={() => setHoveredNote("f")}>F</div>
      <div onMouseEnter={() => setHoveredNote("g")}>G</div>
      <div onMouseEnter={() => setHoveredNote("a")}>A</div>
      <div onMouseEnter={() => setHoveredNote("b")}>B</div>
      <div onMouseEnter={() => setHoveredNote("h")}>H</div> */}
    </div>
  );
};

export default MelodicSettings;
