"use client";
import {
  Country,
  Genre,
  Scale,
  Sheet,
  SongAuthorType,
  Tuning,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { TimeSignature } from "../../types";
import Button from "../Button";

const AUTHOR_TYPE_VALUE: Record<SongAuthorType, string> = {
  [SongAuthorType.folk_song]: "Ľudová pieseň",
  [SongAuthorType.original_song]: "Autorská pieseň",
};

const GENRE_VALUE: Record<Genre, string> = {
  [Genre.country]: "Country",
  [Genre.folk_music]: "Ľudová pieseň",
  [Genre.sea_shanty]: "Sea shanty",
};

const COUNTRY_VALUE: Record<Country, string> = {
  [Country.slovakia]: "Slovensko",
  [Country.czech_republic]: "Česká republika",
  [Country.poland]: "Poľsko",
  [Country.hungary]: "Maďarsko",
  [Country.austria]: "Rakúsko",
  [Country.ireland]: "Írsko",
  [Country.scotland]: "Škótsko",
  [Country.england]: "Anglicko",
  [Country.france]: "Francúzsko",
};

export type FormData = {
  name: string;
  description?: string;
  author: string;
  tuning: Tuning;
  scale: Scale | null;
  timeSignature: TimeSignature;
  tempo?: number;
  genre?: Genre;
  country?: Country;
  sourceText: string | null;
  sourceUrl: string | null;
  songAuthorType: SongAuthorType;
  songAuthor?: string;
  noteSheetAuthor?: string;
};

interface SheetSettingsProps {
  nickname?: string | null;
  onSubmit: (data: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  sheet?: Pick<
    Sheet,
    | "id"
    | "name"
    | "description"
    | "tuning"
    | "scale"
    | "sourceText"
    | "sourceUrl"
  >;
  timeSignature?: TimeSignature;
}

const SheetSettings = ({
  onSubmit,
  nickname,
  sheet: existingSheet,
  timeSignature,
  onDelete,
}: SheetSettingsProps) => {
  const { register, getValues, watch } = useForm<FormData>({
    defaultValues: {
      name: existingSheet?.name ?? "",
      description: existingSheet?.description ?? undefined,
      author: nickname ?? "",
      tuning: existingSheet?.tuning ?? Tuning.CF,
      scale: existingSheet?.scale ?? null,
      timeSignature: timeSignature,
      sourceText: existingSheet?.sourceText ?? "",
      sourceUrl: existingSheet?.sourceUrl ?? "",
    },
  });

  const songAuthorType = watch("songAuthorType");

  return (
    <div>
      <form className="flex flex-col w-80">
        <div className="my-1 flex flex-col">
          <label htmlFor="name">Názov piesne</label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue=""
            placeholder="Meno piesne"
            {...register("name", { required: true })}
          />
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="name">Popis</label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue=""
            placeholder="Popis"
            {...register("description")}
          />
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="tuning">Ladenie</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("tuning", { required: true })}
          >
            {Object.keys(Tuning).map((tuning) => (
              <option key={tuning} value={tuning}>
                {tuning}
              </option>
            ))}
          </select>
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="scale">Stupnica</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("scale", {
              required: false,
              setValueAs: (val) => (val === "" ? null : val),
            })}
          >
            <option value={""}>Žiadna</option>
            {Object.keys(Scale).map((scale) => (
              <option key={scale} value={scale}>
                {scale.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="timeSignature">Takt</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("timeSignature", { required: true })}
          >
            <option value="4/4">4/4</option>
            <option value="2/4">2/4</option>
            <option value="3/4">3/4</option>
          </select>
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="name">Tempo</label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue=""
            type="number"
            {...register("tempo")}
          />
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="genre">Žáner</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("genre")}
          >
            <option value={""}>Žiadny</option>
            {Object.keys(Genre).map((genre) => (
              <option key={genre} value={genre}>
                {GENRE_VALUE[genre as Genre]}
              </option>
            ))}
          </select>
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="country">Krajina</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("country")}
          >
            <option value={""}>Žiadna</option>
            {Object.keys(Country).map((country) => (
              <option key={country} value={country}>
                {COUNTRY_VALUE[country as Country]}
              </option>
            ))}
          </select>
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="songAuthorType">Autorstvo</label>
          <select
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("songAuthorType", { required: true })}
          >
            {Object.keys(SongAuthorType).map((songAuthorType) => (
              <option key={songAuthorType} value={songAuthorType}>
                {AUTHOR_TYPE_VALUE[songAuthorType as SongAuthorType]}
              </option>
            ))}
          </select>
        </div>
        {songAuthorType === SongAuthorType.original_song && (
          <div className="my-1 flex flex-col">
            <label htmlFor="songAuthor">Autor piesne</label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue=""
              {...register("songAuthor")}
            />
          </div>
        )}
        <div className="my-1 flex flex-col">
          <label htmlFor="noteSheetAuthor">Autor notového zápisu</label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue=""
            {...register("noteSheetAuthor")}
          />
        </div>
        <div className="my-1 flex flex-col">
          <label htmlFor="sourceText">Zdroj</label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue=""
            placeholder="Zdroj"
            {...register("sourceText")}
          />
        </div>
        <div className="flex justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              const values = getValues();
              onSubmit({
                ...values,
                description: values.description
                  ? values.description
                  : undefined,
                tempo: values.tempo ? values.tempo : undefined,
                genre: values.genre ? values.genre : undefined,
                country: values.country ? values.country : undefined,
                songAuthor: values.songAuthor ? values.songAuthor : undefined,
                noteSheetAuthor: values.noteSheetAuthor
                  ? values.noteSheetAuthor
                  : undefined,
              });
            }}
          >
            Uložiť
          </Button>
          {onDelete && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              Vymazať
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SheetSettings;
