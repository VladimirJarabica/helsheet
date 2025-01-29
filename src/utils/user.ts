import { unstable_cache as cache, revalidateTag } from "next/cache";
import { dbClient } from "../services/db";
import { User as AuthUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

export const getUserCacheTag = (id: string) => `user-${id}`;

const getUserNameFromAuthUser = (authUser: AuthUser) => {
  if (authUser.username) {
    return authUser.username;
  }
  if (authUser.firstName && authUser.lastName) {
    return `${authUser.firstName} ${authUser.lastName}`;
  }
  const email = authUser.emailAddresses[0]?.emailAddress;
  if (email) {
    return email.split("@")[0];
  }
  return authUser.id;
};

export const getOrCreateUser = async (authUser: AuthUser) => {
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
        data: { id: id, nickname: getUserNameFromAuthUser(authUser) },
        select: { id: true, nickname: true },
      });
    },
    [],
    { tags: [getUserCacheTag(authUser.id)] }
  );

  return getCachedUser(authUser.id);
};

export const updateNickname = async (
  user: Pick<User, "id">,
  newNickname: string
) => {
  console.log("update nickname", user, newNickname);
  const updatedUser = await dbClient.user.update({
    where: { id: user.id },
    data: { nickname: newNickname },
  });
  console.log("updated user", updatedUser);
  revalidateTag(getUserCacheTag(user.id));
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
