import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="px-6 lg:px-10 py-12">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* LOGO + ABOUT */}
          <div>
            <Logo />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              Watch trending movies, anime, web series and regional content in
              one place. Your personal OTT streaming platform.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-6">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/70 hover:bg-yellow-400 hover:text-black transition cursor-pointer"
                  >
                    <Icon size={18} />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* BROWSE */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse</h3>
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
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
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
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <Link to="/login" className="hover:text-yellow-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-400 transition">
                Sign Up
              </Link>
              <span className="hover:text-yellow-400 transition cursor-pointer">
                Support
              </span>
              <span className="hover:text-yellow-400 transition cursor-pointer">
                Settings
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} CineVerse. All rights reserved.
          </p>

          <p className="text-white/40 text-xs">
            A creation by{" "}
            <span
              className="text-yellow-400 font-bold tracking-wide 
  drop-shadow-[0_0_10px_rgba(250,204,21,1)]"
            >
              pG-23
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
