import { useRef, useState, useEffect, memo, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies = [] }) => {
  const rowRef = useRef(null);
  const frameRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  /* SCROLL DISTANCE (responsive) */
  const getScrollAmount = useCallback(() => {
    const el = rowRef.current;
    if (!el) return 400;
    return el.clientWidth * 0.8;
  }, []);

  /* SCROLL ACTION */
  const scroll = useCallback((dir) => {
    const el = rowRef.current;
    if (!el) return;

    const amount = getScrollAmount();

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, [getScrollAmount]);

  /* SCROLL STATE UPDATE (throttled) */
  const handleScroll = useCallback(() => {
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      const el = rowRef.current;
      if (!el) return;

      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

      frameRef.current = null;
    });
  }, []);

  /* ATTACH SCROLL LISTENER */
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [handleScroll, movies.length]);

  if (!movies.length) return null;

  return (
    <section className="mt-10 relative group">
      {title && (
        <h2 className="text-xl font-semibold mb-4 px-2 text-white">
          {title}
        </h2>
      )}

      {/* LEFT ARROW */}
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

      {/* MOVIE LIST */}
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

      {/* RIGHT ARROW */}
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

export default memo(MovieRow);