"use server";

import { currentUser } from "@clerk/nextjs/server";
import { dbClient } from "../../../services/db";
import { SongContent } from "../../types";

export const saveSong = async ({
  id,
  song,
}: {
  song: SongContent;
  id: number;
}) => {
  const user = await currentUser();
  if (!user) {
    return;
  }
  await dbClient.sheet.update({
    where: { id, Author: { id: user.id } },
    data: {
      content: song,
    },
  });
};
