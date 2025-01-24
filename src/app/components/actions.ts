"use server";
import { Sheet, SheetAccess, User } from "@prisma/client";
import { dbClient } from "../../services/db";
import { FormData } from "./editor/SheetSettings";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../../utils/user";
import { revalidatePath } from "next/cache";
import { getSheetUrl } from "../../utils/sheet";

export const createSheet = async (
  user: Pick<User, "id" | "nickname">,
  data: FormData
) => {
  // if (user.nickname !== data.author) {
  //   await dbClient.user.update({
  //     where: { id: user.id },
  //     data: {
  //       nickname: data.author,
  //     },
  //   });
  // }
  const newSheet = await dbClient.sheet.create({
    data: {
      name: data.name,
      description: data.description,
      tuning: data.tuning,
      content: {
        timeSignature: data.timeSignature,
        bars: [],
      },
      sourceText: data.sourceText,
      sourceUrl: data.sourceUrl,
      scale: data.scale,
      tempo: data.tempo,
      genre: data.genre,
      country: data.country,
      songAuthorType: data.songAuthorType,
      songAuthor: data.songAuthor,
      noteSheetAuthor: data.noteSheetAuthor,
      version: 0,
      SheetAuthor: { connect: { id: user.id } },
      access: SheetAccess.private,
    },
  });

  return newSheet;
};

export const updateSheet = async (sheet: Pick<Sheet, "id">, data: FormData) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser.id);
  // if (user.nickname !== data.author) {
  //   await dbClient.user.update({
  //     where: { id: user.id },
  //     data: {
  //       nickname: data.author,
  //     },
  //   });
  // }
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
      noteSheetAuthor: data.noteSheetAuthor,
      sourceText: data.sourceText,
      sourceUrl: data.sourceUrl,
    },
  });

  revalidatePath(getSheetUrl(updatedSheet));

  return updatedSheet;
};

export const deleteSheet = async (sheet: Pick<Sheet, "id" | "name">) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser.id);
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
  const user = await getOrCreateUser(authUser.id);
  const updatedSheet = await dbClient.sheet.update({
    where: { id: sheet.id, sheetAuthorId: user.id },
    data: { access },
  });
  if (updatedSheet) {
    revalidatePath(getSheetUrl(sheet));
  }
  return updatedSheet;
};
