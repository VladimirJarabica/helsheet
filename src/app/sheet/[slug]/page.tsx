import { currentUser } from "@clerk/nextjs/server";
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

  const sheet = await dbClient.sheet.findUnique({
    select: {
      id: true,
      name: true,
      tuning: true,
      content: true,
      version: true,
      sourceText: true,
      sourceUrl: true,
      Author: { select: { id: true, nickname: true } },
      Tags: { select: { id: true, name: true } },
    },
    where: { id: sheetId },
  });

  if (!sheet) {
    return <div>not found</div>;
  }

  const authUser = await currentUser();

  const user = authUser ? await getOrCreateUser(authUser.id) : null;

  const isAuthor = sheet.Author.id === user?.id;

  return (
    <Editor
      editable={isAuthor}
      sheet={sheet}
      liked={
        !!user?.likedSheets.some((likedSheet) => likedSheet.id === sheet.id)
      }
    />
  );
};

export default Sheet;
