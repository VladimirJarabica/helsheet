import {
  DefinedDirection,
  Direction,
  TuningBassButton,
  TuningNoteButton,
} from "../types";

interface MelodeonButtonWrapperProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  noPadding?: boolean;
}
export const MelodeonButtonWrapper = ({
  selected,
  children,
  onClick,
  onHover,
  noPadding,
}: MelodeonButtonWrapperProps) => {
  return (
    <div
      onClick={() => onClick?.()}
      {...(onHover
        ? {
            onMouseEnter: () => onHover(true),
            onMouseLeave: () => onHover(false),
          }
        : {})}
      className={`
      min-w-11
      mx-1
      mt-2.5
      text-sm
      whitespace-nowrap
      rounded-xl
      //border
      overflow-visible
      transition-all
      border-solid
      border-gray-600
      cursor-pointer
      
      ${
        !selected
          ? `
      //border-b-[6px]
      //hover:border-b-[4px]
    //hover:-translate-y-[2px]
      //bg-////green-50
      //bg-///[#e3d9bc]
      `
          : ""
      }
      
      //active:border-b-[1px]
      //active:translate-y-[2px]

      overflow-hidden

      ${
        selected
          ? `
      //border-//b-[1px]
      //bg-//green-300
      //bg-//[#dbc991]
      `
          : ""
      }
      group
      bg-stone-500
    //bg-[#A30036]
    `}
    >
      <div
        className={`
      ${!noPadding ? "px-3" : ""}
      h-8
      flex
      justify-center
      items-center
      transition-all      
      rounded-xl
      w-full
      //bg-[#ef003b]
      //bg-hel-bgEmphasis
      bg-stone-200
      //text-white
      
      ${
        selected
          ? "-translate-y-0.5"
          : "-translate-y-1.5 group-hover:-translate-y-2 group-active:-translate-y-0.5"
      }
      
      `}
      >
        {children}
      </div>
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
    <div className="flex items-center flex-col md:flex-row-reverse max-w-full overflow-visible">
      <MelodeonButtonWrapper selected={selected} noPadding>
        <div className="w-14 h-full flex justify-center">
          {direction !== "pull" && (
            <div
              className={`flex-1 text-center h-full flex items-center justify-center
            ${direction === "push" ? "w-full" : ""}
            ${
              hoveredNote?.note === button.push.note &&
              ("pitch" in button.push && "pitch" in hoveredNote
                ? button.push.pitch === hoveredNote.pitch
                : true)
                ? // ? "bg-[#dbc991]"
                  ""
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
              className={`flex-1 text-center h-full flex items-center justify-center
            ${direction === "pull" ? "w-full" : ""}
            ${direction === "empty" ? "border-l border-gray-600" : ""}
            ${
              hoveredNote?.note === button.pull.note &&
              ("pitch" in button.pull && "pitch" in hoveredNote
                ? button.pull.pitch === hoveredNote.pitch
                : true)
                ? // ? "bg-[#dbc991]"
                  ""
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
        </div>
      </MelodeonButtonWrapper>
      {!buttonNumberHidden && <div className="text-xs">{button.button}</div>}
    </div>
  );
};

export default MelodeonButton;
