import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import { getTrending } from "../services/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevents memory leaks

    const fetchMovies = async () => {
      try {
        setLoading(true);

        // 🚀 Optimized service (already cached & faster)
        const results = await getTrending("movie");

        if (!isMounted) return;
        setMovies(results || []);
      } catch (error) {
        console.error("Movies Fetch Error:", error);
        if (isMounted) setMovies([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted = false; // cleanup for performance
    };
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl mb-4 text-white font-semibold">
        Trending Movies
      </h1>

      {/* 🎬 Skeleton Loader (Better UX + Performance) */}
      {loading ? (
        <SkeletonCardLoader count={12} />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-white/70 mt-6">No movies found</p>
      )}
    </div>
  );
};

export default Movies;
