"use server";
import {
  unstable_cache as cache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { dbClient } from "../services/db";
import { getSheetUrl } from "./sheet";

export const getTags = cache(async () => dbClient.tag.findMany(), ["tags"]);

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
  const sheet = await dbClient.sheet.update({
    select: { id: true, name: true },
    where: { id: sheetId },
    data: {
      Tags: { disconnect: { id: tagId } },
    },
  });

  revalidatePath(getSheetUrl(sheet));
};
