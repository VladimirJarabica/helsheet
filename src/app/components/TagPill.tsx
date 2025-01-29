import { XMarkIcon } from "@heroicons/react/24/solid";

interface TagPillProps {
  children: React.ReactNode;
  onRemove?: () => void;
}

const TagPill = ({ children, onRemove }: TagPillProps) => {
  return (
    <div
      className="inline-flex text-nowrap items-center rounded-md
    px-2 py-1 text-xs font-medium
    ring-1 ring-stone-800/10 ring-inset
    text-stone-800
    bg-stone-100
    "
    >
      {children}
      {onRemove && (
        <button className="w-4" onClick={() => onRemove()}>
          <XMarkIcon />
        </button>
      )}
    </div>
  );
};

export default TagPill;
