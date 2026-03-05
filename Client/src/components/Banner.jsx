import { useNavigate } from "react-router-dom";
import { FiPlay, FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { useState, useMemo, memo } from "react";
import { getVideos } from "../services/tmdb";
import { useContent } from "../context/ContentContext";

/* IMAGE URL HELPER */
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const getBackdropUrls = (path) => {
  if (!path) return {};

  return {
    small: `${IMAGE_BASE}/w780${path}`,
    large: `${IMAGE_BASE}/w1280${path}`,
  };
};

const Banner = ({ movie }) => {
  const navigate = useNavigate();
  const { contentType } = useContent();
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  /* MEMOIZED IMAGE URLS */
  const backdrop = useMemo(
    () => getBackdropUrls(movie?.backdrop_path),
    [movie?.backdrop_path]
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
        {/* HERO IMAGE (LCP optimized) */}
        <img
          src={backdrop.large}
          srcSet={`${backdrop.small} 780w, ${backdrop.large} 1280w`}
          sizes="(max-width: 640px) 780px, 1280px"
          alt={movie.title || movie.name}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* PREMIUM GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

        {/* MENU DOTS */}
        <FiMoreHorizontal
          className="absolute top-4 right-4 text-white/70"
          size={22}
        />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-10 max-w-xl">
          <h2 className="text-white text-xl lg:text-3xl font-bold mb-2 line-clamp-1">
            {movie.title || movie.name}
          </h2>

          <p className="text-white/80 text-sm mb-4 line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            {/* TRAILER BUTTON */}
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

            {/* FAVORITE BUTTON */}
            <button
              className="
                w-10 h-10 rounded-full
                bg-black/40 backdrop-blur-md
                flex items-center justify-center
                text-white hover:bg-black/60
                transition
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

export default memo(Banner);