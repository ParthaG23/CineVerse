import { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import ErrorState from "../components/ErrorState";
import { getTrending, clearCache } from "../services/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async (cancelled) => {
    try {
      setLoading(true);
      setError(null);

      const results = await getTrending("movie");

      if (!cancelled?.current) {
        setMovies(results || []);
      }
    } catch (err) {
      console.error("Movies Fetch Error:", err);
      if (!cancelled?.current) {
        setMovies([]);
        setError(err);
      }
    } finally {
      if (!cancelled?.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cancelled = { current: false };
    fetchMovies(cancelled);

    return () => {
      cancelled.current = true;
    };
  }, [fetchMovies]);

  const handleRetry = () => {
    clearCache();
    setError(null);
    fetchMovies({ current: false });
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl mb-4 text-white font-semibold">
        Trending Movies
      </h1>

      {loading && <SkeletonCardLoader count={12} />}

      {!loading && error && (
        <ErrorState
          type="network"
          onRetry={handleRetry}
        />
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <ErrorState
          type="empty"
          message="No movies found. Try again later."
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default Movies;