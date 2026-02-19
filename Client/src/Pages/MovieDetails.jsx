import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
 getDetails,
 getVideos,
  getMovieCredits,
} from "../services/tmdb";
import { FaPlay } from "react-icons/fa";

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState("");
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await getDetails(id);
      setMovie(res.data);

      const videoRes = await getVideos(id);
      const trailerVideo = videoRes.data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailer(trailerVideo?.key);

      const creditRes = await getMovieCredits(id);
      setCast(creditRes.data.cast.slice(0, 10)); // Top 10 cast
    };

    fetchMovie();
  }, [id]);

  if (!movie)
    return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen text-white">

      {/* 🎬 BACKDROP SECTION */}
      <div className="px-6 lg:px-16 pt-6">
        <div
          className="relative h-[75vh] rounded-3xl overflow-hidden bg-cover bg-center flex items-end"
          style={{
            backgroundImage: `url(${IMAGE_URL}${movie.backdrop_path})`,
          }}
        >
          {/* Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="relative z-10 p-10 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-4 text-white/80">
              {movie.overview}
            </p>

            {trailer && (
              <Link to={`/player/${trailer}`}>
                <button className="mt-6 flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
                  <FaPlay />
                  Watch Trailer
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* 🎬 MOVIE DETAILS SECTION */}
<div className="px-6 lg:px-16 pb-16 pt-20" >
  <h2 className="text-2xl font-semibold mb-6">
    Movie Details
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl">

    <div>
      <p className="text-white/50 text-sm">Status</p>
      <p className="font-medium">{movie.status}</p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Release Date</p>
      <p className="font-medium">{movie.release_date}</p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Runtime</p>
      <p className="font-medium">{movie.runtime} min</p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Language</p>
      <p className="font-medium">
        {movie.original_language?.toUpperCase()}
      </p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Genres</p>
      <p className="font-medium">
        {movie.genres?.map(g => g.name).join(", ")}
      </p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Rating</p>
      <p className="font-medium">
        ⭐ {movie.vote_average?.toFixed(1)} / 10
      </p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Budget</p>
      <p className="font-medium">
        ${movie.budget?.toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Revenue</p>
      <p className="font-medium">
        ${movie.revenue?.toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-white/50 text-sm">Production</p>
      <p className="font-medium">
        {movie.production_companies
          ?.map(c => c.name)
          .slice(0, 2)
          .join(", ")}
      </p>
    </div>

  </div>
</div>


      {/* 🎭 STAR CAST SECTION */}
      <div className="px-6 lg:px-16  ">
        <h2 className="text-2xl font-semibold mb-6">
          Star Cast
        </h2>

        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {cast.map((actor) => (
            <div key={actor.id} className="w-32 flex-shrink-0 text-center">
              <img
                src={
                  actor.profile_path
                    ? `${IMAGE_URL}${actor.profile_path}`
                    : "https://via.placeholder.com/150"
                }
                alt={actor.name}
                className="w-32 h-40 object-cover rounded-xl"
              />
              <p className="mt-2 text-sm font-medium">
                {actor.name}
              </p>
              <p className="text-xs text-white/50">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MovieDetails;
