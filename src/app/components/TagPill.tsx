import { XMarkIcon } from "@heroicons/react/24/solid";

interface TagPillProps {
  children: React.ReactNode;
  onRemove?: () => void;
}

const TagPill = ({ children, onRemove }: TagPillProps) => {
  return (
    <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
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
