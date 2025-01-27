import { useState } from "react";
import { useSheetContext } from "./sheetContext";
import Button from "../Button";

interface VariantsProps {
  onSelect: (variantId: number) => void;
}

const Variants = ({ onSelect }: VariantsProps) => {
  const { song, addVariant } = useSheetContext();
  const variants = song.variants ?? [];

  const [newGroupName, setNewGroupName] = useState("");

  return (
    <div className="px-4 pt-5 pb-4 ">
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
                <Button
                  variant="secondary"
                  onClick={() => onSelect(variant.id)}
                >
                  Použiť
                </Button>
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
          variant="secondary"
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
