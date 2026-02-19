import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import { memo } from "react";
import Logo from "./Logo";

const socialIcons = [
  { Icon: FiFacebook, label: "Facebook" },
  { Icon: FiInstagram, label: "Instagram" },
  { Icon: FiTwitter, label: "Twitter" },
  { Icon: FiYoutube, label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-gradient-to-b from-black/40 to-black backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-10 py-12">
        {/* 🎬 GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* 🎞 LOGO + ABOUT */}
          <div>
            <Logo />

            <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-xs">
              Watch trending movies, anime, web series and regional content in
              one place. Your personal cinematic OTT streaming platform.
            </p>

            {/* 🌐 SOCIAL ICONS */}
            <div className="flex gap-3 mt-6">
              {socialIcons.map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-lg
                    bg-white/5 
                    flex items-center justify-center
                    text-white/70
                    hover:bg-yellow-400 hover:text-black
                    transition-all duration-300
                    hover:scale-110
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 📺 BROWSE */}
          <nav>
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Browse
            </h3>
            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link to="/" className="hover:text-yellow-400 transition">
                Home
              </Link>
              <Link
                to="/category/hollywood"
                className="hover:text-yellow-400 transition"
              >
                Hollywood
              </Link>
              <Link
                to="/category/bollywood"
                className="hover:text-yellow-400 transition"
              >
                Bollywood
              </Link>
              <Link
                to="/category/webseries"
                className="hover:text-yellow-400 transition"
              >
                Web Series
              </Link>
            </div>
          </nav>

          {/* 🎬 CATEGORIES */}
          <nav>
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Categories
            </h3>
            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link
                to="/category/hindi-dubbed"
                className="hover:text-yellow-400 transition"
              >
                Hindi Dubbed
              </Link>
              <Link
                to="/category/telugu"
                className="hover:text-yellow-400 transition"
              >
                Telugu
              </Link>
              <Link
                to="/category/tamil"
                className="hover:text-yellow-400 transition"
              >
                Tamil
              </Link>
              <Link
                to="/category/malayalam"
                className="hover:text-yellow-400 transition"
              >
                Malayalam
              </Link>
            </div>
          </nav>

          {/* 👤 ACCOUNT */}
          <nav>
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Account
            </h3>
            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link to="/login" className="hover:text-yellow-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-400 transition">
                Sign Up
              </Link>
              <Link
                to="/support"
                className="hover:text-yellow-400 transition"
              >
                Support
              </Link>
              <Link
                to="/settings"
                className="hover:text-yellow-400 transition"
              >
                Settings
              </Link>
            </div>
          </nav>
        </div>

        {/* 🔻 BOTTOM BAR */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} CineVerse. All rights reserved.
          </p>

          <p className="text-white/40 text-xs text-center">
            Crafted with 🎬 by{" "}
            <span
              className="
                text-yellow-400 font-bold tracking-wide
                drop-shadow-[0_0_10px_rgba(250,204,21,1)]
                animate-pulse
              "
            >
              pG-23
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// 🧠 Prevent unnecessary re-renders (important in Layout)
export default memo(Footer);
