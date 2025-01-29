"use client";
interface ModalWrapperProps {
  children: React.ReactNode;
  close: () => void;
}

const ModalWrapper = ({ children, close }: ModalWrapperProps) => {
  return (
    <div
      onClick={() => {
        close?.();
      }}
      className="fixed top-0 left-0 w-screen h-dvh z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        // className="bg-hel-bgDefault p-5 rounded"
        className="relative transform max-h-[90%] my-2 overflow-auto rounded-lg bg-white text-left shadow-xl transition-all w-[80vw] sm:my-8 sm:w-full sm:max-w-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
