import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDetails,
  getVideos,
  getMovieCredits,
} from "../services/tmdb";
import { FaPlay } from "react-icons/fa";

// 🔥 Use smaller image for performance (NOT original)
const getBackdropUrl = (path) => {
  if (!path) return "";
  const isMobile = window.innerWidth < 640;
  const size = isMobile ? "w780" : "w1280";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState("");
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      try {
        setLoading(true);

        // 🚀 PARALLEL API CALLS (3x faster)
        const [details, videos, credits] = await Promise.all([
          getDetails(id),
          getVideos(id),
          getMovieCredits(id),
        ]);

        if (!isMounted) return;

        setMovie(details); // optimized tmdb returns data directly

        // 🎬 Trailer extraction (safe)
        const trailerVideo = videos?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailer(trailerVideo?.key || "");

        // 🎭 Top 10 cast (lightweight)
        setCast(credits?.cast?.slice(0, 10) || []);
      } catch (err) {
        console.error("Movie Details Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovie();

    return () => {
      isMounted = false; // prevent memory leaks
    };
  }, [id]);

  // 🎬 Skeleton Loader (Better UX than text)
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center mt-20 text-white">
        Failed to load movie details
      </div>
    );
  }

  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen text-white">
      {/* 🎬 OPTIMIZED BACKDROP (IMG instead of CSS bg) */}
      <div className="px-6 lg:px-16 pt-6">
        <div className="relative h-[60vh] lg:h-[75vh] rounded-3xl overflow-hidden">
          <img
            src={backdrop}
            alt={movie.title}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="relative z-10 p-6 lg:p-10 max-w-2xl flex flex-col justify-end h-full">
            <h1 className="text-3xl lg:text-5xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-4 text-white/80 line-clamp-4">
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

      {/* 🎬 MOVIE DETAILS */}
      <div className="px-6 lg:px-16 pb-16 pt-14">
        <h2 className="text-2xl font-semibold mb-6">
          Movie Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl">
          <DetailItem label="Status" value={movie.status} />
          <DetailItem label="Release Date" value={movie.release_date} />
          <DetailItem label="Runtime" value={`${movie.runtime} min`} />
          <DetailItem
            label="Language"
            value={movie.original_language?.toUpperCase()}
          />
          <DetailItem
            label="Genres"
            value={movie.genres?.map((g) => g.name).join(", ")}
          />
          <DetailItem
            label="Rating"
            value={`⭐ ${movie.vote_average?.toFixed(1)} / 10`}
          />
          <DetailItem
            label="Budget"
            value={`$${movie.budget?.toLocaleString()}`}
          />
          <DetailItem
            label="Revenue"
            value={`$${movie.revenue?.toLocaleString()}`}
          />
          <DetailItem
            label="Production"
            value={movie.production_companies
              ?.map((c) => c.name)
              .slice(0, 2)
              .join(", ")}
          />
        </div>
      </div>

      {/* 🎭 STAR CAST (Lazy Images = Huge Performance Gain) */}
      <div className="px-6 lg:px-16 pb-20">
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
                    : "/placeholder.png"
                }
                alt={actor.name}
                loading="lazy"
                decoding="async"
                className="w-32 h-40 object-cover rounded-xl bg-white/5"
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

// 💎 Reusable Detail Component (reduces re-renders)
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-white/50 text-sm">{label}</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

export default MovieDetails;
