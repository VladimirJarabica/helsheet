import { useState } from "react";
import { useTuningContext } from "../tuningContext";
import MelodeonButton from "./MelodeonButton";
import { Bass, Note } from "../types";
import { useSongContext } from "../songContext";

const MelodicSettings = () => {
  const { tuning } = useTuningContext();
  const { activeBeat, song, setMelodicButton } = useSongContext();
  console.log("activeBeat", activeBeat);

  const [hoveredNote, setHoveredNote] = useState<Note | null>({
    note: "c",
    pitch: 2,
  });
  const [hoveredBass, setHoveredBass] = useState<Bass | null>(null);
  console.log("hoveredNote", hoveredNote);

  if (!activeBeat) {
    return null;
  }

  const beat = song.bars[activeBeat.barIndex].beats[activeBeat.beatIndex];
  beat.melodic;

  console.log("beat", beat);

  return (
    <div className="absolute">
      Settings
      <div className="flex">
        <div className="flex items-center flex-row mr-40">
          {tuning.bass.map((row) => (
            <div key={row.row} className="flex flex-col">
              {row.buttons.map((button) => (
                <MelodeonButton
                  onClick={() => console.log("clicked")}
                  // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                  button={button}
                  buttonNumberHidden
                  hoveredNote={hoveredBass}
                  setHoveredNote={setHoveredBass}
                  direction={beat.direction}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center flex-row-reverse">
          {tuning.melodic.map((row) => {
            const cellItems =
              beat.melodic[row.row - 1].subCells[activeBeat.subBeatIndex].items;
            const buttons = cellItems
              .map((item) => (item.type === "note" ? item.button : null))
              .filter(Boolean);
            console.log("Button for row", row, cellItems);
            return (
              <div key={row.row} className="flex flex-col-reverse">
                {row.buttons.map((button) => (
                  <MelodeonButton
                    onClick={(direction) => {
                      console.log("clicked");
                      setMelodicButton(row.row, button.button, direction);
                    }}
                    // disabled={!!hoveredNote && button.pull.note != hoveredNote}
                    button={button}
                    hoveredNote={hoveredNote}
                    setHoveredNote={setHoveredNote}
                    direction={beat.direction}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
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
