"use client";
import {
  Country,
  Genre,
  Scale,
  Sheet,
  SongAuthorType,
  Tuning,
  TimeSignature,
} from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  AUTHOR_TYPE_VALUE,
  COUNTRY_VALUE,
  GENRE_VALUE,
  TIME_SIGNATURE_VALUE,
} from "../../../utils/consts";
import Button from "../Button";
import Select from "../Select";
import { Scales } from "../../../utils/scale";

export type FormData = {
  name: string;
  description?: string;
  tuning: Tuning;
  scale: Scale | null;
  timeSignature: TimeSignature;
  tempo?: number;
  genre?: Genre;
  country?: Country;
  source: string | null;
  sourceUrl: string | null;
  songAuthorType: SongAuthorType;
  songAuthor?: string;
  originalSheetAuthor?: string;
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
    | "timeSignature"
    | "tempo"
    | "genre"
    | "country"
    | "songAuthorType"
    | "songAuthor"
    | "originalSheetAuthor"
    | "source"
  >;
}

const SheetSettings = ({
  onSubmit,
  sheet: existingSheet,
  onDelete,
}: SheetSettingsProps) => {
  const { register, getValues, watch } = useForm<FormData>({
    defaultValues: {
      name: existingSheet?.name ?? "",
      description: existingSheet?.description ?? undefined,
      tuning: existingSheet?.tuning ?? Tuning.CF,
      scale: existingSheet?.scale ?? null,
      timeSignature: existingSheet?.timeSignature ?? TimeSignature.sig_4_4,
      tempo: existingSheet?.tempo ?? undefined,
      genre: existingSheet?.genre ?? undefined,
      country: existingSheet?.country ?? undefined,
      songAuthorType: existingSheet?.songAuthorType ?? SongAuthorType.folk_song,
      songAuthor: existingSheet?.songAuthor ?? "",
      originalSheetAuthor: existingSheet?.originalSheetAuthor ?? "",
      source: existingSheet?.source ?? "",
    },
  });

  const songAuthorType = watch("songAuthorType");

  return (
    <form className="flex flex-col w-full">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="mt-3 flex flex-col">
          <div className="text-xl mb-2 text-center">Nový zápis</div>
          <label className="text-sm/6 mb-1" htmlFor="name">
            Názov piesne
          </label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
            defaultValue=""
            placeholder="Meno piesne"
            {...register("name", { required: true })}
          />
        </div>
        <div className="mt-3 flex flex-col">
          <label className="text-sm/6 mb-1" htmlFor="name">
            Popis
          </label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
            defaultValue=""
            placeholder="Popis"
            {...register("description")}
          />
        </div>
        <Select
          {...register("tuning")}
          label="Ladenie"
          className="mt-3"
          options={Object.keys(Tuning).map((tuning) => ({
            value: tuning,
            label: tuning,
          }))}
        />
        <Select
          {...register("scale")}
          label="Stupnica"
          className="mt-3"
          options={[
            { value: "", label: "-" },
            ...Scales.map((scale) => ({
              value: scale.id,
              label: `${scale.name}${
                scale.signature ? ` (${scale.signature})` : ""
              }`,
            })),
          ]}
        />
        <Select
          {...register("timeSignature", { required: true })}
          label="Takt"
          className="mt-3"
          options={Object.keys(TimeSignature)
            .toSorted()
            .map((timeSignature) => ({
              value: timeSignature,
              label: TIME_SIGNATURE_VALUE[timeSignature as TimeSignature],
            }))}
        />
        <div className="mt-3 flex flex-col">
          <label className="text-sm/6 mb-1" htmlFor="name">
            Tempo
          </label>
          <div className="relative">
            <div className="flex gap-1 absolute bottom-1 left-3">
              <Image
                src={`/quarter-note.png`}
                className=" h-[15px] w-[auto] mt-0.5"
                width={20}
                height={20}
                alt="note"
              />
              =
            </div>
            <input
              className="pl-8 block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
              defaultValue=""
              type="number"
              placeholder="160 / 120 / ..."
              {...register("tempo", { setValueAs: (value) => parseInt(value) })}
            />
          </div>
        </div>
        <Select
          {...register("genre")}
          label="Žáner"
          className="mt-3"
          options={[
            { value: "", label: "-" },
            ...Object.keys(Genre).map((genre) => ({
              value: genre,
              label: GENRE_VALUE[genre as Genre],
            })),
          ]}
        />
        <Select
          {...register("country")}
          label="Krajina"
          className="mt-3"
          options={[
            { value: "", label: "-" },
            ...Object.keys(Country).map((country) => ({
              value: country,
              label: COUNTRY_VALUE[country as Country],
            })),
          ]}
        />
        <Select
          {...register("songAuthorType")}
          label="Autorstvo"
          className="mt-3"
          options={Object.keys(SongAuthorType).map((songAuthorType) => ({
            value: songAuthorType,
            label: AUTHOR_TYPE_VALUE[songAuthorType as SongAuthorType],
          }))}
        />
        {songAuthorType === SongAuthorType.original_song && (
          <div className="mt-3 flex flex-col">
            <label className="text-sm/6 mb-1" htmlFor="songAuthor">
              Autor piesne
            </label>
            <input
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
              defaultValue=""
              placeholder="spevák, kapela, skladateľ (viac autorov oddeliť čiarkou)"
              {...register("songAuthor")}
            />
          </div>
        )}
        <div className="mt-3 flex flex-col">
          <label className="text-sm/6 mb-1" htmlFor="originalSheetAuthor">
            Autor zápisu (ak ním nie si ty)
          </label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
            defaultValue=""
            {...register("originalSheetAuthor")}
          />
        </div>
        <div className="mt-3 flex flex-col">
          <label className="text-sm/6 mb-1" htmlFor="source">
            Zdroj
          </label>
          <input
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-hel-textPrimary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary sm:text-sm/6"
            defaultValue=""
            placeholder="Napríklad pesnicky.orava.sk / harmonika.cz"
            {...register("source")}
          />
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex flex-row justify-end sm:px-6 gap-4">
        <Button
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            const values = getValues();
            onSubmit({
              ...values,
              description: values.description ? values.description : undefined,
              tempo: values.tempo ? values.tempo : undefined,
              genre: values.genre ? values.genre : undefined,
              country: values.country ? values.country : undefined,
              songAuthor: values.songAuthor ? values.songAuthor : undefined,
              originalSheetAuthor: values.originalSheetAuthor
                ? values.originalSheetAuthor
                : undefined,
            });
          }}
        >
          Uložiť
        </Button>
        {onDelete && (
          <Button
            variant="danger"
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
  );
};

export default SheetSettings;
