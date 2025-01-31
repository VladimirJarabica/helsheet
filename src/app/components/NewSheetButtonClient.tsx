"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Sheet, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSheetUrl } from "../../utils/sheet";
import Button from "./Button";
import ModalWrapper from "./editor/ModalWrapper";
import SheetSettings, { FormData } from "./editor/SheetSettings";

interface NewSheetButtonClientProps {
  user: Pick<User, "id" | "nickname"> | null;
  createSheet: (
    user: Pick<User, "id" | "nickname">,
    data: FormData
  ) => Promise<Pick<Sheet, "id" | "name">>;
  size?: React.ComponentProps<typeof Button>["size"];
}

const NewSheetButtonClient = ({
  user,
  createSheet,
  size,
}: NewSheetButtonClientProps) => {
  const router = useRouter();
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsNewSheetOpen(true)}
        variant="secondary"
        size={size}
        icon={<PlusIcon className="w-5" />}
        smOnlyIcon
      >
        Nový zápis
      </Button>
      {isNewSheetOpen && user && (
        <ModalWrapper close={() => setIsNewSheetOpen(false)}>
          <SheetSettings
            onSubmit={async (data) => {
              const sheet = await createSheet(user, data);
              router.push(getSheetUrl(sheet));
              setIsNewSheetOpen(false);
            }}
            nickname={user?.nickname}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default NewSheetButtonClient;
