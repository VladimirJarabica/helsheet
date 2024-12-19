import { Note } from "../types";

const Notes: (Note & { position: number })[] = [
  { note: "e", pitch: 0, position: -8 },
  { note: "f", pitch: 0, position: -7 },
  { note: "g", pitch: 0, position: -6 },
  { note: "a", pitch: 0, position: -5 },
  { note: "h", pitch: 0, position: -4 },
  { note: "c", pitch: 1, position: -3 },
  { note: "d", pitch: 1, position: -2 },
  { note: "e", pitch: 1, position: -1 },
  { note: "f", pitch: 1, position: 0 },
  { note: "g", pitch: 1, position: 1 },
  { note: "a", pitch: 1, position: 2 },
  { note: "b", pitch: 1, position: 2 },
  { note: "h", pitch: 1, position: 3 },
  { note: "c", pitch: 2, position: 4 },
  { note: "d", pitch: 2, position: 5 },
  { note: "e", pitch: 2, position: 6 },
  { note: "f", pitch: 2, position: 7 },
  { note: "g", pitch: 2, position: 8 },
  { note: "a", pitch: 2, position: 9 },
  { note: "b", pitch: 2, position: 10 },
  { note: "h", pitch: 2, position: 10 },
  { note: "c", pitch: 2, position: 11 },
  { note: "d", pitch: 2, position: 12 },
];

const NoteSymbol = () => {
  return (
    <div className="h-[42px] w-4 relative rounded-br-xl">
      <div className="absolute w-[1px] right-0 h-[80%] bg-black" />
      <div className="rounded-full bg-black w-4 h-3 bottom-0 absolute right-0 -skew-y-12" />
    </div>
  );
};

interface MusicSheetSelectorProps {
  setHoveredNote: (note: Note | null) => void;
}

const MusicSheetSelector = ({ setHoveredNote }: MusicSheetSelectorProps) => {
  return (
    <div className="relative">
      <div>
        <div className="w-full h-3 border border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
        <div className="w-full h-3 border border-t-0 border-black" />
      </div>
      {Notes.map((note, index) => (
        <div
          key={note.note + note.pitch}
          className="absolute"
          style={{ bottom: 6 * note.position, left: 5 + index * 26 }}
          onMouseEnter={() => setHoveredNote(note)}
        >
          <NoteSymbol />
        </div>
      ))}
    </div>
  );
};

export default MusicSheetSelector;
