"use server";
import { Sheet, User } from "@prisma/client";
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
  if (user.nickname !== data.author) {
    await dbClient.user.update({
      where: { id: user.id },
      data: {
        nickname: data.author,
      },
    });
  }
  const newSheet = await dbClient.sheet.create({
    data: {
      name: data.name,
      tuning: data.tuning,
      content: {
        timeSignature: data.timeSignature,
        bars: [],
      },
      sourceText: data.sourceText,
      sourceUrl: data.sourceUrl,
      version: 0,
      Author: { connect: { id: user.id } },
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
  if (user.nickname !== data.author) {
    await dbClient.user.update({
      where: { id: user.id },
      data: {
        nickname: data.author,
      },
    });
  }
  const updatedSheet = await dbClient.sheet.update({
    where: { id: sheet.id, authorId: user.id },
    data: {
      name: data.name,
      tuning: data.tuning,
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
    where: { id: sheet.id, authorId: user.id },
  });
  revalidatePath(getSheetUrl(sheet));
};
