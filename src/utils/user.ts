import { unstable_cacheTag as cacheTag } from "next/cache";
import { dbClient } from "../services/db";

export const getUserCacheTag = (id: string) => `user-${id}`;

export const getOrCreateUser = async (id: string) => {
  "use cache";
  cacheTag(getUserCacheTag(id));

  const user = await dbClient.user.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      likedSheets: { select: { id: true, name: true } },
    },
  });

  if (user) {
    return user;
  }

  return dbClient.user.create({
    data: {
      id: id,
    },
    select: {
      id: true,
      nickname: true,
      likedSheets: { select: { id: true, name: true } },
    },
  });
};
