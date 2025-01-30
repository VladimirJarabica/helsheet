import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import {
  getSheetDetail,
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

  const sheet = await getSheetDetail(sheetId, authUser?.id);

  if (!sheet) {
    return <div>not found</div>;
  }

  const user = authUser ? await getOrCreateUser(authUser) : null;

  const isAuthor = sheet.SheetAuthor.id === user?.id;

  return <Editor editable={isAuthor} sheet={sheet} />;
};

export default Sheet;
