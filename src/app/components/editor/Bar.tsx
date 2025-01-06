"use client";
import { useEffect, useRef, useState } from "react";
import {
  LINE_HEADING_WIDTH_WITH_BORDER,
  VARIANT_CELL_HEIGHT,
} from "../../../utils/consts";
import { Bar as BarType } from "./../../types";
import Column from "./Column";
import LineHeading from "./LineHeading";
import ModalWrapper from "./ModalWrapper";
import RepeatSign from "./RepeatSign";
import { useSongContext } from "./songContext";
import Variants from "./Variants";

interface BarProps {
  bar: BarType;
  previousBar?: BarType;
  followingBar?: BarType;
  barIndex: number;
}
const Bar = ({ bar, previousBar, followingBar, barIndex }: BarProps) => {
  const {
    song,
    duplicateBar,
    removeBar,
    setRepeatOfBar,
    editable,
    addColumnToBar,
    removeLastColumnFromBar,
    setBarVariant,
  } = useSongContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectingVariant, setIsSelectingVariant] = useState(false);

  const variant = bar.variant
    ? song.variants?.find((v) => v.id === bar.variant)
    : null;

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as HTMLElement)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  const handleChangeRepeat = (
    type: keyof Exclude<BarType["repeat"], undefined>
  ) => {
    setRepeatOfBar(barIndex, {
      start: false,
      end: false,
      ...bar.repeat,
      [type]: !bar.repeat?.[type],
    });
  };

  return (
    <div className={`flex group flex-col relative`}>
      <div
        className={`z-0 w-0 absolute`}
        style={{
          left: -LINE_HEADING_WIDTH_WITH_BORDER,
          marginTop: VARIANT_CELL_HEIGHT,
        }}
      >
        <LineHeading />
      </div>
      <div
        className={`text-xs 
          ${variant ? "border-t-2 px-3" : ""}
          ${previousBar?.variant !== bar.variant ? "border-l-2" : ""}
          ${followingBar?.variant !== bar.variant ? "border-r-2" : ""}
          border-black`}
        style={{ height: VARIANT_CELL_HEIGHT }}
      >
        {variant?.name}
      </div>
      <div className="flex z-10 bg-hel-bgDefault">
        {/* {onNewLine && <LineHeading />} */}
        {bar.repeat?.start && <RepeatSign type="start" topOffset={20} />}
        {bar.repeat?.end && <RepeatSign type="end" topOffset={20} />}
        {bar.columns.map((column, i) => (
          <Column
            key={i}
            columnIndex={i}
            barIndex={barIndex}
            lastColumnInBar={i === bar.columns.length - 1}
            column={column}
            previousColumn={
              i === 0
                ? previousBar?.columns[bar.columns.length - 1]
                : bar.columns[i - 1]
            }
            followingColumn={
              i === bar.columns.length - 1
                ? followingBar?.columns[0]
                : bar.columns[i + 1]
            }
          />
        ))}
      </div>
      {editable && (
        <div
          className="absolute right-0 top-0 bg-transparent z-20 print:hidden w-fit"
          ref={menuRef}
        >
          {!isMenuOpen && (
            <button
              className="border border-black hidden group-hover:block px-2 text-xs rounded-md bg-[#e3d9bc] shadow"
              onClick={() => {
                setIsMenuOpen(true);
              }}
            >
              ...
            </button>
          )}
          {isMenuOpen && (
            <div className="border border-black bg-[#e3d9bc] m-2 flex flex-col">
              <button
                onClick={() => duplicateBar(barIndex)}
                className="px-2 hover:bg-[#dbc991]"
              >
                Duplikovať takt
              </button>
              <button
                onClick={() => {
                  removeBar(barIndex);
                  setIsMenuOpen(false);
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                Vymazať takt
              </button>
              <button
                onClick={() => {
                  handleChangeRepeat("start");
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                {bar.repeat?.start
                  ? "Zrušiť začiatok opakovania"
                  : "Začať opakovanie"}
              </button>
              <button
                onClick={() => {
                  handleChangeRepeat("end");
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                {bar.repeat?.end
                  ? "Zrušiť koniec opakovania"
                  : "Ukončiť opakovanie"}
              </button>
              {bar.variant ? (
                <button
                  onClick={() => {
                    setBarVariant(barIndex, undefined);
                  }}
                  className="px-2 hover:bg-[#dbc991]"
                >
                  Odobrať variant
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSelectingVariant(true);
                  }}
                  className="px-2 hover:bg-[#dbc991]"
                >
                  Pridať variant
                </button>
              )}
              <button
                onClick={() => {
                  addColumnToBar(barIndex);
                }}
                className="px-2 hover:bg-[#dbc991]"
              >
                Pridať stĺpec
              </button>
              {bar.columns.length > 1 && (
                <button
                  onClick={() => {
                    removeLastColumnFromBar(barIndex);
                  }}
                  className="px-2 hover:bg-[#dbc991]"
                >
                  Odstrániť stĺpec
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {isSelectingVariant && (
        <ModalWrapper close={() => setIsSelectingVariant(false)}>
          <Variants
            onSelect={(variantId) => {
              setBarVariant(barIndex, variantId);
              setIsSelectingVariant(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export default Bar;
