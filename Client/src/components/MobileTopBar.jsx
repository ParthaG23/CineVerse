import { useUI } from "../context/UIContext";

const MobileTopBar = () => {
  const { setSidebarOpen } = useUI();

  return (
    <div
      className="
        lg:hidden
        fixed top-0 left-0 right-0
        z-[100]
        bg-black/90 backdrop-blur
        h-14
        flex items-center
        px-4
      "
    >
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-white text-2xl"
      >
        ☰
      </button>

      <h1 className="text-yellow-400 font-bold ml-4">
        SERVIYA
      </h1>
    </div>
  );
};

export default MobileTopBar;
