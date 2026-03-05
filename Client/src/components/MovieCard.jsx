import { Link } from "react-router-dom";
import { useState, useMemo, memo } from "react";
import { Star } from "lucide-react";

/* TMDB IMAGE BASE */
const IMAGE_BASE = "https://image.tmdb.org/t/p";

/* RESPONSIVE IMAGE URLS */
const getPosterUrls = (path) => {
  if (!path) return {};

  return {
    small: `${IMAGE_BASE}/w342${path}`,
    medium: `${IMAGE_BASE}/w500${path}`,
    large: `${IMAGE_BASE}/w780${path}`,
  };
};

const MovieCard = ({ movie }) => {
  const title = movie.title || movie.name || "Untitled";

  /* MEMOIZED YEAR */
  const year = useMemo(() => {
    const date = movie.release_date || movie.first_air_date;
    return date ? date.slice(0, 4) : "";
  }, [movie.release_date, movie.first_air_date]);

  /* MEMOIZED POSTER URLS */
  const poster = useMemo(
    () => getPosterUrls(movie.poster_path),
    [movie.poster_path],
  );

  const [imgSrc, setImgSrc] = useState(poster.medium || "/placeholder.png");

  return (
    <Link to={`/movie/${movie.id}`} className="flex-shrink-0 group">
      <div className="relative w-[130px] sm:w-[150px] lg:w-[180px]">
        {/* POSTER */}
        <img
          src={imgSrc}
          srcSet={`
            ${poster.small} 342w,
            ${poster.medium} 500w,
            ${poster.large} 780w
          `}
          sizes="(max-width:640px) 130px, (max-width:1024px) 150px, 180px"
          alt={title}
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc("/placeholder.png")}
          className="
            rounded-2xl
            h-[190px] sm:h-[220px] lg:h-[260px]
            w-full
            object-cover
            bg-white/5
            transition-transform duration-300
            group-hover:scale-[1.04]
          "
        />

        {/* HOVER OVERLAY */}
        <div
          className="
            absolute inset-0 rounded-2xl
            bg-gradient-to-t from-black/80 via-black/30 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none
          "
        />

        {/* RATING */}
        {movie.vote_average > 0 && (
          <div
            className="
    absolute top-2 right-2
    flex items-center gap-1
    bg-black/70 backdrop-blur
    text-yellow-400 text-xs
    px-2 py-1 rounded-md
    font-semibold
  "
          >
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white line-clamp-1">
        {title}
      </h3>

      {/* YEAR */}
      {year && <p className="text-xs text-white/60 mt-1">{year}</p>}
    </Link>
  );
};

export default memo(MovieCard);
