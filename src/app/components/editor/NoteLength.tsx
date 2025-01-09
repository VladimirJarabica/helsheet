import Image from "next/image";
import { useMemo } from "react";
import { WHOLE_NOTE_LENGTH_FOR_TIME_SIGNATURE } from "../../../utils/consts";
import { TimeSignature } from "../../types";

enum NOTE_TYPES {
  whole = "whole",
  half = "half",
  quarter = "quarter",
  eighth = "eighth",
  sixteenth = "sixteenth",
}

const getNotesLengthsForTimeSignature = (timeSignature: TimeSignature) => {
  const wholeNoteLength = WHOLE_NOTE_LENGTH_FOR_TIME_SIGNATURE[timeSignature];

  return [
    {
      type: NOTE_TYPES.whole,
      length: wholeNoteLength,
    },
    {
      type: NOTE_TYPES.half,
      length: wholeNoteLength / 2,
    },
    {
      type: NOTE_TYPES.quarter,
      length: wholeNoteLength / 4,
    },
    {
      type: NOTE_TYPES.eighth,
      length: wholeNoteLength / 8,
    },
    {
      type: NOTE_TYPES.sixteenth,
      length: wholeNoteLength / 16,
    },
  ];
};

interface NoteLengthProps {
  timeSignature: TimeSignature;
  // Number of columns
  length: number;
}

const NoteLength = ({ timeSignature, length }: NoteLengthProps) => {
  const notes = useMemo(() => {
    const notesLengthsForTimeSignatures =
      getNotesLengthsForTimeSignature(timeSignature);

    const usedNotes = [];
    let remainingLength = length;
    while (remainingLength >= 0.5) {
      const noteToUse = notesLengthsForTimeSignatures.find(
        (note) => note.length <= remainingLength
      );
      if (!noteToUse) {
        break;
      }

      if (remainingLength >= noteToUse.length * 2) {
        const usedTimes = Math.floor(remainingLength / noteToUse.length);

        for (let i = 0; i < usedTimes; i++) {
          usedNotes.push({ ...noteToUse, dot: false });
        }
        remainingLength -= noteToUse.length * usedTimes;
        continue;
      }

      if (remainingLength === noteToUse.length * 1.5) {
        usedNotes.push({ ...noteToUse, dot: true });
        remainingLength -= noteToUse.length * 1.5;
        continue;
      }

      if (remainingLength >= noteToUse.length) {
        usedNotes.push({ ...noteToUse, dot: false });
        remainingLength -= noteToUse.length;
        continue;
      }
      break;
    }

    return usedNotes;
  }, [timeSignature, length]);

  return (
    <div className="flex flex-row gap-1">
      {notes.map((note, i) => (
        <div key={i}>
          <div className="flex flex-row">
            {i > 0 && <div>_</div>}
            <Image
              src={`/${note.type}-note.png`}
              className=" h-[20px] w-[auto]"
              width={40}
              height={40}
              alt="note"
            />
            {note.dot && <div>.</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteLength;
