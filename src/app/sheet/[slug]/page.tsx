import { currentUser } from "@clerk/nextjs/server";
import { dbClient } from "../../../services/db";
import { getSheetIdFromParam } from "../../../utils/sheet";
import Editor from "../../components/editor/Editor";

type SearchParams = { [key: string]: string | string[] | undefined };

const Sheet = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const { slug } = await props.params;
  const user = await currentUser();
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
    },
    where: { id: sheetId },
  });

  if (!sheet) {
    return <div>not found</div>;
  }

  const isAuthor = sheet.Author.id === user?.id;
  console.log("song", sheet);

  return <Editor editable={isAuthor} sheet={sheet} />;
};

export default Sheet;
