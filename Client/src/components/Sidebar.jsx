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
import Logo from "./Logo";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();

  // Fake auth (replace later with real auth)
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Home", icon: <FiHome />, path: "/" },
    { name: "Hollywood", icon: <FiFilm />, path: "/category/hollywood" },
    { name: "Bollywood", icon: <FiFilm />, path: "/category/bollywood" },
    { name: "Hindi Dubbed", icon: <FiGlobe />, path: "/category/hindi-dubbed" },
    { name: "Web Series", icon: <FiTv />, path: "/category/webseries" },
    { name: "Telugu", icon: <FiVideo />, path: "/category/telugu" },
    { name: "Tamil", icon: <FiVideo />, path: "/category/tamil" },
    { name: "Malayalam", icon: <FiVideo />, path: "/category/malayalam" },
  ];

  const bottomItems = [
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
    { name: "Support", icon: <FiHelpCircle />, path: "/support" },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed top-0 left-0 z-50
    h-screen w-64
    px-6 py-6
    flex flex-col
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    bg-gradient-to-b from-slate-900/90 to-black/90
    backdrop-blur-xl
    overflow-hidden
  `}
      >
        {/* HEADER / LOGO */}
        <div className="flex items-center justify-between mb-8">
          <Logo/>

          {/* CLOSE BUTTON (MOBILE) */}
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* MAIN MENU */}
        <nav className="flex flex-col gap-2 text-sm">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="mt-auto pt-6">
          {/* DIVIDER */}
          <div className="mb-4 border-t border-white/10" />

          {/* SETTINGS & SUPPORT */}
          <nav className="flex flex-col gap-2 text-sm mb-4">
            {bottomItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* LOGIN / USER CARD (SMALLER + BOTTOM GAP) */}
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-2">
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
                mb-2
              "
            >
              <FiLogIn size={16} />
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
