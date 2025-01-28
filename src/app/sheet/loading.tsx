import Filter from "../components/Filter";

const Loading = () => {
  return (
    <div className="flex flex-col max-w-[700px] w-11/12">
      <Filter songAuthors={[]} />
    </div>
  );
};

export default Loading;
