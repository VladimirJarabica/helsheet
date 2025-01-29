import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { dbClient } from "../../../services/db";
import { getOrCreateUser, updateNickname } from "../../../utils/user";
import FilterableSheets from "../../components/FilterableSheets";
import EditableName from "./EditableName";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}
const UserPage = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;

  const searchParamsValue = await searchParams;

  console.log("id", id);

  if (!id) {
    redirect("/");
  }

  const authUser = await currentUser();

  const isMyProfile = id === authUser?.id;
  const user = isMyProfile
    ? await getOrCreateUser(authUser)
    : await dbClient.user.findUnique({
        where: { id },
        select: { id: true, nickname: true },
      });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col max-w-[700px] w-11/12 mb-52 mt-2">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">
          {isMyProfile ? "Tvoj profil" : "Profil autora"}
        </span>
        <EditableName
          name={user.nickname ?? ""}
          setName={
            isMyProfile
              ? async (name) => {
                  "use server";
                  await updateNickname(user, name);
                }
              : undefined
          }
        />
      </div>
      <FilterableSheets searchParams={searchParamsValue} user={user} />
    </div>
  );
};

export default UserPage;
