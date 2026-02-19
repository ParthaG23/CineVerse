import { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import { getTrendingMovies } from "../services/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await getTrendingMovies();
      setMovies(res.data.results);
    };
    fetchMovies();
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl mb-4">Trending Movies</h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
