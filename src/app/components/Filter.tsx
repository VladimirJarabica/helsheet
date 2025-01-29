"use client";
import { Country, Genre, Scale, SongAuthorType, Tuning } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COUNTRY_VALUE, GENRE_VALUE } from "../../utils/consts";
import { FilterKey, FilterValue } from "../../utils/filter";
import { formatScaleId } from "../../utils/scale";
import Select from "./Select";

interface FilterProps {
  songAuthors: string[];
  filter: FilterValue;
}

const Filter = ({ songAuthors, filter }: FilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log("filter", filter);

  const setFilter = (key: FilterKey, value: FilterValue[FilterKey]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    if (value) {
      newSearchParams.set(key, value);
    }
    router.push(`${pathname}?${newSearchParams}`);
  };

  return (
    <div className="pt-5 flex flex-col flex-wrap sm:flex-row sm:items-start gap-y-1 justify-start">
      <Select
        label="Krajina"
        value={filter.country ?? ""}
        className="w-full sm:w-1/4 sm:px-0.5"
        inlineLabel
        onChange={(e) => setFilter("country", e.target.value as Country)}
        resetValue={() => setFilter("country", undefined)}
        options={[
          // { value: "", label: "Krajina" },
          ...Object.keys(Country).map((country) => ({
            value: country,
            label: COUNTRY_VALUE[country as Country],
          })),
        ]}
      />
      <Select
        label="Žáner"
        value={filter.genre ?? ""}
        className="w-full sm:w-1/4 sm:px-0.5"
        inlineLabel
        onChange={(e) => setFilter("genre", e.target.value as Genre)}
        resetValue={() => setFilter("genre", undefined)}
        options={[
          ...Object.keys(GENRE_VALUE).map((genre) => ({
            value: genre,
            label: GENRE_VALUE[genre as Genre],
          })),
        ]}
      />
      <Select
        label="Ladenie heligónky"
        value={filter.tuning ?? ""}
        className="w-full sm:w-1/4 sm:px-0.5"
        inlineLabel
        onChange={(e) => setFilter("tuning", e.target.value as Tuning)}
        resetValue={() => setFilter("tuning", undefined)}
        options={[
          ...Object.keys(Tuning).map((tuning) => ({
            value: tuning,
            label: tuning,
          })),
        ]}
      />
      <Select
        label="Stupnica"
        value={filter.scale ?? ""}
        className="w-full sm:w-1/4 sm:px-0.5"
        inlineLabel
        onChange={(e) => setFilter("scale", e.target.value as Tuning)}
        resetValue={() => setFilter("scale", undefined)}
        options={[
          ...Object.keys(Scale).map((scale) => ({
            value: scale,
            label: formatScaleId(scale as Scale),
          })),
        ]}
      />
      <Select
        label="Autor"
        value={filter.songAuthor ?? ""}
        className="w-full sm:w-1/4 sm:px-0.5"
        inlineLabel
        onChange={(e) => setFilter("songAuthor", e.target.value)}
        resetValue={() => setFilter("songAuthor", undefined)}
        options={[
          { value: SongAuthorType.folk_song, label: "Ludová pieseň" },
          ...songAuthors.map((author) => ({
            value: author,
            label: author,
          })),
        ]}
      />
    </div>
  );
};

export default Filter;
