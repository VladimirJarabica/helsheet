"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Sheet, SheetAccess, User } from "@prisma/client";
import {
  unstable_cache as cache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import { dbClient } from "../../services/db";
import { notEmpty } from "../../utils/fnUtils";
import { getGlobalSheetCacheTag, getSheetUrl } from "../../utils/sheet";
import { getOrCreateUser } from "../../utils/user";
import { SongContent } from "../types";
import { FormData } from "./editor/SheetSettings";

export const getSongAuthors = cache(async () => {
  const authors = await dbClient.sheet.findMany({
    select: { songAuthor: true },
    where: { songAuthor: { not: null }, access: SheetAccess.public },
    distinct: ["songAuthor"],
  });
  return authors
    .map((a) => a.songAuthor)
    .filter(notEmpty)
    .flatMap((authors) => authors.split(",").map((a) => a.trim()));
}, ["songAuthors"]);

export const createSheet = async (
  user: Pick<User, "id" | "nickname">,
  data: FormData
) => {
  const newSheet = await dbClient.sheet.create({
    data: {
      name: data.name,
      description: data.description,
      tuning: data.tuning,
      content: { bars: [] },
      timeSignature: data.timeSignature,
      source: data.source,
      scale: data.scale,
      tempo: data.tempo,
      genre: data.genre,
      country: data.country,
      songAuthorType: data.songAuthorType,
      songAuthor: data.songAuthor,
      originalSheetAuthor: data.originalSheetAuthor,
      version: 0,
      SheetAuthor: { connect: { id: user.id } },
      access: SheetAccess.private,
    },
  });

  revalidateTag("songAuthors");

  return newSheet;
};

export const saveSheetContent = async ({
  sheetId,
  content,
}: {
  content: SongContent;
  sheetId: number;
}) => {
  const user = await currentUser();
  if (!user) {
    return;
  }
  await dbClient.sheet.update({
    where: { id: sheetId, SheetAuthor: { id: user.id } },
    data: { content },
  });
  revalidateTag(getGlobalSheetCacheTag(sheetId));
};

export const updateSheet = async (sheet: Pick<Sheet, "id">, data: FormData) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser);

  const updatedSheet = await dbClient.sheet.update({
    where: { id: sheet.id, sheetAuthorId: user.id },
    data: {
      name: data.name,
      description: data.description,
      tuning: data.tuning,
      scale: data.scale,
      tempo: data.tempo,
      genre: data.genre,
      country: data.country,
      songAuthorType: data.songAuthorType,
      songAuthor: data.songAuthor,
      timeSignature: data.timeSignature,
      originalSheetAuthor: data.originalSheetAuthor,
      source: data.source,
    },
  });

  revalidateTag("songAuthors");
  revalidatePath(getSheetUrl(updatedSheet));

  return updatedSheet;
};

export const deleteSheet = async (sheet: Pick<Sheet, "id" | "name">) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser);
  if (!user) {
    return;
  }
  await dbClient.sheet.delete({
    where: { id: sheet.id, sheetAuthorId: user.id },
  });
  revalidatePath(getSheetUrl(sheet));
};

export const changeSheetAccess = async (
  sheet: Pick<Sheet, "id" | "name">,
  access: SheetAccess
) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser);
  const updatedSheet = await dbClient.sheet.update({
    where: { id: sheet.id, sheetAuthorId: user.id },
    data: { access },
  });
  if (updatedSheet) {
    revalidatePath(getSheetUrl(sheet));
  }
  revalidateTag(getGlobalSheetCacheTag(sheet.id));
  return updatedSheet;
};
