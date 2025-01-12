import { useLayoutEffect, useRef, useState } from "react";
import Button from "../Button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSheetContext } from "./sheetContext";

interface VerseProps {
  index: number;
  verse: string;
}
const Verse = ({ index, verse }: VerseProps) => {
  const [hasFocus, setHasFocus] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const { setVerseText, isEditing, removeVerse } = useSheetContext();

  const resizeTextArea = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.max(40, ref.current.scrollHeight) + "px";
    }
  };

  useLayoutEffect(() => {
    resizeTextArea();
  }, [verse]);

  return (
    <>
      {hasFocus && (
        <button
          className="w-6 absolute right-4 top-2 p-1 border border-black rounded hover:bg-hel-bgHover"
          onClick={() => {
            removeVerse(index);
          }}
        >
          <XMarkIcon />
        </button>
      )}
      <textarea
        className="bg-transparent resize-none p-1"
        onFocus={() => setHasFocus(true)}
        onBlur={() => setTimeout(() => setHasFocus(false), 100)}
        ref={ref}
        placeholder="Text slohy"
        autoFocus={verse === ""}
        rows={1}
        value={verse}
        onChange={(e) => setVerseText(index, e.target.value)}
        disabled={!isEditing}
      />
    </>
  );
};

const Verses = () => {
  const { song, addVerse, isEditing } = useSheetContext();

  return (
    <div className="max-w-[700px] w-11/12 flex justify-start flex-wrap gap-y-2 text-sm">
      {song.verses?.map((verse, i) => (
        <div key={i} className="flex flex-col w-1/2 pr-1 relative">
          <Verse index={i} verse={verse.text} />
        </div>
      ))}
      {isEditing && (
        <div className="w-1/2 flex flex-col print:hidden">
          <Button
            onClick={() => {
              addVerse("");
              // setNewVerse("");
            }}
          >
            + Pridať slohu
          </Button>
        </div>
      )}
    </div>
  );
};

export default Verses;
