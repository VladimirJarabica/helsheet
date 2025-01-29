import { currentUser } from "@clerk/nextjs/server";
import { SheetAccess } from "@prisma/client";
import { Metadata } from "next";
import { dbClient } from "../../../services/db";
import {
  getSheetIdFromParam,
  getSheetNameFromSlug,
} from "../../../utils/sheet";
import { getOrCreateUser } from "../../../utils/user";
import Editor from "../../components/editor/Editor";

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;

  const title = getSheetNameFromSlug(slug);

  return title ? { title } : {};
}

const Sheet = async (props: PageProps) => {
  const { slug } = await props.params;
  const sheetId = getSheetIdFromParam(slug);

  if (!sheetId) {
    return <div>not found</div>;
  }

  const authUser = await currentUser();

  const sheet = await dbClient.sheet.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      tuning: true,
      scale: true,
      timeSignature: true,
      content: true,
      version: true,
      tempo: true,
      genre: true,
      country: true,
      songAuthorType: true,
      songAuthor: true,
      originalSheetAuthor: true,
      source: true,
      SheetAuthor: { select: { id: true, nickname: true } },
      access: true,
      updatedAt: true,
    },
    where: {
      AND: [
        { id: sheetId },
        {
          OR: [
            { access: SheetAccess.public },
            { sheetAuthorId: authUser?.id ?? "" },
          ],
        },
      ],
    },
  });

  if (!sheet) {
    return <div>not found</div>;
  }

  const user = authUser ? await getOrCreateUser(authUser) : null;

  const isAuthor = sheet.SheetAuthor.id === user?.id;

  return <Editor editable={isAuthor} sheet={sheet} />;
};

export default Sheet;
