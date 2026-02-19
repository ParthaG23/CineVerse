import { Link } from "react-router-dom";
import { PiFilmSlateBold } from "react-icons/pi";
import { memo } from "react";

const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="Go to homepage"
      className="
        flex items-center gap-2 sm:gap-3 
        group select-none
      "
    >
      {/* 🎞 Icon */}
      <PiFilmSlateBold
        size={34}
        className="
          text-yellow-400
          transition-transform duration-300
          group-hover:scale-110 group-hover:rotate-6
          drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]
          will-change-transform
        "
      />

      {/* 🎬 Brand Text */}
      <span
        className="
          text-white font-extrabold 
          text-xl sm:text-2xl 
          tracking-wide
          transition-all duration-300
          group-hover:text-yellow-400
        "
      >
        Cine<span className="text-yellow-400">Verse</span>
      </span>
    </Link>
  );
};

// 🧠 Prevent unnecessary re-renders (used in Sidebar + TopBars)
export default memo(Logo);
