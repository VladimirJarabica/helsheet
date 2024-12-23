"use server";
import { Tuning } from "@prisma/client";
import { dbClient } from "../../services/db";
import { nanoid } from "nanoid";
import { Song } from "../types";

export const createSheet = async (data: {
  name: string;
  author: string;
  content: Song;
  tuning: Tuning;
  sourceText: string | null;
  sourceUrl: string | null;
}) => {
  const newSheet = await dbClient.sheet.create({
    data: {
      name: data.name,
      author: data.author,
      tuning: data.tuning,
      content: data.content,
      sourceText: data.sourceText,
      sourceUrl: data.sourceUrl,
      version: 0,
      editSecret: nanoid(10),
    },
  });

  return newSheet;
};
