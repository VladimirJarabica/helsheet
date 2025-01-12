import { useState } from "react";
import { Note, ScaleSignature } from "../../types";
import { Scale as ScaleEnum } from "@prisma/client";
import { useSheetContext } from "./sheetContext";

const Notes: (Note & {
  position: number;
})[] = [
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
];

type Scale = {
  id: ScaleEnum;
  name: string;
  signature: ScaleSignature;
  notes: Note["note"][];
};
const Scales: Scale[] = [
  {
    id: ScaleEnum.E_dur,
    name: "E dur",
    signature: "####",
    notes: ["cis", "dis", "e", "fis", "gis", "a", "h"],
  },
  {
    id: ScaleEnum.A_dur,
    name: "A dur",
    signature: "###",
    notes: ["cis", "d", "e", "fis", "gis", "a", "h"],
  },
  {
    id: ScaleEnum.D_dur,
    name: "D dur",
    signature: "##",
    notes: ["cis", "d", "e", "fis", "g", "a", "h"],
  },
  {
    id: ScaleEnum.G_dur,
    name: "G dur",
    signature: "#",
    notes: ["c", "d", "e", "fis", "g", "a", "h"],
  },
  {
    id: ScaleEnum.C_dur,
    name: "C dur",
    signature: "",
    notes: ["c", "d", "e", "f", "g", "a", "h"],
  },
  {
    id: ScaleEnum.F_dur,
    name: "F dur",
    signature: "b",
    notes: ["c", "d", "e", "f", "g", "a", "b"],
  },
  {
    id: ScaleEnum.B_dur,
    name: "B dur",
    signature: "bb",
    notes: ["c", "d", "es", "f", "g", "a", "b"],
  },
  {
    id: ScaleEnum.Es_dur,
    name: "Es dur",
    signature: "bb",
    notes: ["c", "d", "es", "f", "g", "as", "b"],
  },
];

type NoteSymbolProps = {
  note: Note;
  textPosition: "top" | "bottom";
  onClick?: () => void;
  isSelected: boolean;
};

const NoteSymbol = ({
  note,
  textPosition,
  onClick,
  isSelected,
}: NoteSymbolProps) => {
  return (
    <div
      className="h-[30px] w-3 relative rounded-br-xl cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`
        absolute w-[1px] right-0 h-[80%] group-hover:bg-black
        ${isSelected ? "bg-black" : "bg-gray-400"}
        `}
      />
      <div
        className={`rounded-full group-hover:bg-black w-3 h-[9px] bottom-0 absolute right-0 -skew-y-12
          ${isSelected ? "bg-black" : "bg-gray-400"}
          `}
      />
      <div
        className={`absolute text-sm ${
          textPosition === "top" ? "bottom-full" : "top-full"
        }`}
      >
        {note.note}
        <sup className="top-[-0.5em]">{note.pitch}</sup>
      </div>
    </div>
  );
};

interface MusicSheetSelectorProps {
  setHoveredNote: (note: Note | null) => void;
  onSelectNote: (note: Note) => void;
  selectedNotes: Note[];
}

const MusicSheetSelector = ({
  setHoveredNote,
  onSelectNote,
  selectedNotes,
}: MusicSheetSelectorProps) => {
  const { sheet } = useSheetContext();
  const [scale, setScale] = useState<Scale>(
    Scales.find((s) => s.id === sheet.scale) ?? Scales[4]
  );

  return (
    <div className="max-w-[100vw] overflow-auto">
      <div className="relative my-20 w-[430px]">
        <div className="flex flex-col w-32">
          <label>Stupnica</label>
          <select
            className="bg-transparent"
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
        <div>
          <div className="w-full h-[9px] border border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
          <div className="w-full h-[9px] border border-t-0 border-black" />
        </div>
        {Notes.filter((note) => scale.notes.includes(note.note)).map(
          (note, index) => {
            const isSelected = selectedNotes.some(
              (selectedNote) =>
                selectedNote.note === note.note &&
                selectedNote.pitch === note.pitch
            );
            return (
              <div
                key={scale.signature + note.note + note.pitch}
                className="absolute"
                style={{ bottom: 4.5 * note.position, left: 5 + index * 19 }}
                onMouseEnter={() => setHoveredNote(note)}
                onMouseLeave={() => setHoveredNote(null)}
              >
                <NoteSymbol
                  note={note}
                  textPosition={note.position < 1 ? "bottom" : "top"}
                  onClick={() => onSelectNote(note)}
                  isSelected={isSelected}
                />
                {(note.position < -2 || note.position > 7) && (
                  <div
                    className="w-[24px] h-[1px] bg-gray-500 absolute left-[-5px]"
                    style={{
                      bottom: note.position % 2 === 0 ? 9 : 4.5,
                    }}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default MusicSheetSelector;
