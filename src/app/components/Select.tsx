import { ChevronDownIcon } from "@heroicons/react/24/outline";

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

const Select = ({ options, label, ...props }: SelectProps) => {
  return (
    <div className="mt-3 flex flex-col relative">
      {label && (
        <label className="text-sm/6 mb-1" htmlFor={props.name}>
          {label}
        </label>
      )}
      <select
        {...props}
        className={`block w-full appearance-none rounded-md bg-white px-3 py-1.5 pr-7 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${props.className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-4 absolute bottom-2 right-2 pointer-events-none" />
    </div>
  );
};

export default Select;
