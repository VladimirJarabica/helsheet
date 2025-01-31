import { LockClosedIcon } from "@heroicons/react/24/outline";
import {
  Genre,
  Sheet,
  SheetAccess,
  SongAuthorType,
  User,
} from "@prisma/client";
import Link from "next/link";
import {
  AUTHOR_TYPE_VALUE,
  COUNTRY_VALUE,
  GENRE_VALUE,
  TIME_SIGNATURE_VALUE,
} from "../../utils/consts";
import { formatScaleId } from "../../utils/scale";
import { getSheetUrl } from "../../utils/sheet";
import TagPill from "./TagPill";

interface SheetPreviewProps {
  sheet: Pick<
    Sheet,
    | "id"
    | "name"
    | "songAuthorType"
    | "songAuthor"
    | "country"
    | "genre"
    | "tuning"
    | "timeSignature"
    | "scale"
    | "access"
  > & { SheetAuthor?: Pick<User, "id" | "nickname"> };
  showPrivate?: boolean;
}

const SheetPreview = ({ sheet, showPrivate = false }: SheetPreviewProps) => {
  return (
    <Link
      key={sheet.id}
      href={getSheetUrl(sheet)}
      className="hover:shadow-md transition-shadow rounded-sm p-2 border border-zinc-200 flex flex-col"
    >
      <div className="flex justify-between gap-2">
        <span className="font-bold flex gap-1">
          {sheet.name}
          {showPrivate && sheet.access === SheetAccess.private && (
            <LockClosedIcon className="w-4 mr-1" />
          )}
        </span>

        {sheet.SheetAuthor && (
          <Link
            href={`/user/${sheet.SheetAuthor.id}`}
            className="text-sm text-hel-textSubtle underline"
          >
            zapísal ({sheet.SheetAuthor.nickname})
          </Link>
        )}
      </div>
      <div className="flex mt-1 gap-1 flex-wrap">
        {sheet.scale && <TagPill>{formatScaleId(sheet.scale)}</TagPill>}
        <TagPill>{sheet.tuning}</TagPill>
        <TagPill>{TIME_SIGNATURE_VALUE[sheet.timeSignature]}</TagPill>
        {sheet.country && <TagPill>{COUNTRY_VALUE[sheet.country]}</TagPill>}
        {sheet.songAuthorType && (
          <TagPill>
            {sheet.songAuthorType && sheet.songAuthor
              ? sheet.songAuthor
              : AUTHOR_TYPE_VALUE[sheet.songAuthorType]}
          </TagPill>
        )}
        {sheet.genre &&
          // Do not show two "folk music" tags
          (sheet.genre !== Genre.folk_music ||
            sheet.songAuthorType !== SongAuthorType.folk_song) && (
            <TagPill>{GENRE_VALUE[sheet.genre]}</TagPill>
          )}
      </div>
    </Link>
  );
};

export default SheetPreview;
