import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

/* IMAGE SIZE OPTIMIZATION */
const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";

  const width = window.innerWidth;

  let size = "w500";

  if (width < 640) size = "w342";        // mobile
  else if (width < 1024) size = "w500";  // tablet
  else size = "w780";                    // desktop

  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const MovieCard = ({ movie }) => {
  const title = movie.title || movie.name || "Untitled";
  const year = useMemo(() => {
    const date = movie.release_date || movie.first_air_date;
    return date ? date.slice(0, 4) : "";
  }, [movie]);

  const [imgSrc, setImgSrc] = useState(getImageUrl(movie.poster_path));

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex-shrink-0 group"
    >
      <div className="relative w-[130px] sm:w-[150px] lg:w-[180px] transition-transform duration-300 group-hover:scale-105">

        {/* POSTER */}
        <img
          src={imgSrc}
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
            transition-all
          "
        />

        {/* PREMIUM HOVER OVERLAY */}
        <div className="
          absolute inset-0 rounded-2xl
          bg-gradient-to-t from-black/80 via-black/30 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        " />

        {/* RATING BADGE */}
        {movie.vote_average > 0 && (
          <div className="
            absolute top-2 right-2
            bg-black/70 backdrop-blur
            text-yellow-400 text-xs
            px-2 py-1 rounded-md
            font-semibold
          ">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white line-clamp-1">
        {title}
      </h3>

      {/* YEAR */}
      {year && (
        <p className="text-xs text-white/60 mt-1">
          {year}
        </p>
      )}
    </Link>
  );
};

export default MovieCard;