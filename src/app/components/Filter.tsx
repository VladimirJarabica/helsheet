import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const Filter = () => {
  return (
    <div className="pt-5">
      <button className="text-sm flex items-center border p-2 rounded">
        <HeartIconSolid className="w-4 mr-1" /> Obľúbené
      </button>
    </div>
  );
};

export default Filter;
