"use client";
import { User } from "@prisma/client";
import { getSheetUrl } from "../../utils/sheet";
import SheetSettings, { FormData } from "../components/SheetSettings";
import { createSheet } from "./actions";

interface NewSheetProps {
  user: Pick<User, "id" | "nickname">;
}

const NewSheet = ({ user }: NewSheetProps) => {
  const onSubmit = async (data: FormData) => {
    console.log("data", data);
    const newSheet = await createSheet(user, {
      ...data,
      content: {
        timeSignature: data.timeSignature,
        bars: [],
      },
    });
    window.location.href = getSheetUrl(newSheet);
  };

  return (
    <div>
      <SheetSettings onSubmit={onSubmit} nickname={user?.nickname} />
    </div>
  );
};

export default NewSheet;
