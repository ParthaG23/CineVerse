import { Link } from "react-router-dom";
import { useState } from "react";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_URL;

// Use smaller image for mobile (BIG performance boost)
const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";

  const isMobile = window.innerWidth < 640;
  const size = isMobile ? "w342" : "w500"; // mobile optimized

  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const MovieCard = ({ movie }) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(movie.poster_path));

  return (
    <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
      <div className="w-[130px] sm:w-[150px] lg:w-[180px] transition-transform duration-300 hover:scale-105">
        <img
          src={imgSrc}
          alt={movie.title || movie.name}
          loading="lazy"                // 🔥 HUGE performance boost
          decoding="async"              // ⚡ faster rendering
          onError={() => setImgSrc("/placeholder.png")} // fallback image
          className="rounded-2xl h-[190px] sm:h-[220px] lg:h-[260px] w-full object-cover bg-white/5"
        />

        <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white line-clamp-1">
          {movie.title || movie.name}
        </h3>

        <p className="text-xs text-yellow-400 mt-1">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
