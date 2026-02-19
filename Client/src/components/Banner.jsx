import { useNavigate } from "react-router-dom";
import { FiPlay, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { useState, useMemo } from "react";
import { getVideos } from "../services/tmdb";
import { useContent } from "../context/ContentContext";

// 🔥 Dynamic image size (CRITICAL FIX)
const getBackdropUrl = (path) => {
  if (!path) return "";

  const isMobile = window.innerWidth < 640;
  const size = isMobile ? "w780" : "w1280"; // instead of original (huge)

  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const Banner = ({ movie }) => {
  const navigate = useNavigate();
  const { contentType } = useContent();
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  // ✅ Memoized backdrop (prevents re-renders)
  const backdrop = useMemo(
    () => getBackdropUrl(movie?.backdrop_path),
    [movie]
  );

  const handleTrailer = async () => {
    if (!movie?.id || loadingTrailer) return;

    try {
      setLoadingTrailer(true);

      const results = await getVideos(movie.id, contentType);
      const trailer = results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      if (trailer) {
        navigate(`/player/${trailer.key}`);
      }
    } catch (err) {
      console.error("Trailer error:", err);
    } finally {
      setLoadingTrailer(false);
    }
  };

  if (!movie) return null;

  return (
    <div className="px-4 lg:px-6 mt-2 lg:mt-4">
      <div
        className="
          relative 
          w-full max-w-6xl mx-auto
          h-[200px] sm:h-[240px] lg:h-[360px]
          rounded-3xl overflow-hidden
          bg-black/20
        "
      >
        {/* 🔥 Optimized Backdrop Image */}
        <img
          src={backdrop}
          alt={movie.title || movie.name}
          loading="eager"        // LCP optimization (hero section)
          fetchPriority="high"   // improves Lighthouse LCP
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

        {/* DOTS */}
        <FiMoreHorizontal
          className="absolute top-4 right-4 text-white/70"
          size={22}
        />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-10 max-w-xl">
          <h2 className="text-white text-xl lg:text-3xl font-bold mb-2">
            {movie.title || movie.name}
          </h2>

          <p className="text-white/80 text-sm mb-4 line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            {/* 🚀 Optimized Trailer Button */}
            <button
              onClick={handleTrailer}
              disabled={loadingTrailer}
              className="
                flex items-center gap-2
                bg-white text-black
                px-5 py-2.5 rounded-full
                text-sm font-semibold
                hover:bg-gray-200 transition
                disabled:opacity-70
              "
            >
              <FiPlay />
              {loadingTrailer ? "Loading..." : "Play trailer"}
            </button>

            <button
              className="
                w-10 h-10 rounded-full
                bg-black/40 backdrop-blur-md
                flex items-center justify-center
                text-white hover:bg-black/60
              "
            >
              <FiHeart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
