import { dbClient } from "../../../services/db";
import { getSheetIdFromParam } from "../../../utils/sheet";
import Editor from "../../components/editor/Editor";
import { Song } from "../../types";

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

  const song = await dbClient.sheet.findUnique({
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

  if (!song) {
    return <div>not found</div>;
  }

  console.log("song", song);

  return (
    <Editor
      id={song.id}
      editSecret={searchParams.editSecret as string | undefined}
      song={song.content as Song}
      readonly={searchParams.editSecret !== song.editSecret}
      tuning={song.tuning}
    />
  );
};

export default Sheet;
