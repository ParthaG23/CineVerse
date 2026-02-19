import { PiFilmSlateBold } from "react-icons/pi";

const CineLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* 🎬 Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]" />

      {/* 🎥 Loader Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        
        {/* 🎞 Spinning Film Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl bg-yellow-400/20 animate-pulse" />
          
          <PiFilmSlateBold
            size={64}
            className="
              text-yellow-400
              animate-spin
              drop-shadow-[0_0_20px_rgba(250,204,21,0.9)]
            "
            style={{ animationDuration: "2.5s" }}
          />
        </div>

        {/* 🎬 Brand Text */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-white">
          Loading <span className="text-yellow-400">CineVerse</span>
        </h2>

        {/* 🍿 Animated Dots */}
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
        </div>

        {/* 🎥 Subtitle */}
        <p className="text-white/50 text-sm tracking-wide">
          Preparing your cinematic experience...
        </p>
      </div>
    </div>
  );
};

export default CineLoader;
