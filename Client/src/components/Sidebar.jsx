import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFilm,
  FiGlobe,
  FiTv,
  FiVideo,
  FiSettings,
  FiHelpCircle,
  FiLogIn,
  FiX,
} from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { memo, useMemo } from "react";
import Logo from "./Logo";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();

  /* USER MEMO (avoid repeated JSON parsing) */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  /* MAIN MENU ITEMS */
  const menuItems = useMemo(
    () => [
      { name: "Home", icon: <FiHome />, path: "/" },
      { name: "Hollywood", icon: <FiFilm />, path: "/category/hollywood" },
      { name: "Bollywood", icon: <FiFilm />, path: "/category/bollywood" },
      { name: "Hindi Dubbed", icon: <FiGlobe />, path: "/category/hindi-dubbed" },
      { name: "Web Series", icon: <FiTv />, path: "/category/webseries" },
      { name: "Telugu", icon: <FiVideo />, path: "/category/telugu" },
      { name: "Tamil", icon: <FiVideo />, path: "/category/tamil" },
      { name: "Malayalam", icon: <FiVideo />, path: "/category/malayalam" },
    ],
    []
  );

  /* BOTTOM MENU */
  const bottomItems = useMemo(
    () => [
      { name: "Settings", icon: <FiSettings />, path: "/settings" },
      { name: "Support", icon: <FiHelpCircle />, path: "/support" },
    ],
    []
  );

  /* ACTIVE ROUTE FIX */
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-dvh w-64
          px-6 py-6
          flex flex-col
          bg-gradient-to-b from-slate-900/95 to-black/95
          backdrop-blur-xl
          border-r border-white/5
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Logo />

          <button
            className="lg:hidden text-white hover:text-yellow-400 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">

          {/* MAIN MENU */}
          <nav className="flex flex-col gap-2 text-sm">
            {menuItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    ${
                      active
                        ? "bg-white/10 text-white shadow-lg before:absolute before:left-0 before:top-2 before:h-6 before:w-1 before:bg-yellow-400 before:rounded-r"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM MENU */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <nav className="flex flex-col gap-2 text-sm mb-4">
              {bottomItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200 hover:scale-[1.02]
                      ${
                        active
                          ? "bg-white/10 text-white shadow-lg before:absolute before:left-0 before:top-2 before:h-6 before:w-1 before:bg-yellow-400 before:rounded-r"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <span className="text-lg shrink-0">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* USER / LOGIN CARD */}
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="text-white text-sm leading-tight">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-white/60">Premium</p>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  flex items-center justify-center gap-2 w-full
                  bg-yellow-400 text-black font-semibold
                  py-2.5 text-sm
                  rounded-xl
                  hover:bg-yellow-300 transition
                "
              >
                <FiLogIn size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);