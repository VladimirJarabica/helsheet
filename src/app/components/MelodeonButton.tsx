import {
  Bass,
  Direction,
  Note,
  TuningBassButton,
  TuningNoteButton,
} from "../types";

interface MelodeonButtonProps<
  ButtonType extends TuningNoteButton | TuningBassButton
> {
  onClick: (direction: Exclude<Direction, "empty">) => void;
  disabled?: boolean;
  button: ButtonType;
  buttonNumberHidden?: boolean;
  hoveredNote?: ButtonType["push"] | ButtonType["pull"] | null;
  setHoveredNote: (
    note: ButtonType["push"] | ButtonType["pull"] | null
  ) => void;
  direction: Direction;
}

const MelodeonButton = <
  ButtonType extends TuningNoteButton | TuningBassButton
>({
  onClick,
  disabled,
  button,
  buttonNumberHidden,
  hoveredNote,
  setHoveredNote,
  direction,
}: MelodeonButtonProps<ButtonType>) => {
  if (button.pull.note === "c" && button.pull.pitch === 2) {
    console.log("kek", hoveredNote, {
      condition:
        hoveredNote?.note === button.pull.note &&
        "pitch" in button.pull &&
        "pitch" in hoveredNote &&
        button.pull.pitch === hoveredNote.pitch,
    });
  }
  return (
    <div className="flex items-center">
      <div
        className={`
        w-14
        h-10
        flex
        justify-center
        items-center
        mx-1
        my-0.5
        text-sm
        whitespace-nowrap
        
        rounded-full
        border
        border-solid
        border-black
        border-b-[3px]
        cursor-pointer
        
        hover:border-b-[2px]
        hover:translate-y-[1px]
        
        active:border-b-[1px]
        active:translate-y-[2px]

        overflow-hidden
        `}
      >
        <div
          className={`w-[50%] text-center h-full flex items-center justify-center bg-green-50
            ${direction === "pull" ? "bg-gray-200 opacity-50" : ""}
            ${
              hoveredNote?.note === button.push.note &&
              "pitch" in button.push &&
              "pitch" in hoveredNote &&
              button.push.pitch === hoveredNote.pitch
                ? "bg-green-300"
                : ""
            }
            `}
          onMouseEnter={() => setHoveredNote(button.push)}
          onMouseLeave={() => setHoveredNote(null)}
          onClick={() => onClick("push")}
        >
          {button.push.note}
          {"pitch" in button.push && button.push.pitch !== 0 ? (
            <sup className="top-[-0.5em]">{button.push.pitch}</sup>
          ) : null}
        </div>
        <div
          className={`w-[50%] text-center border-l border-black h-full flex items-center justify-center bg-green-50
             ${direction === "push" ? "bg-gray-200 opacity-50" : ""}
            ${
              hoveredNote?.note === button.pull.note &&
              "pitch" in button.pull &&
              "pitch" in hoveredNote &&
              button.pull.pitch === hoveredNote.pitch
                ? "bg-green-300"
                : ""
            }
            `}
          onMouseEnter={() => setHoveredNote(button.pull)}
          onMouseLeave={() => setHoveredNote(null)}
          onClick={() => onClick("pull")}
        >
          {button.pull.note}
          {"pitch" in button.pull && button.pull.pitch !== 0 ? (
            <sup className="top-[-0.5em]">{button.pull.pitch}</sup>
          ) : null}
          {button.pull.note.length === 1 ? <>&nbsp;</> : null}
        </div>
      </div>
      {!buttonNumberHidden && button.button}
    </div>
  );
};

export default MelodeonButton;
