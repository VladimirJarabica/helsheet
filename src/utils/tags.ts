"use server";
import {
  unstable_cacheTag as cacheTag,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { dbClient } from "../services/db";
import { getSheetUrl } from "./sheet";

// export const getTagsCacheTag = () => "tags";
export const getTags = async () => {
  "use cache";
  cacheTag("tags");

  const tags = await dbClient.tag.findMany();

  return tags;
};

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
