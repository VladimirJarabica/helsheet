"use server";
import { User } from "@prisma/client";
import { dbClient } from "../../services/db";
import { FormData } from "./editor/SheetSettings";

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
