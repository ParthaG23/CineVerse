import { memo } from "react";
import { FiMenu } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import Logo from "./Logo";

const MobileTopBar = () => {
  const { setSidebarOpen } = useUI();

  return (
    <>
      {/* 📱 MOBILE TOP BAR */}
      <header
        className="
          lg:hidden
          fixed top-0 left-0 right-0
          z-[90]
          h-14
          px-4
          flex items-center
          justify-between
          bg-gradient-to-b from-black/90 to-black/70
          backdrop-blur-xl
          border-b border-white/5
        "
      >
        {/* ☰ MENU BUTTON */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="
            text-white p-2 rounded-lg
            hover:bg-white/10
            transition
          "
        >
          <FiMenu size={22} />
        </button>

        {/* 🎬 LOGO / BRAND */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* 🔍 Right spacer (for symmetry / future icons) */}
        <div className="w-8" />
      </header>

      {/* 🧱 SPACER (Prevents content overlap with fixed header) */}
      <div className="h-14 lg:hidden" />
    </>
  );
};

// 🧠 Prevent unnecessary re-renders (important in Layout)
export default memo(MobileTopBar);
