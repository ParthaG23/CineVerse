import { useEffect, useState, useRef, useMemo, memo } from "react";
import Banner from "./Banner";

const AUTO_TIME = 6000;

const BannerCarousel = ({ movies = [] }) => {
  const [index, setIndex] = useState(0);

  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const isVisibleRef = useRef(true);

  /* SAFETY: ensure array reference stability */
  const safeMovies = useMemo(() => movies ?? [], [movies]);

  /* CURRENT MOVIE MEMO */
  const currentMovie = useMemo(() => {
    if (!safeMovies.length) return null;
    return safeMovies[index];
  }, [safeMovies, index]);

  /* AUTO SLIDE */
  useEffect(() => {
    if (!safeMovies.length) return;

    const startInterval = () => {
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!isVisibleRef.current) return;

        setIndex((prev) => (prev + 1) % safeMovies.length);
      }, AUTO_TIME);
    };

    startInterval();

    return () => clearInterval(intervalRef.current);
  }, [safeMovies.length]);

  /* RESET INDEX WHEN MOVIE LIST CHANGES */
  useEffect(() => {
    setIndex(0);
  }, [safeMovies]);

  /* PAUSE WHEN TAB NOT VISIBLE */
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* PAUSE WHEN CAROUSEL NOT IN VIEWPORT */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  if (!safeMovies.length) return null;

  return (
    <div ref={containerRef} className="w-full relative">
      {/* BANNER */}
      <Banner movie={currentMovie} />

      {/* DOT NAVIGATION */}
      {safeMovies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {safeMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-yellow-400"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(BannerCarousel);