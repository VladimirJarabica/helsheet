import { useState } from "react";
import { useSongContext } from "./songContext";
import Button from "../Button";

interface VariantsProps {
  onSelect: (variantId: number) => void;
}

const Variants = ({ onSelect }: VariantsProps) => {
  const { song, addVariant } = useSongContext();
  const variants = song.variants ?? [];

  console.log("barGroups", variants);

  const [newGroupName, setNewGroupName] = useState("");

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {variants.length > 0 && (
          <>
            Existujúce varianty:
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex justify-between items-center"
              >
                {variant.name}
                <Button onClick={() => onSelect(variant.id)}>Použiť</Button>
              </div>
            ))}
          </>
        )}
        <input
          className="bg-transparent outline-none"
          type="text"
          placeholder="Nový variant"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button
          onClick={() => {
            addVariant(newGroupName);
            setNewGroupName("");
          }}
        >
          Pridať
        </Button>
      </div>
    </div>
  );
};

export default Variants;
