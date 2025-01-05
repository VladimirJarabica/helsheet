import { useLayoutEffect, useRef, useState } from "react";
import Button from "../Button";
import { useSongContext } from "./songContext";

interface VerseProps {
  index: number;
  verse: string;
}
const Verse = ({ index, verse }: VerseProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.max(17, ref.current.scrollHeight) + "px";
    }
  };

  useLayoutEffect(() => {
    resizeTextArea();
  }, []);

  return (
    <textarea
      className="bg-transparent"
      ref={ref}
      rows={1}
      value={verse}
      // onChange={handleInput}
    />
  );
};

const Verses = () => {
  const { song, addVerse } = useSongContext();

  const [newVerse, setNewVerse] = useState("");

  return (
    <div className="max-w-[700px] w-11/12 flex justify-start flex-wrap gap-y-2 text-sm">
      {song.verses?.map((verse, i) => (
        <div key={i} className="flex flex-col w-1/2">
          <Verse index={i} verse={verse.text} />
        </div>
      ))}
      <div className="w-1/2 flex flex-col">
        <textarea
          placeholder="ďalšia sloha"
          className="bg-transparent w-full"
          value={newVerse}
          onChange={(e) => setNewVerse(e.target.value)}
          rows={4}
        />
        <Button
          onClick={() => {
            addVerse(newVerse);
            setNewVerse("");
          }}
        >
          + Uložiť
        </Button>
      </div>
    </div>
  );
};

export default Verses;
