"use server";
import { Tuning, User } from "@prisma/client";
import { dbClient } from "../../services/db";
import { SongContent } from "../types";

export const createSheet = async (
  user: Pick<User, "id" | "nickname">,
  data: {
    name: string;
    author: string;
    content: SongContent;
    tuning: Tuning;
    sourceText: string | null;
    sourceUrl: string | null;
  }
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
      content: data.content,
      sourceText: data.sourceText,
      sourceUrl: data.sourceUrl,
      version: 0,
      Author: { connect: { id: user.id } },
    },
  });

  return newSheet;
};
