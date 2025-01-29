"use server";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../../utils/user";
import FilterableSheets from "../components/FilterableSheets";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const authUser = await currentUser();
  const user = authUser ? await getOrCreateUser(authUser) : null;

  const searchParamsValue = await searchParams;

  return (
    <div className="max-w-[700px] w-11/12">
      <FilterableSheets searchParams={searchParamsValue} currentUser={user} />
    </div>
  );
}
