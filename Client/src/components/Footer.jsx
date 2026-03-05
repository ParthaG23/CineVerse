import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import { memo } from "react";
import Logo from "./Logo";

/* SOCIAL LINKS CONFIG */
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

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* LOGO + ABOUT */}
          <section>
            <Logo />

            <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-xs">
              Watch trending movies, anime, web series and regional content in
              one place. Your personal cinematic OTT streaming platform.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3 mt-6">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-lg
                    bg-white/5
                    flex items-center justify-center
                    text-white/70
                    hover:bg-yellow-400 hover:text-black
                    transition-colors duration-200
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </section>

          {/* BROWSE */}
          <nav aria-label="Browse">
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Browse
            </h3>

            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link to="/" className="hover:text-yellow-400 transition-colors">
                Home
              </Link>
              <Link
                to="/category/hollywood"
                className="hover:text-yellow-400 transition-colors"
              >
                Hollywood
              </Link>
              <Link
                to="/category/bollywood"
                className="hover:text-yellow-400 transition-colors"
              >
                Bollywood
              </Link>
              <Link
                to="/category/webseries"
                className="hover:text-yellow-400 transition-colors"
              >
                Web Series
              </Link>
            </div>
          </nav>

          {/* CATEGORIES */}
          <nav aria-label="Categories">
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Categories
            </h3>

            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link
                to="/category/hindi-dubbed"
                className="hover:text-yellow-400 transition-colors"
              >
                Hindi Dubbed
              </Link>
              <Link
                to="/category/telugu"
                className="hover:text-yellow-400 transition-colors"
              >
                Telugu
              </Link>
              <Link
                to="/category/tamil"
                className="hover:text-yellow-400 transition-colors"
              >
                Tamil
              </Link>
              <Link
                to="/category/malayalam"
                className="hover:text-yellow-400 transition-colors"
              >
                Malayalam
              </Link>
            </div>
          </nav>

          {/* ACCOUNT */}
          <nav aria-label="Account">
            <h3 className="text-white font-semibold mb-4 tracking-wide">
              Account
            </h3>

            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link to="/login" className="hover:text-yellow-400 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-400 transition-colors">
                Sign Up
              </Link>
              <Link to="/support" className="hover:text-yellow-400 transition-colors">
                Support
              </Link>
              <Link to="/settings" className="hover:text-yellow-400 transition-colors">
                Settings
              </Link>
            </div>
          </nav>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-white/50 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} CineVerse. All rights reserved.
          </p>

          <p className="text-white/40 text-xs text-center">
            Crafted with 🎬 by{" "}
            <span className="text-yellow-400 font-bold tracking-wide">
              pG-23
            </span>
          </p>

        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);