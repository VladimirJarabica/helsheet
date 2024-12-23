"use client";
import { getSheetUrl } from "../../utils/sheet";
import SheetSettings, { FormData } from "../components/SheetSettings";
import { createSheet } from "./actions";

const NewSheet = () => {
  const onSubmit = async (data: FormData) => {
    console.log("data", data);
    const newSheet = await createSheet({
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
      <SheetSettings onSubmit={onSubmit} />
    </div>
  );
};

export default NewSheet;
