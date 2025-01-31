import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  resetValue?: () => void;
  inlineLabel?: boolean;
}

const Select = ({
  options,
  resetValue,
  label,
  className,
  inlineLabel = false,
  ...props
}: SelectProps) => {
  const clearable = resetValue && props.value !== "";

  return (
    <div className={`flex flex-col relative ${className}`}>
      {label && !inlineLabel && (
        <label className="text-sm/6 mb-1" htmlFor={props.name}>
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          block w-full appearance-none rounded-md bg-white
          px-3 py-1.5
          ${clearable ? "pr-10" : "pr-5"}
          text-base outline 
          ${props.value === "" ? "text-hel-textSubtle" : "text-hel-textPrimary"}
          sm:text-sm/6
          outline-1 -outline-offset-1 outline-gray-300 
          placeholder:text-hel-textSubtle focus:outline-2 focus:-outline-offset-2 focus:outline-hel-buttonPrimary
     
          `}
      >
        <option value="" selected disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-4 absolute bottom-2.5 right-2 pointer-events-none" />
      {clearable && (
        <XMarkIcon
          className="w-4 absolute bottom-2.5 right-6 cursor-pointer"
          onClick={() => resetValue()}
        />
      )}
    </div>
  );
};

export default Select;
