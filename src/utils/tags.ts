"use server";
import {
  unstable_cache as cache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { dbClient } from "../services/db";
import { getSheetUrl } from "./sheet";

// export function getCachedProgramID(slug: string): Promise<string | null> {
//   const cachedQuery = cache(queryProgramID, ['program-id'], {
//     tags: [`program-slug:${slug}`],
//     revalidate: 60 * 60 * 24,
//   });

//   return cachedQuery(slug);
// }

// export const getTagsCacheTag = () => "tags";
export const getTags = cache(async () => dbClient.tag.findMany(), ["tags"]);
// "use cache";
// cacheTag("tags");

// const tags = await dbClient.tag.findMany();

//   return cachedTags;
// };

export const createTag = async (name: string) => {
  const newTag = await dbClient.tag.create({
    data: {
      name,
    },
  });

  revalidateTag("tags");
  return newTag;
};

export const setTagToSheet = async (sheetId: number, tagId: number) => {
  const sheet = await dbClient.sheet.update({
    select: { id: true, name: true },
    where: { id: sheetId },
    data: {
      Tags: { connect: { id: tagId } },
    },
  });

  revalidatePath(getSheetUrl(sheet));
};

export const removeTagFromSheet = async (sheetId: number, tagId: number) => {
  await dbClient.sheet.update({
    where: { id: sheetId },
    data: {
      Tags: { disconnect: { id: tagId } },
    },
  });
};
