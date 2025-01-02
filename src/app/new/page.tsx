"use server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "../../utils/user";
import NewSheet from "./NewSheet";

export default async function New() {
  const user = await getOrCreateUser();

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
