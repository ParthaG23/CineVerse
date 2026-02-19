import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (!rowRef.current) return;

    rowRef.current.scrollBy({
      left: dir === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mt-10 relative group">
      {/* TITLE */}
      {title && (
        <h2 className="text-xl font-semibold mb-4 px-2 text-white">
          {title}
        </h2>
      )}

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        className="hidden lg:flex items-center justify-center 
        absolute left-2 top-1/2 -translate-y-1/2 z-20
        bg-black/60 hover:bg-black/80 backdrop-blur-md 
        p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <FiChevronLeft size={24} className="text-white" />
      </button>

      {/* MOVIE LIST (SCROLL CONTAINER) */}
      <div
        ref={rowRef}
        className="
          flex gap-4 
          overflow-x-auto 
          no-scrollbar 
          scroll-smooth 
          snap-x snap-mandatory
          px-2 lg:px-8
        "
      >
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        className="hidden lg:flex items-center justify-center 
        absolute right-2 top-1/2 -translate-y-1/2 z-20
        bg-black/60 hover:bg-black/80 backdrop-blur-md 
        p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <FiChevronRight size={24} className="text-white" />
      </button>
    </div>
  );
};

export default MovieRow;
