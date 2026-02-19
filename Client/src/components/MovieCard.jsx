import { Link } from "react-router-dom";

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex-shrink-0"
    >
      <div className="w-[130px] sm:w-[150px] lg:w-[180px] transition hover:scale-105">
        <img
          src={`${IMAGE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="rounded-2xl h-[190px] sm:h-[220px] lg:h-[260px] w-full object-cover"
        />

        <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white line-clamp-1">
          {movie.title || movie.name}
        </h3>

        <p className="text-xs text-yellow-400 mt-1">
          ⭐ {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
