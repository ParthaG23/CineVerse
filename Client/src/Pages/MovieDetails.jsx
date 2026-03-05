
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetails, getVideos, getMovieCredits } from "../services/tmdb";
import { FaPlay } from "react-icons/fa";

/* IMAGE SIZE OPTIMIZATION */
const getBackdropUrl = (path) => {
  if (!path) return "";
  const size = window.innerWidth < 640 ? "w780" : "w1280";
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
    let cancelled = false;

    const fetchMovie = async () => {
      try {
        setLoading(true);

        const [details, videos, credits] = await Promise.all([
          getDetails(id),
          getVideos(id),
          getMovieCredits(id),
        ]);

        if (cancelled) return;

        setMovie(details || null);

        /* TRAILER FALLBACK SYSTEM */
        const trailerVideo =
          videos?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos?.find((v) => v.type === "Teaser" && v.site === "YouTube") ||
          videos?.find((v) => v.site === "YouTube");

        setTrailer(trailerVideo?.key || "");

        setCast(credits?.cast?.slice(0, 10) || []);
      } catch (err) {
        console.error("Movie Details Error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovie();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ERROR STATE */
  if (!movie) {
    return (
      <div className="text-center mt-20 text-white">
        Failed to load movie details
      </div>
    );
  }

  const backdrop = getBackdropUrl(movie.backdrop_path);

  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";
  const genres = movie.genres?.map((g) => g.name).join(", ");
  const production = movie.production_companies
    ?.map((c) => c.name)
    .slice(0, 2)
    .join(", ");

  return (
    <div className="min-h-screen text-white">

      {/* HERO SECTION */}
      <div className="px-6 lg:px-16 pt-6">
        <div className="relative h-[60vh] lg:h-[75vh] rounded-3xl overflow-hidden">

          <img
            src={backdrop}
            alt={movie.title}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="relative z-10 p-6 lg:p-10 max-w-2xl flex flex-col justify-end h-full">

            <h1 className="text-3xl lg:text-5xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-4 text-white/80 line-clamp-4">
              {movie.overview}
            </p>

            {/* TRAILER BUTTON */}
            {trailer ? (
              <Link to={`/player/${trailer}`}>
                <button className="mt-6 flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
                  <FaPlay />
                  Watch Trailer
                </button>
              </Link>
            ) : (
              <button className="mt-6 flex items-center gap-3 bg-gray-600 text-white px-6 py-3 rounded-full cursor-not-allowed">
                <FaPlay />
                Trailer Not Available
              </button>
            )}

          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-6 lg:px-16 pb-16 pt-14">

        <h2 className="text-2xl font-semibold mb-6">
          Movie Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl">

          <DetailItem label="Status" value={movie.status} />
          <DetailItem label="Release Date" value={movie.release_date} />
          <DetailItem label="Runtime" value={runtime} />

          <DetailItem
            label="Language"
            value={movie.original_language?.toUpperCase()}
          />

          <DetailItem label="Genres" value={genres} />

          <DetailItem
            label="Rating"
            value={`⭐ ${movie.vote_average?.toFixed(1)} / 10`}
          />

          <DetailItem
            label="Budget"
            value={
              movie.budget
                ? `$${movie.budget.toLocaleString()}`
                : "N/A"
            }
          />

          <DetailItem
            label="Revenue"
            value={
              movie.revenue
                ? `$${movie.revenue.toLocaleString()}`
                : "N/A"
            }
          />

          <DetailItem label="Production" value={production} />

        </div>
      </div>

      {/* CAST */}
      <div className="px-6 lg:px-16 pb-20">

        <h2 className="text-2xl font-semibold mb-6">
          Star Cast
        </h2>

        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">

          {cast.map((actor) => (
            <div
              key={actor.id}
              className="w-32 flex-shrink-0 text-center"
            >

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

/* DETAIL ITEM COMPONENT */
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-white/50 text-sm">{label}</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

export default MovieDetails;

