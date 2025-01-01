"use server";

import { dbClient } from "../../../services/db";
import { SongContent } from "../../types";

export const saveSong = async ({
  id,
  editSecret,
  song,
}: {
  song: SongContent;
  id: number;
  editSecret: string;
}) => {
  await dbClient.sheet.update({
    where: { id, editSecret },
    data: {
      content: song,
    },
  });
};
