"use client";

import { Sheet, User } from "@prisma/client";
import { useState } from "react";
import Button from "./Button";
import ModalWrapper from "./editor/ModalWrapper";
import SheetSettings, { FormData } from "./editor/SheetSettings";

interface NewSheetButtonClientProps {
  user: Pick<User, "id" | "nickname"> | null;
  createSheet: (
    user: Pick<User, "id" | "nickname">,
    data: FormData
  ) => Promise<Pick<Sheet, "id">>;
}

const NewSheetButtonClient = ({
  user,
  createSheet,
}: NewSheetButtonClientProps) => {
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsNewSheetOpen(true)}>Nový zápis</Button>
      {isNewSheetOpen && user && (
        <ModalWrapper close={() => setIsNewSheetOpen(false)}>
          <SheetSettings
            onSubmit={(data) => createSheet(user, data)}
            nickname={user?.nickname}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default NewSheetButtonClient;
