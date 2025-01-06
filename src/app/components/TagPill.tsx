import { Tag as TagType } from "@prisma/client";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface TagPillProps {
  tag: Pick<TagType, "id" | "name">;
  onRemove?: () => void;
}

const TagPill = ({ tag, onRemove }: TagPillProps) => {
  return (
    <div className="text-xs h-fit flex gap-2 rounded py-1 px-2 bg-hel-bgButton text-hel-fgButton">
      {tag.name}
      {onRemove && (
        <button className="w-4" onClick={() => onRemove()}>
          <XMarkIcon />
        </button>
      )}
    </div>
  );
};

export default TagPill;
