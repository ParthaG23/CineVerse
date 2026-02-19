import { useRef, useState, useEffect, memo, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies = [] }) => {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // 🎯 Dynamic scroll distance (responsive)
  const getScrollAmount = () => {
    if (!rowRef.current) return 400;
    return rowRef.current.clientWidth * 0.8; // 80% of visible width
  };

  // 🚀 Optimized scroll handler (memoized)
  const scroll = useCallback((dir) => {
    if (!rowRef.current) return;

    const amount = getScrollAmount();

    rowRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  // 🧠 Show/hide arrows based on scroll position (UX + performance)
  const handleScroll = () => {
    const el = rowRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  // 🔄 Attach scroll listener (passive = better performance)
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    handleScroll(); // initial check
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [movies]);

  if (!movies.length) return null;

  return (
    <section className="mt-10 relative group">
      {/* 🎬 TITLE */}
      {title && (
        <h2 className="text-xl font-semibold mb-4 px-2 text-white">
          {title}
        </h2>
      )}

      {/* ⬅️ LEFT ARROW (Hidden at start) */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="
            hidden lg:flex items-center justify-center 
            absolute left-2 top-1/2 -translate-y-1/2 z-20
            bg-black/60 hover:bg-black/80 backdrop-blur-md 
            p-3 rounded-full 
            opacity-0 group-hover:opacity-100 
            transition-all duration-200
          "
        >
          <FiChevronLeft size={24} className="text-white" />
        </button>
      )}

      {/* 🎞 MOVIE SCROLL CONTAINER */}
      <div
        ref={rowRef}
        className="
          flex gap-4 
          overflow-x-auto 
          no-scrollbar 
          scroll-smooth 
          snap-x snap-mandatory
          px-2 lg:px-8
          will-change-scroll
        "
      >
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* ➡️ RIGHT ARROW (Hidden at end) */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="
            hidden lg:flex items-center justify-center 
            absolute right-2 top-1/2 -translate-y-1/2 z-20
            bg-black/60 hover:bg-black/80 backdrop-blur-md 
            p-3 rounded-full 
            opacity-0 group-hover:opacity-100 
            transition-all duration-200
          "
        >
          <FiChevronRight size={24} className="text-white" />
        </button>
      )}
    </section>
  );
};

// 🧠 Prevent unnecessary re-renders (VERY important for many rows)
export default memo(MovieRow);
