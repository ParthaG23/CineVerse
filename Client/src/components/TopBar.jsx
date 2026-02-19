import { useState, useEffect } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { useContent } from "../context/ContentContext";

const options = [
  { label: "Movies", value: "movie" },
  { label: "Web Series", value: "tv" },
  { label: "TV Shows", value: "tv" },
  { label: "Anime", value: "anime" },
];

const TopBar = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const { contentType, setContentType, setSearchQuery } = useContent();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");

  // 🔥 Debounced search (fix search not working)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  if (sidebarOpen) return null;

  return (
    <>
      {/* FIXED TOP BAR */}
      <div
        className="
          fixed top-0 left-0 right-0
          lg:left-56
          z-[60]
          px-4 lg:px-6
          pt-4
        "
      >
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto]">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white"
            >
              <FiMenu size={22} />
            </button>

            {/* DROPDOWN (SHIFTED RIGHT FROM SIDEBAR) */}
            <div className="relative lg:ml-6 ">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="
                  bg-black/30 backdrop-blur-md
                  rounded-xl px-4 py-2
                  text-sm text-white/80
                  flex items-center gap-2
                "
              >
                {options.find(o => o.value === contentType)?.label}
                <span className="text-xs">▾</span>
              </button>

              {dropdownOpen && (
                <div
                  className="
                    absolute mt-2 w-40 z-50
                    bg-black/70 backdrop-blur-xl
                    rounded-xl overflow-hidden
                    border border-white/10
                  "
                >
                  {options.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setContentType(opt.value);
                        setSearchQuery("");
                        setLocalQuery("");
                        setDropdownOpen(false);
                      }}
                      className="
                        w-full text-left px-4 py-2
                        text-sm text-white/80
                        hover:bg-white/10
                      "
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP SEARCH (CENTERED & WORKING) */}
          <div className="hidden lg:flex justify-center">
            <div
              className="
                w-[420px]
                bg-black/30 backdrop-blur-md
                rounded-xl
                px-5 py-3
                flex items-center gap-3
                border border-white/10
              "
            >
              <FiSearch className="text-white/40 shrink-0" />
              <input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Movies, series, anime..."
                className="
                  bg-transparent outline-none
                  text-white text-sm w-full
                  placeholder:text-white/40
                "
              />
            </div>
          </div>

          {/* MOBILE SEARCH ICON */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setMobileSearchOpen(prev => !prev)}
              className="lg:hidden p-2 text-white"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {mobileSearchOpen && (
          <div className="mt-3 lg:hidden">
            <div
              className="
                bg-black/30 backdrop-blur-md
                rounded-2xl px-5 py-3
                flex items-center gap-3
                border border-white/10
              "
            >
              <FiSearch className="text-white/40 shrink-0" />
              <input
                autoFocus
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search movies, series, anime..."
                className="
                  bg-transparent outline-none
                  text-white text-sm w-full
                  placeholder:text-white/40
                "
              />
            </div>
          </div>
        )}
      </div>

      {/* 🔥 PERFECT SPACER (FIX GAP + MOBILE OVERLAP) */}
      <div className="h-[72px] lg:h-[88px]" />
    </>
  );
};

export default TopBar;
