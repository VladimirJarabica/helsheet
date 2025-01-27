import { unstable_cache as cache } from "next/cache";
import { dbClient } from "../services/db";

export const getUserCacheTag = (id: string) => `user-${id}`;

export const getOrCreateUser = async (userId: string) => {
  const getCachedUser = cache(
    async (id: string) => {
      const user = await dbClient.user.findUnique({
        where: { id },
        select: {
          id: true,
          nickname: true,
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
        },
      });
    },
    [],
    { tags: [getUserCacheTag(userId)] }
  );

  return getCachedUser(userId);
};
// export const getOrCreateUser = async (id: string) => {
//   cacheTag(getUserCacheTag(id));

//   const user = await dbClient.user.findUnique({
//     where: { id },
//     select: {
//       id: true,
//       nickname: true,
//       likedSheets: { select: { id: true, name: true } },
//     },
//   });

//   if (user) {
//     return user;
//   }

//   return dbClient.user.create({
//     data: {
//       id: id,
//     },
//     select: {
//       id: true,
//       nickname: true,
//       likedSheets: { select: { id: true, name: true } },
//     },
//   });
// };
