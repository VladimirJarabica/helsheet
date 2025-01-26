import { Scale as ScaleEnum } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { Note, ScaleSignature } from "../../types";

const Notes: (Note & {
  position: number;
})[] = [
  { note: "g", pitch: -1, position: -13 },
  { note: "gis", pitch: -1, position: -13 },
  { note: "a", pitch: -1, position: -12 },
  { note: "as", pitch: -1, position: -12 },
  { note: "h", pitch: -1, position: -11 },
  { note: "b", pitch: -1, position: -11 },
  { note: "c", pitch: 0, position: -10 },
  { note: "cis", pitch: 0, position: -10 },
  { note: "d", pitch: 0, position: -9 },
  { note: "dis", pitch: 0, position: -9 },
  { note: "des", pitch: 0, position: -9 },
  { note: "e", pitch: 0, position: -8 },
  { note: "es", pitch: 0, position: -8 },
  { note: "f", pitch: 0, position: -7 },
  { note: "fis", pitch: 0, position: -7 },
  { note: "g", pitch: 0, position: -6 },
  { note: "gis", pitch: 0, position: -6 },
  { note: "a", pitch: 0, position: -5 },
  { note: "as", pitch: 0, position: -5 },
  { note: "h", pitch: 0, position: -4 },
  { note: "b", pitch: 0, position: -4 },
  { note: "c", pitch: 1, position: -3 },
  { note: "cis", pitch: 1, position: -3 },
  { note: "d", pitch: 1, position: -2 },
  { note: "dis", pitch: 1, position: -2 },
  { note: "des", pitch: 1, position: -2 },
  { note: "e", pitch: 1, position: -1 },
  { note: "es", pitch: 1, position: -1 },
  { note: "f", pitch: 1, position: 0 },
  { note: "fis", pitch: 1, position: 0 },
  { note: "g", pitch: 1, position: 1 },
  { note: "gis", pitch: 1, position: 1 },
  { note: "a", pitch: 1, position: 2 },
  { note: "as", pitch: 1, position: 2 },
  { note: "b", pitch: 1, position: 3 },
  { note: "h", pitch: 1, position: 3 },
  { note: "c", pitch: 2, position: 4 },
  { note: "cis", pitch: 2, position: 4 },
  { note: "d", pitch: 2, position: 5 },
  { note: "dis", pitch: 2, position: 5 },
  { note: "des", pitch: 2, position: 5 },
  { note: "e", pitch: 2, position: 6 },
  { note: "es", pitch: 2, position: 6 },
  { note: "f", pitch: 2, position: 7 },
  { note: "fis", pitch: 2, position: 7 },
  { note: "g", pitch: 2, position: 8 },
  { note: "gis", pitch: 2, position: 8 },
  { note: "a", pitch: 2, position: 9 },
  { note: "as", pitch: 2, position: 9 },
  { note: "h", pitch: 2, position: 10 },
  { note: "b", pitch: 2, position: 10 },
  { note: "c", pitch: 3, position: 11 },
  { note: "cis", pitch: 3, position: 11 },
  { note: "d", pitch: 3, position: 12 },
  { note: "dis", pitch: 3, position: 12 },
  { note: "des", pitch: 3, position: 12 },
];

type Scale = {
  id: ScaleEnum;
  name: string;
  signature: ScaleSignature;
  notes: Note["note"][];
  transpositionNotes: Note[];
};
const Scales: Scale[] = [
  {
    id: ScaleEnum.E_dur,
    name: "E dur",
    signature: "####",
    notes: ["cis", "dis", "e", "fis", "gis", "a", "h"],
    transpositionNotes: [
      { note: "e", pitch: 1 },
      { note: "fis", pitch: 1 },
      { note: "gis", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
      { note: "dis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.A_dur,
    name: "A dur",
    signature: "###",
    notes: ["cis", "d", "e", "fis", "gis", "a", "h"],
    transpositionNotes: [
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
      { note: "fis", pitch: 2 },
      { note: "gis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.D_dur,
    name: "D dur",
    signature: "##",
    notes: ["cis", "d", "e", "fis", "g", "a", "h"],
    transpositionNotes: [
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "fis", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.G_dur,
    name: "G dur",
    signature: "#",
    notes: ["c", "d", "e", "fis", "g", "a", "h"],
    transpositionNotes: [
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
      { note: "fis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.C_dur,
    name: "C dur",
    signature: "",
    notes: ["c", "d", "e", "f", "g", "a", "h"],
    transpositionNotes: [
      { note: "c", pitch: 1 },
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
    ],
  },
  {
    id: ScaleEnum.F_dur,
    name: "F dur",
    signature: "b",
    notes: ["c", "d", "e", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.B_dur,
    name: "B dur",
    signature: "bb",
    notes: ["c", "d", "es", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "es", pitch: 2 },
      { note: "f", pitch: 2 },
      { note: "g", pitch: 2 },
      { note: "a", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.Es_dur,
    name: "Es dur",
    signature: "bbb",
    notes: ["c", "d", "es", "f", "g", "as", "b"],
    transpositionNotes: [
      { note: "es", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "as", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.As_dur,
    name: "As dur",
    signature: "bbbb",
    notes: ["c", "des", "es", "f", "g", "as", "b"],
    transpositionNotes: [
      { note: "as", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "des", pitch: 2 },
      { note: "es", pitch: 2 },
      { note: "f", pitch: 2 },
      { note: "g", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.A_mol,
    name: "C dur",
    signature: "",
    notes: ["c", "d", "e", "f", "g", "a", "h"],
    transpositionNotes: [
      { note: "a", pitch: 0 },
      { note: "h", pitch: 0 },
      { note: "c", pitch: 1 },
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
    ],
  },
  {
    id: ScaleEnum.D_mol,
    name: "d mol",
    signature: "b",
    notes: ["c", "d", "e", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
    ],
  },
];

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
      <div className="relative my-20 w-[510px]">
        <div className="flex mb-16 gap-2">
          <div className="flex">
            <label>Stupnica</label>
            <select
              className="bg-transparent text-sm border-b border-gray-400 outline-none"
              value={scale.id}
              onChange={(e) => {
                const newScale = Scales.find(
                  (scale) => scale.id === e.target.value
                );
                if (newScale) {
                  setScale(newScale);
                }
              }}
            >
              {Scales.map((scale) => (
                <option key={scale.signature} value={scale.id}>
                  {`${scale.name}${
                    scale.signature ? ` (${scale.signature})` : ""
                  }`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <label>Transpozícia</label>
            <select
              className="bg-transparent text-sm border-b border-gray-400 outline-none"
              value={transposeScale?.id ?? undefined}
              onChange={(e) => {
                const value = e.target.value;
                const newScale = value
                  ? Scales.find((scale) => scale.id === value) ?? null
                  : null;
                setTransposeScale(newScale);
              }}
            >
              <option value="">Žiadna</option>
              {Scales.map((scale) => (
                <option key={scale.signature} value={scale.id}>
                  {`${scale.name}${
                    scale.signature ? ` (${scale.signature})` : ""
                  }`}
                </option>
              ))}
            </select>
          </div>
          {transposeScale && (
            <div className="flex">
              <label>Posun oktávy</label>
              <select
                className="bg-transparent text-sm border-b border-gray-400 outline-none"
                value={pitchOffset}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!Number.isNaN(value)) {
                    setPitchOffset(value);
                  }
                }}
              >
                {new Array(5).fill(0).map((_, index) => {
                  const value = index - 2;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>
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
