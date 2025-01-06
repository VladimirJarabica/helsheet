"use client";
import { Sheet, Tuning } from "@prisma/client";
import { useForm } from "react-hook-form";
import { TimeSignature } from "../../types";
import Button from "../Button";

export type FormData = {
  name: string;
  author: string;
  tuning: Tuning;
  timeSignature: TimeSignature;
  sourceText: string | null;
  sourceUrl: string | null;
};

interface SheetSettingsProps {
  nickname?: string | null;
  onSubmit: (data: FormData) => Promise<void>;
  sheet?: Pick<Sheet, "id" | "name" | "tuning" | "sourceText" | "sourceUrl">;
  timeSignature?: TimeSignature;
}

const SheetSettings = ({
  onSubmit,
  nickname,
  sheet: existingSheet,
  timeSignature,
}: SheetSettingsProps) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: existingSheet?.name ?? "",
      author: nickname ?? "",
      tuning: existingSheet?.tuning ?? Tuning.CF,
      timeSignature: timeSignature,
      sourceText: existingSheet?.sourceText ?? "",
      sourceUrl: existingSheet?.sourceUrl ?? "",
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-80">
        <div className="my-4 flex flex-col">
          <label htmlFor="name">Názov piesne</label>
          <input
            className="border-b"
            defaultValue=""
            placeholder="Meno piesne"
            {...register("name", { required: true })}
          />
        </div>
        <div className="my-4 flex flex-col">
          <label htmlFor="author">Autor</label>
          <input
            className="border-b"
            defaultValue=""
            placeholder="Autor"
            {...register("author")}
          />
        </div>
        <div className="my-4 flex flex-col">
          <label htmlFor="tuning">Ladenie</label>
          <select
            className="border-b"
            {...register("tuning", { required: true })}
          >
            {Object.keys(Tuning).map((tuning) => (
              <option key={tuning} value={tuning}>
                {tuning}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4 flex flex-col">
          <label htmlFor="timeSignature">Takt</label>
          <select
            className="border-b"
            {...register("timeSignature", { required: true })}
          >
            <option value="4/4">4/4</option>
            <option value="2/4">2/4</option>
            <option value="3/4">3/4</option>
          </select>
        </div>
        <div className="my-4 flex flex-col">
          <label htmlFor="author">Zdroj</label>
          <input
            className="border-b"
            defaultValue=""
            placeholder="Zdroj"
            {...register("sourceText")}
          />
        </div>
        <Button onClick={handleSubmit(onSubmit)}>Uložiť</Button>
      </form>
    </div>
  );
};

export default SheetSettings;
