import { equals } from "ramda";
import { useEffect, useMemo, useState } from "react";
import { SongContent } from "../../types";
import { saveSheetContent } from "../actions";

export type SaveStatus = "saved" | "saving" | "unsaved";
export const useSaveContent = ({
  canSave,
  sheetId,
  initialSong,
  currentSong,
}: {
  canSave: boolean;
  sheetId: number;
  initialSong: SongContent;
  currentSong: SongContent;
}) => {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const isEdited = useMemo(
    () => !equals(initialSong, currentSong),
    [initialSong, currentSong]
  );
  const [unsavedChanges, setUnsavedChanges] = useState(0);

  useEffect(() => {
    if (isEdited) {
      setUnsavedChanges((prev) => prev + 1);
    } else {
      setUnsavedChanges(0);
    }
  }, [isEdited, currentSong]);

  const save = async () => {
    if (canSave) {
      setStatus("saving");
      setUnsavedChanges(0);
      await saveSheetContent({ sheetId, content: currentSong });
      setStatus("saved");
    }
  };

  useEffect(() => {
    if (isEdited && unsavedChanges > 0) {
      setStatus("unsaved");
      if (unsavedChanges > 10) {
        // If more than 10 changes happened, save right away
        save();
      } else {
        // Otherwise wait X seconds after the last change
        const timeout = setTimeout(() => {
          save();
        }, 1500);

        return () => clearTimeout(timeout);
      }
    } else {
      setStatus("saved");
    }
  }, [isEdited, unsavedChanges]);

  return { save, status };
};
