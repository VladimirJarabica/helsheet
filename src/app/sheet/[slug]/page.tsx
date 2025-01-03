import { currentUser } from "@clerk/nextjs/server";
import { dbClient } from "../../../services/db";
import { getSheetIdFromParam } from "../../../utils/sheet";
import Editor from "../../components/editor/Editor";
import { getOrCreateUser } from "../../../utils/user";

type SearchParams = { [key: string]: string | string[] | undefined };

const Sheet = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) => {
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
  console.log("user", user);

  const isAuthor = sheet.Author.id === user?.id;
  console.log("song", { sheet, isAuthor });

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
