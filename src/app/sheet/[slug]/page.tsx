import { dbClient } from "../../../services/db";
import { getSheetIdFromParam } from "../../../utils/sheet";
import Editor from "../../components/editor/Editor";

type SearchParams = { [key: string]: string | string[] | undefined };

const Sheet = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  const { slug, ...rest } = await props.params;
  const searchParams = await props.searchParams;
  const id = getSheetIdFromParam(slug);

  console.log("id", id);
  console.log("params", rest);
  console.log("searchParams", searchParams);

  if (!id) {
    return <div>not found</div>;
  }

  const sheet = await dbClient.sheet.findUnique({
    select: {
      id: true,
      name: true,
      tuning: true,
      content: true,
      version: true,
      author: true,
      sourceText: true,
      sourceUrl: true,
      editSecret: true,
    },
    where: { id },
  });
  // const song: Sheet = {
  //   id: 1,
  //   name: "Empty",
  //   tuning: Tuning.CF,
  //   content: { bars: [], timeSignature: "4/4" },
  //   version: 1,
  //   editSecret: "fJR7qYRiZw",
  //   author: "Vlado",
  //   sourceText: null,
  //   sourceUrl: null,
  // };

  if (!sheet) {
    return <div>not found</div>;
  }

  console.log("song", sheet);

  return (
    <Editor
      editSecret={searchParams.editSecret as string | undefined}
      sheet={sheet}
      readonly={searchParams.editSecret !== sheet.editSecret}
    />
  );
};

export default Sheet;
