import { Tag as TagType } from "@prisma/client";

interface TagPillProps {
  tag: Pick<TagType, "id" | "name">;
}

const TagPill = ({ tag }: TagPillProps) => {
  return (
    <div className="text-xs h-fit rounded py-1 px-2 bg-hel-bgButton text-hel-fgButton">
      {tag.name}
    </div>
  );
};

export default TagPill;
