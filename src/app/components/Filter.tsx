import { HeartIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import Select from "./Select";
import { Country } from "@prisma/client";
import { COUNTRY_VALUE } from "../../utils/consts";

const Filter = () => {
  return (
    <div className="pt-5 flex items-end gap-1 flex-wrap">
      <Button variant="secondary" className="flex gap-1">
        <HeartIcon className="w-4" /> Obľúbené
      </Button>
      <Select
        label="Krajina"
        options={[
          { value: "", label: "-" },
          ...Object.keys(Country).map((country) => ({
            value: country,
            label: COUNTRY_VALUE[country as Country],
          })),
        ]}
      />
    </div>
  );
};

export default Filter;
