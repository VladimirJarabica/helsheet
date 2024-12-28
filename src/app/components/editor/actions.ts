"use server";

import { dbClient } from "../../../services/db";
import { Song } from "../../types";

export const saveSong = async ({
  id,
  editSecret,
  song,
}: {
  song: Song;
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
