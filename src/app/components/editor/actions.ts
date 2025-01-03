"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { dbClient } from "../../../services/db";
import { getOrCreateUser, getUserCacheTag } from "../../../utils/user";
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

export const likeSheet = async ({ id }: { id: number }) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser.id);
  await dbClient.user.update({
    where: { id: user.id },
    data: {
      likedSheets: {
        connect: { id },
      },
    },
  });
  revalidateTag(getUserCacheTag(user.id));
};

export const dislikeSheet = async ({ id }: { id: number }) => {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser.id);
  await dbClient.user.update({
    where: { id: user.id },
    data: {
      likedSheets: {
        disconnect: { id },
      },
    },
  });
  revalidateTag(getUserCacheTag(user.id));
};
