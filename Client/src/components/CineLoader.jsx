import { PiFilmSlateBold } from "react-icons/pi";
import { memo } from "react";

const CineLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />

      {/* Subtle Glow (lighter for performance) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.06),transparent_60%)]" />

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* Film Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-yellow-400/15 blur-xl animate-pulse" />

          <PiFilmSlateBold
            size={60}
            className="
              text-yellow-400
              animate-spin
              motion-reduce:animate-none
              drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]
            "
            style={{ animationDuration: "2.5s" }}
          />
        </div>

        {/* Brand */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-white">
          Loading <span className="text-yellow-400">CineVerse</span>
        </h2>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
        </div>

        {/* Subtitle */}
        <p className="text-white/50 text-sm tracking-wide">
          Preparing your cinematic experience...
        </p>

      </div>
    </div>
  );
};

export default memo(CineLoader);