import { useEffect, useState } from "react";

type Option<Value extends string> = {
  label: string;
  value: Value;
};

interface ToggleButtonProps<Value extends string> {
  options: Option<Value>[];
  value: Value;
  onChange: (value: Value) => Promise<void> | void;
  floating?: boolean;
}

const ToggleButton = <Value extends string>({
  options,
  value,
  onChange,
  floating = false,
}: ToggleButtonProps<Value>) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div
      className={`inline-flex rounded-md text-sm ring-1 ring-gray-300 ring-inset p-[1px] h-8
        ${floating ? "shadow-md shadow-gray-200" : ""}
        `}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => {
            const res = onChange(option.value);
            if (res instanceof Promise) {
              setCurrentValue(option.value);
            }
          }}
          className={`flex-1 text-sm text-nowrap
            ${index === 0 ? "rounded-l-md mr-0" : ""}
            ${index === options.length - 1 ? "rounded-r-md ml-0" : ""}
            px-3 py-1.5 h-full
            ${
              currentValue === option.value
                ? "bg-hel-buttonPrimary hover:bg-hel-buttonPrimaryHover text-hel-buttonPrimaryColor"
                : "bg-gray-100 hover:bg-gray-50"
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
