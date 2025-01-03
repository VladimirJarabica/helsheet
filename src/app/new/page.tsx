"use server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "../../utils/user";
import NewSheet from "./NewSheet";

export default async function New() {
  const authUser = await currentUser();
  if (!authUser) {
    return;
  }
  const user = await getOrCreateUser(authUser.id);

  if (!user) {
    redirect("/");
  }
  return (
    <div>
      <div>Vytvor nový zápis</div>
      <NewSheet user={user} />
    </div>
  );
}
