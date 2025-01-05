interface ModalWrapperProps {
  children: React.ReactNode;
  close: () => void;
}

const ModalWrapper = ({ children, close }: ModalWrapperProps) => {
  return (
    <div
      onClick={() => {
        close();
      }}
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-hel-bgDefault p-5 rounded"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
