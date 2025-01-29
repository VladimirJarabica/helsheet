"use client";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../../components/Button";

interface EditableNameProps {
  name: string;
  setName?: (name: string) => Promise<void>;
}

const EditableName = ({ name, setName }: EditableNameProps) => {
  const [status, setStatus] = useState<"idle" | "editing" | "saving">("idle");
  const [newName, setNewName] = useState(name);

  const save = async () => {
    if (name === newName) {
      setStatus("idle");
      return;
    }
    if (!setName) {
      return;
    }
    setStatus("saving");
    await setName(newName);
    setStatus("idle");
  };

  return (
    <div className="flex gap-4 items-center">
      {status === "idle" ? (
        <h1 className="text-4xl font-semibold border-b-2 border-transparent">
          {newName}
        </h1>
      ) : (
        <input
          className="text-4xl font-semibold outline-none border-b-2"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            console.log("e.key", e.key);
            switch (e.key) {
              case "Enter":
                save();
                break;
              case "Escape":
                setStatus("idle");
                setNewName(name);
                break;
            }
          }}
          autoFocus
        />
      )}
      {setName && (
        <Button
          variant="secondary"
          onClick={async () => {
            if (status === "saving") {
              return;
            }
            if (status === "idle") {
              setStatus("editing");
              return;
            }
            save();
          }}
        >
          {status === "idle" ? (
            <PencilIcon className="w-4 bottom-2 right-2 pointer-events-none" />
          ) : (
            <CheckIcon className="w-4 bottom-2 right-2 pointer-events-none" />
          )}
        </Button>
      )}
    </div>
  );
};

export default EditableName;
