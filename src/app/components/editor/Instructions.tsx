import { useState } from "react";
import { useSheetContext } from "./sheetContext";
import Button from "../Button";
import { MUSIC_INSTRUCTIONS } from "../../../utils/consts";

interface InstructionsProps {
  onSelect: (instructionId: string) => void;
}

const Instructions = ({ onSelect }: InstructionsProps) => {
  const { song, addInstruction } = useSheetContext();
  const musicInstructions = [
    ...MUSIC_INSTRUCTIONS,
    ...(song.instructions ?? []),
  ];

  const [newInstructionName, setNewInstructionName] = useState("");

  return (
    <div className="px-4 pt-5 pb-4 ">
      <div className="flex flex-col gap-2">
        {musicInstructions.length > 0 && (
          <>
            <span className="text-lg font-semibold">Inštrukcie:</span>
            {musicInstructions.map((instruction) => (
              <div
                key={instruction.id}
                className="flex justify-between items-center"
              >
                {instruction.name}
                <Button
                  variant="secondary"
                  onClick={() => onSelect(instruction.id)}
                >
                  Použiť
                </Button>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-between items-center">
          <input
            className="bg-transparent outline-none"
            type="text"
            placeholder="Nová inštrukcia"
            value={newInstructionName}
            onChange={(e) => setNewInstructionName(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              const newInstruction = addInstruction(newInstructionName);
              onSelect(newInstruction.id);
              setNewInstructionName("");
            }}
          >
            Pridať
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
