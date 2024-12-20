import { useState } from "react";
import { Note, ScaleSignature } from "../types";

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
  { note: "h", pitch: 2, position: 10 },
  { note: "b", pitch: 2, position: 10 },
  { note: "c", pitch: 3, position: 11 },
  { note: "cis", pitch: 3, position: 11 },
  { note: "d", pitch: 3, position: 12 },
  { note: "dis", pitch: 3, position: 12 },
];

type Scale = {
  name: string;
  signature: ScaleSignature;
  notes: Note["note"][];
};
const Scales: Scale[] = [
  {
    name: "E dur",
    signature: "####",
    notes: ["cis", "dis", "e", "fis", "gis", "a", "h"],
  },
  {
    name: "A dur",
    signature: "###",
    notes: ["cis", "d", "e", "fis", "gis", "a", "h"],
  },
  {
    name: "D dur",
    signature: "##",
    notes: ["cis", "d", "e", "fis", "g", "a", "h"],
  },
  {
    name: "G dur",
    signature: "#",
    notes: ["c", "d", "e", "fis", "g", "a", "h"],
  },
  { name: "C dur", signature: "", notes: ["c", "d", "e", "f", "g", "a", "h"] },
  { name: "F dur", signature: "b", notes: ["c", "d", "e", "f", "g", "a", "b"] },
  {
    name: "B dur",
    signature: "bb",
    notes: ["c", "d", "es", "f", "g", "a", "b"],
  },
];

type NoteSymbolProps = {
  note: Note;
  textPosition: "top" | "bottom";
  onClick?: () => void;
};

const NoteSymbol = ({ note, textPosition, onClick }: NoteSymbolProps) => {
  return (
    <div
      className="h-[42px] w-4 relative rounded-br-xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute w-[1px] right-0 h-[80%] bg-gray-700 group-hover:bg-black" />
      <div className="rounded-full bg-gray-700 group-hover:bg-black w-4 h-3 bottom-0 absolute right-0 -skew-y-12" />
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
}

const MusicSheetSelector = ({
  setHoveredNote,
  onSelectNote,
}: MusicSheetSelectorProps) => {
  const [scale, setScale] = useState<Scale>(Scales[4]);
  return (
    <div className="relative my-20 w-[550px]">
      <div className="flex flex-col w-32">
        <label>Stupnica</label>
        <select
          value={scale.signature}
          onChange={(e) => {
            const newScale = Scales.find(
              (scale) => scale.signature === e.target.value
            );
            if (newScale) {
              setScale(newScale);
            }
          }}
        >
          {Scales.map((scale) => (
            <option key={scale.signature} value={scale.signature}>
              {`${scale.name}${scale.signature ? ` (${scale.signature})` : ""}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="w-full h-3 border border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
      </div>
      {Notes.filter((note) => scale.notes.includes(note.note)).map(
        (note, index) => (
          <div
            key={scale.signature + note.note + note.pitch}
            className="absolute"
            style={{ bottom: 6 * note.position, left: 5 + index * 26 }}
            onMouseEnter={() => setHoveredNote(note)}
            onMouseLeave={() => setHoveredNote(null)}
          >
            <NoteSymbol
              note={note}
              textPosition={note.position < 1 ? "bottom" : "top"}
              onClick={() => onSelectNote(note)}
            />
            {(note.position < -2 || note.position > 9) && (
              <div
                className="w-[26px] h-[1px] bg-black absolute left-[-5px]"
                style={{
                  bottom: note.position % 2 === 0 ? 12 : 6,
                }}
              />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default MusicSheetSelector;
