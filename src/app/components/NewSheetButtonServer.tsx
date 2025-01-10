"use server";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../../utils/user";
import { createSheet } from "./actions";
import NewSheetButtonClient from "./NewSheetButtonClient";

const NewSheetButton = async () => {
  const authUser = await currentUser();

  const user = authUser ? await getOrCreateUser(authUser.id) : null;

  return (
    <SignedIn>
      <NewSheetButtonClient createSheet={createSheet} user={user} />
    </SignedIn>
  );
};

export default NewSheetButton;
