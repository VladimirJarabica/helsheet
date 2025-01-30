import { useState } from "react";

type Option<Value extends string> = {
  label: string;
  value: Value;
};

interface ToggleButtonProps<Value extends string> {
  options: Option<Value>[];
  value: Value;
  onChange: (value: Value) => Promise<void>;
}

const ToggleButton = <Value extends string>({
  options,
  value,
  onChange,
}: ToggleButtonProps<Value>) => {
  const [currentValue, setCurrentValue] = useState(value);

  return (
    <button
      className="inline-flex rounded-md text-sm ring-1 ring-gray-300 ring-inset p-[1px] h-8"
      onClick={() => {
        const newValue = options.find(
          (option) => option.value !== currentValue
        );
        if (newValue) {
          setCurrentValue(newValue.value);
          onChange(newValue.value);
        }
      }}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          className={`flex-1 text-sm
            ${index === 0 ? "rounded-l-md mr-0" : "rounded-r-md ml-0"}
            px-3 py-1.5 h-full
            ${
              currentValue === option.value
                ? "bg-indigo-500 text-white"
                : "bg-gray-100"
            }`}
        >
          {option.label}
        </button>
      ))}
    </button>
  );
};

export default ToggleButton;
