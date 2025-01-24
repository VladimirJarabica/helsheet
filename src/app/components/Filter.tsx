"use client";
import { Country, Genre, SongAuthorType, Tuning } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COUNTRY_VALUE, GENRE_VALUE } from "../../utils/consts";
import { FilterKey, FilterValue, parseFilter } from "../../utils/filter";
import Select from "./Select";

interface FilterProps {
  songAuthors: string[];
}

const Filter = ({ songAuthors }: FilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("router", { router, pathname, searchParams });

  const filter = parseFilter({
    country: searchParams.get("country") ?? "",
    genre: searchParams.get("genre") ?? "",
    tuning: searchParams.get("tuning") ?? "",
    songAuthor: searchParams.get("songAuthor") ?? "",
  });

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
    <div className="pt-5 flex flex-col sm:flex-row sm:items-end gap-1 justify-between">
      {/* <Button variant="secondary" className="flex gap-1">
        <HeartIcon className="w-4" /> Obľúbené
      </Button> */}
      <Select
        label="Krajina"
        value={filter.country ?? ""}
        onChange={(e) => setFilter("country", e.target.value as Country)}
        options={[
          { value: "", label: "-" },
          ...Object.keys(Country).map((country) => ({
            value: country,
            label: COUNTRY_VALUE[country as Country],
          })),
        ]}
      />
      <Select
        label="Žáner"
        value={filter.genre ?? ""}
        onChange={(e) => setFilter("genre", e.target.value as Genre)}
        options={[
          { value: "", label: "-" },
          ...Object.keys(GENRE_VALUE).map((genre) => ({
            value: genre,
            label: GENRE_VALUE[genre as Genre],
          })),
        ]}
      />
      <Select
        label="Ladenie heligónky"
        value={filter.country ?? ""}
        onChange={(e) => setFilter("tuning", e.target.value as Tuning)}
        options={[
          { value: "", label: "-" },
          ...Object.keys(Tuning).map((tuning) => ({
            value: tuning,
            label: tuning,
          })),
        ]}
      />
      <Select
        label="Autor"
        value={filter.songAuthor ?? ""}
        onChange={(e) => setFilter("songAuthor", e.target.value)}
        options={[
          { value: "", label: "-" },
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
