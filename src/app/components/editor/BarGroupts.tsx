const BarGroups = () => {
  // const { song } = useSongContext();
  // const barGroups = song.barGroups ?? [];
  return (
    <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-[#dfd5b7] p-4 border border-black rounded">
      Skupiny
      <div>
        <input
          className="bg-transparent outline-none"
          type="text"
          placeholder="Nová skupina"
        />
      </div>
    </div>
  );
};

export default BarGroups;
