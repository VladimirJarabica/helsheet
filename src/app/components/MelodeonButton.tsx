import {
  DefinedDirection,
  Direction,
  TuningBassButton,
  TuningNoteButton,
} from "../types";

interface MelodeonButtonWrapperProps {
  children: React.ReactNode;
  selected: boolean;
  onClick?: () => void;
}
export const MelodeonButtonWrapper = ({
  selected,
  children,
  onClick,
}: MelodeonButtonWrapperProps) => {
  return (
    <div
      onClick={() => onClick?.()}
      className={`
      w-14
      h-8
      flex
      justify-center
      items-center
      mx-1
      my-0.5
      text-sm
      whitespace-nowrap
      
      rounded-xl
      border
      border-solid
      border-black
      cursor-pointer
      
      ${
        !selected
          ? `
      border-b-[6px]
    //hover:border-b-[8px]
    //hover:-translate-y-[2px]
      //bg-green-50
      bg-[#e3d9bc]
      `
          : ""
      }
      
      active:border-b-[1px]
      active:translate-y-[2px]

      overflow-hidden

      ${
        selected
          ? `
      border-b-[1px]
      //bg-green-300
      bg-[#dbc991]
      `
          : ""
      }
      `}
    >
      {children}
    </div>
  );
};

interface MelodeonButtonProps<
  ButtonType extends TuningNoteButton | TuningBassButton
> {
  onClick: (direction: DefinedDirection) => void;
  button: ButtonType;
  buttonNumberHidden?: boolean;
  hoveredNote?: ButtonType["push"] | ButtonType["pull"] | null;
  setHoveredNote?: (
    note: ButtonType["push"] | ButtonType["pull"] | null
  ) => void;
  direction: Direction;
  selected: boolean;
}

const MelodeonButton = <
  ButtonType extends TuningNoteButton | TuningBassButton
>({
  onClick,
  button,
  buttonNumberHidden,
  hoveredNote,
  setHoveredNote,
  direction,
  selected,
}: MelodeonButtonProps<ButtonType>) => {
  return (
    <div className="flex items-center">
      <MelodeonButtonWrapper selected={selected}>
        {direction !== "pull" && (
          <div
            className={`w-[50%] text-center h-full flex items-center justify-center
            ${direction === "push" ? "w-full" : ""}
            ${
              hoveredNote?.note === button.push.note &&
              ("pitch" in button.push && "pitch" in hoveredNote
                ? button.push.pitch === hoveredNote.pitch
                : true)
                ? "bg-[#dbc991]"
                : ""
            }
            `}
            onMouseEnter={() => setHoveredNote?.(button.push)}
            onMouseLeave={() => setHoveredNote?.(null)}
            onClick={() => onClick("push")}
          >
            {button.push.note}
            {"pitch" in button.push && button.push.pitch !== 0 ? (
              <sup className="top-[-0.5em]">{button.push.pitch}</sup>
            ) : null}
          </div>
        )}
        {direction !== "push" && (
          <div
            className={`w-[50%] text-center h-full flex items-center justify-center
            ${direction === "pull" ? "w-full" : ""}
            ${direction === "empty" ? "border-l border-black" : ""}
            ${
              hoveredNote?.note === button.pull.note &&
              ("pitch" in button.pull && "pitch" in hoveredNote
                ? button.pull.pitch === hoveredNote.pitch
                : true)
                ? "bg-[#dbc991]"
                : ""
            }
            `}
            onMouseEnter={() => setHoveredNote?.(button.pull)}
            onMouseLeave={() => setHoveredNote?.(null)}
            onClick={() => onClick("pull")}
          >
            {button.pull.note}
            {"pitch" in button.pull && button.pull.pitch !== 0 ? (
              <sup className="top-[-0.5em]">{button.pull.pitch}</sup>
            ) : null}
          </div>
        )}
      </MelodeonButtonWrapper>
      {!buttonNumberHidden && button.button}
    </div>
  );
};

export default MelodeonButton;
