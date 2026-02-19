import { useState, useEffect, useRef, useCallback, memo } from "react";
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

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // 🚀 Optimized Debounced Search (Prevents excessive re-renders)
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSearchQuery(localQuery.trim());
    }, 500); // slightly higher = better performance

    return () => clearTimeout(debounceRef.current);
  }, [localQuery, setSearchQuery]);

  // 🎯 Close dropdown on outside click (UX + accessibility)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // ⚡ Memoized handlers (reduces child re-renders)
  const handleContentChange = useCallback(
    (value) => {
      setContentType(value);
      setSearchQuery("");
      setLocalQuery("");
      setDropdownOpen(false);
    },
    [setContentType, setSearchQuery]
  );

  if (sidebarOpen) return null;

  const activeLabel =
    options.find((o) => o.value === contentType)?.label || "Movies";

  return (
    <>
      {/* 🔝 FIXED TOP BAR */}
      <header
        className="
          fixed top-0 left-0 right-0 lg:left-56
          z-50 px-4 lg:px-6 pt-4
          bg-gradient-to-b from-black/80 to-transparent
          backdrop-blur-md
        "
      >
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto]">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            {/* 📱 Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 text-white hover:text-yellow-400 transition"
            >
              <FiMenu size={22} />
            </button>

            {/* 🎬 Content Type Dropdown */}
            <div ref={dropdownRef} className="relative lg:ml-6">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="
                  bg-black/40 backdrop-blur-xl
                  rounded-xl px-4 py-2
                  text-sm text-white/90
                  flex items-center gap-2
                  border border-white/10
                  hover:bg-black/60 transition
                "
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                {activeLabel}
                <span className="text-xs">▾</span>
              </button>

              {dropdownOpen && (
                <div
                  className="
                    absolute mt-2 w-44 z-50
                    bg-black/80 backdrop-blur-xl
                    rounded-xl overflow-hidden
                    border border-white/10 shadow-xl
                  "
                  role="listbox"
                >
                  {options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleContentChange(opt.value)}
                      className="
                        w-full text-left px-4 py-2.5
                        text-sm text-white/80
                        hover:bg-white/10 transition
                      "
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 🔎 DESKTOP SEARCH */}
          <div className="hidden lg:flex justify-center">
            <div
              className="
                w-[420px]
                bg-black/40 backdrop-blur-xl
                rounded-xl px-5 py-3
                flex items-center gap-3
                border border-white/10
                focus-within:border-yellow-400/60
                transition
              "
            >
              <FiSearch className="text-white/40 shrink-0" />
              <input
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

          {/* 📱 MOBILE SEARCH ICON */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label="Search"
              className="lg:hidden p-2 text-white hover:text-yellow-400 transition"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </div>

        {/* 📱 MOBILE SEARCH BAR */}
        {mobileSearchOpen && (
          <div className="mt-3 lg:hidden">
            <div
              className="
                bg-black/40 backdrop-blur-xl
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
      </header>

      {/* 🧱 Spacer (prevents content overlap) */}
      <div className="h-[72px] lg:h-[88px]" />
    </>
  );
};

// 🧠 Memo = Prevent unnecessary re-renders on every keystroke
export default memo(TopBar);
