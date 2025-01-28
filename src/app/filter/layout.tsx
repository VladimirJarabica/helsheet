import { getSongAuthors } from "../components/actions";
import Filter from "../components/Filter";

export default async function FilterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authors = await getSongAuthors();

  return (
    <div className="flex flex-col max-w-[700px] w-11/12">
      <Filter songAuthors={authors} />
      {children}
    </div>
  );
}
