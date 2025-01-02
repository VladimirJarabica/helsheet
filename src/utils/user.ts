import { currentUser } from "@clerk/nextjs/server";
import { dbClient } from "../services/db";

export const getOrCreateUser = async (id?: string) => {
  const userId = id ?? (await currentUser())?.id;

  if (!userId) {
    return null;
  }

  const user = await dbClient.user.findUnique({
    where: { id: userId },
  });

  if (user) {
    return user;
  }

  return dbClient.user.create({
    data: {
      id: userId,
    },
  });
};
