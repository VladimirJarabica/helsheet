"use server";
import FilterableSheets from "../components/FilterableSheets";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParamsValue = await searchParams;

  return (
    <div className="max-w-[700px] w-11/12">
      <FilterableSheets searchParams={searchParamsValue} />
    </div>
  );
}
