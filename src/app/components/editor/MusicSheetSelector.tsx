import { Scale as ScaleEnum } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { Notes } from "../../../utils/consts";
import { Scale, Scales } from "../../../utils/scale";
import { Note } from "../../types";
import Select from "../Select";

export const transposeNote = ({
  from,
  to,
  note,
  pitchOffset = 0,
}: {
  from: ScaleEnum;
  to: ScaleEnum;
  note: Note;
  pitchOffset?: number;
}): Note => {
  const fromScale = Scales.find((scale) => scale.id === from);
  const toScale = Scales.find((scale) => scale.id === to);
  if (!fromScale || !toScale) {
    return note;
  }

  const transpositionIndex = fromScale.transpositionNotes.findIndex(
    (n) => n.note === note.note
  );

  const fromScaleTranspositionNote =
    fromScale.transpositionNotes[transpositionIndex];
  if (!fromScaleTranspositionNote) {
    return note;
  }

  const pitchDifference = fromScaleTranspositionNote.pitch - note.pitch;

  const toScaleTranspositionNote =
    toScale.transpositionNotes[transpositionIndex];

  return {
    note: toScaleTranspositionNote.note,
    pitch: (toScaleTranspositionNote.pitch -
      pitchDifference +
      pitchOffset) as Note["pitch"],
  };
};

interface NoteScaleProps {
  scale: Scale;
  selectedNotes: Note[];
  setHoveredNote: (note: Note | null) => void;
  onSelectNote: (note: Note) => void;
  hoveredNote: Note | null;
  scaleType: "normal" | "transpose";
}
const NoteScale = ({
  scale,
  selectedNotes,
  setHoveredNote,
  hoveredNote,
  onSelectNote,
  scaleType,
}: NoteScaleProps) => {
  return (
    <>
      {Notes.filter((note) => scale.notes.includes(note.note)).map((note) => {
        const isSelected = selectedNotes.some(
          (selectedNote) =>
            selectedNote.note === note.note && selectedNote.pitch === note.pitch
        );
        const isHovered =
          hoveredNote &&
          hoveredNote.note === note.note &&
          hoveredNote.pitch === note.pitch;
        const upsideDown = note.position < -3;

        const noteBottom =
          4.5 * note.position + 12 * 4.5 - (upsideDown ? 20 : 0);

        const noteLeft =
          (scaleType === "transpose" ? 200 : 0) +
          5 +
          Math.abs(note.position + 3) * 19;

        return (
          <div
            key={scale.signature + note.note + note.pitch}
            className="absolute"
            style={{ bottom: noteBottom, left: noteLeft }}
            onMouseEnter={() => setHoveredNote(note)}
            onMouseLeave={() => setHoveredNote(null)}
          >
            <NoteSymbol
              note={note}
              textPosition={note.position < -2 ? "bottom" : "top"}
              onClick={() => onSelectNote(note)}
              isSelected={isSelected}
              isHovered={!!isHovered}
              isUpsideDown={upsideDown}
            />
            {(note.position === -3 || note.position > 7) && (
              <div
                className="w-[24px] h-[1px] bg-gray-500 absolute left-[-5px]"
                style={{
                  bottom: note.position % 2 === 0 ? 9 : 4.5,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

type NoteSymbolProps = {
  note: Note;
  textPosition: "top" | "bottom";
  onClick?: () => void;
  isHovered: boolean;
  isSelected: boolean;
  isUpsideDown: boolean;
};

const NoteSymbol = ({
  note,
  textPosition,
  onClick,
  isSelected,
  isHovered,
  isUpsideDown,
}: NoteSymbolProps) => {
  return (
    <div
      className="h-[30px] w-3 relative rounded-br-xl cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`
        absolute w-[1px] right-0 h-[80%] group-hover:bg-black
        ${isSelected || isHovered ? "bg-black" : "bg-gray-400"}
        ${isUpsideDown ? "bottom-0" : "top-0"}
        `}
      />
      <div
        className={`rounded-full group-hover:bg-black w-3 h-[9px] absolute right-0 -skew-y-12
          ${isSelected || isHovered ? "bg-black" : "bg-gray-400"}
          ${isUpsideDown ? "top-0" : "bottom-0"}
          `}
      />
      <div
        className={`absolute text-xs ${
          textPosition === "top" ? "bottom-full" : "top-full"
        }`}
      >
        {note.note}
        <sup className="top-[-0.5em]">{note.pitch}</sup>
      </div>
    </div>
  );
};

const scaleAtom = atom<Scale>(Scales[4]);
const transposeScaleAtom = atom<Scale | null>(null);
const pitchOffsetAtom = atom(0);

interface MusicSheetSelectorProps {
  setHoveredNote: (note: Note | null) => void;
  hoveredNote: Note | null;
  onSelectNote: (note: Note) => void;
  selectedNotes: Note[];
}

const MusicSheetSelector = ({
  setHoveredNote,
  hoveredNote,
  onSelectNote,
  selectedNotes,
}: MusicSheetSelectorProps) => {
  const [scale, setScale] = useAtom<Scale>(scaleAtom);
  const [transposeScale, setTransposeScale] = useAtom<Scale | null>(
    transposeScaleAtom
  );
  const [pitchOffset, setPitchOffset] = useAtom(pitchOffsetAtom);

  const originalScaleSelectedNotes = transposeScale
    ? selectedNotes.map((note) =>
        transposeNote({
          from: transposeScale.id,
          to: scale.id,
          note,
          pitchOffset: -pitchOffset,
        })
      )
    : selectedNotes;

  const originalScaleHoveredNote =
    transposeScale && hoveredNote
      ? transposeNote({
          from: transposeScale.id,
          to: scale.id,
          note: hoveredNote,
          pitchOffset: -pitchOffset,
        })
      : hoveredNote;

  return (
    <div className="max-w-[100vw] overflow-auto">
      <div className="relative mb-20 w-[510px]">
        <div className="flex items-center mb-16 gap-2">
          <label>Stupnica</label>
          <Select
            label="Stupnica"
            value={scale.id}
            inlineLabel
            onChange={(e) => {
              const newScale = Scales.find(
                (scale) => scale.id === e.target.value
              );
              if (newScale) {
                setScale(newScale);
              }
            }}
            options={Scales.map((scale) => ({
              value: scale.id,
              label: `${scale.name}${
                scale.signature ? ` (${scale.signature})` : ""
              }`,
            }))}
          />
          <Select
            label="Transpozícia"
            value={transposeScale?.id ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              const newScale = value
                ? Scales.find((scale) => scale.id === value) ?? null
                : null;
              setTransposeScale(newScale);
            }}
            options={[
              ...Scales.map((scale) => ({
                value: scale.id,
                label: `${scale.name}${
                  scale.signature ? ` (${scale.signature})` : ""
                }`,
              })),
            ]}
            inlineLabel
          />
          {transposeScale && (
            <Select
              label="Posun oktávy"
              value={pitchOffset || ""}
              resetValue={() => setPitchOffset(0)}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!Number.isNaN(value)) {
                  setPitchOffset(value);
                }
              }}
              options={[
                { value: "2", label: "2" },
                { value: "1", label: "1" },
                { value: "-1", label: "-1" },
                { value: "-2", label: "-2" },
              ]}
              inlineLabel
            />
          )}
        </div>

        <div>
          <div className="w-full h-[9px] border border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="h-[18px]" />
          <div className="w-full h-[9px] border border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
        </div>
        <NoteScale
          scale={scale}
          selectedNotes={originalScaleSelectedNotes}
          setHoveredNote={(note) =>
            setHoveredNote(
              transposeScale && note
                ? transposeNote({
                    from: scale.id,
                    to: transposeScale.id,
                    note,
                    pitchOffset,
                  })
                : note
            )
          }
          hoveredNote={originalScaleHoveredNote}
          onSelectNote={(note) =>
            onSelectNote(
              transposeScale && note
                ? transposeNote({
                    from: scale.id,
                    to: transposeScale.id,
                    note,
                    pitchOffset,
                  })
                : note
            )
          }
          scaleType="normal"
        />
        {transposeScale && (
          <NoteScale
            scale={transposeScale}
            selectedNotes={selectedNotes}
            setHoveredNote={setHoveredNote}
            hoveredNote={hoveredNote}
            onSelectNote={onSelectNote}
            scaleType="transpose"
          />
        )}
      </div>
    </div>
  );
};

export default MusicSheetSelector;
