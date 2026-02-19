import { useEffect, useState, useRef, useMemo } from "react";
import Banner from "./Banner";

const BannerCarousel = ({ movies = [] }) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // 🎬 Memoize movies to prevent unnecessary re-renders
  const safeMovies = useMemo(() => movies || [], [movies]);

  // 🚀 Auto Slide (Optimized & Pausable)
  useEffect(() => {
    if (!safeMovies.length) return;

    // Clear existing interval first (important)
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeMovies.length);
    }, 6000); // 6s cinematic timing

    return () => clearInterval(intervalRef.current);
  }, [safeMovies.length]);

  // 🎯 Reset index if movie list changes
  useEffect(() => {
    setIndex(0);
  }, [safeMovies]);

  // ⛔ Safety guard
  if (!safeMovies.length) return null;

  const currentMovie = safeMovies[index];

  return (
    <div className="w-full relative">
      {/* 🎬 Banner (Only re-renders when index changes) */}
      <Banner movie={currentMovie} />

      {/* 🔘 Indicator Dots (Lightweight + UX boost) */}
      {safeMovies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {safeMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-yellow-400"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
