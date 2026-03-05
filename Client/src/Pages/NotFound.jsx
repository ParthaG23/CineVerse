import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiFilmSlateBold } from "react-icons/pi";

const NotFound = () => {
return ( <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-6">


  {/* Cinematic Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]" />

  {/* Floating Glow */}
  <div className="absolute w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px] top-[-200px] right-[-200px]" />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="
      relative z-10
      text-center
      max-w-xl
    "
  >
    {/* Film Icon */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      className="flex justify-center mb-6"
    >
      <PiFilmSlateBold
        size={70}
        className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.9)]"
      />
    </motion.div>

    {/* 404 Title */}
    <h1 className="text-[90px] sm:text-[120px] font-black text-white leading-none tracking-wider">
      404
    </h1>

    {/* Subtitle */}
    <h2 className="text-xl sm:text-2xl text-white font-semibold mt-4">
      Scene Not Found
    </h2>

    {/* Description */}
    <p className="text-white/60 mt-3 text-sm sm:text-base">
      Looks like this scene has been removed from the reel.
      The page you're looking for doesn't exist.
    </p>

    {/* Actions */}
    <div className="flex justify-center gap-4 mt-8 flex-wrap">

      <Link
        to="/"
        className="
          px-6 py-3
          bg-yellow-400 text-black
          rounded-full
          font-semibold
          hover:bg-yellow-300
          transition
          shadow-lg shadow-yellow-400/30
        "
      >
        Back to Home
      </Link>

      <Link
        to="/search"
        className="
          px-6 py-3
          border border-white/20
          rounded-full
          text-white
          hover:bg-white/10
          transition
        "
      >
        Explore Movies
      </Link>

    </div>

    {/* Small footer line */}
    <p className="text-white/40 text-xs mt-10 tracking-wider">
      CineVerse • Your Cinematic Streaming Experience
    </p>
  </motion.div>
</div>


);
};

export default NotFound;
