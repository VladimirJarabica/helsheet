const FullScreenLoader = async () => {
  return (
    <div className="flex flex-col absolute left-0 top-0 w-screen h-screen items-center">
      <div className="border-gray-100 h-10 w-10 animate-spin mt-[30vh] rounded-full border-4 border-t-indigo-600 border-b-indigo-600" />
    </div>
  );
};

export default FullScreenLoader;
