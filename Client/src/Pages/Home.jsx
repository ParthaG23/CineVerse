import { useEffect, useState, useCallback } from "react";
import {
  getTrending,
  getMoviesByGenre,
  searchContent,
  getTopRated,
  getPopular,
} from "../services/tmdb";
import { useContent } from "../context/ContentContext";

import BannerCarousel from "../components/BannerCarousel";
import MovieRow from "../components/MovieRow";
import CategoryPills from "../components/CategoryPills";
import SkeletonCardLoader from "../components/SkeletonCardLoader";


const genreMap = {
  Trending: null,
  Action: 28,
  Adventure: 12,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
};

const Home = () => {
  const { contentType, searchQuery } = useContent();

  const [bannerMovies, setBannerMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [loading, setLoading] = useState(true);

  // 🎬 OPTIMIZED: Category Loader (NO extra re-renders)
  const loadCategoryMovies = useCallback(async (category, type) => {
    try {
      setLoading(true);

      let results = [];

      if (category === "Trending") {
        results = await getTrending(type);
        setBannerMovies(results.slice(0, 5));
      } else {
        const genreId = genreMap[category];
        results = await getMoviesByGenre(type, genreId);
        setBannerMovies([]); // hide banner on genre
      }

      setMovies(results);
    } catch (err) {
      console.error("Category Error:", err);
      setMovies([]);
      setBannerMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⭐ OPTIMIZED: Load extra sections AFTER main content (improves LCP)
  const loadExtraSections = useCallback(async (type) => {
    try {
      // Delay non-critical content (BIG Lighthouse boost)
      setTimeout(async () => {
        const [top, popular] = await Promise.all([
          getTopRated(type),
          getPopular(type),
        ]);

        setTopMovies(top);
        setRecommended(popular);
      }, 800); // defer heavy sections
    } catch (err) {
      console.error("Extra Sections Error:", err);
    }
  }, []);

  // 🔍 MAIN DATA CONTROLLER (Optimized)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // SEARCH MODE (highest priority)
      if (searchQuery && searchQuery.trim() !== "") {
        try {
          setLoading(true);
          const results = await searchContent(contentType, searchQuery);

          if (!isMounted) return;
          setMovies(results);
          setBannerMovies([]);
        } catch (err) {
          console.error("Search Error:", err);
          if (isMounted) setMovies([]);
        } finally {
          if (isMounted) setLoading(false);
        }
        return;
      }

      // NORMAL MODE (faster)
      await loadCategoryMovies(activeCategory, contentType);
      loadExtraSections(contentType); // load secondary sections lazily
    };

    loadData();

    return () => {
      isMounted = false; // prevent memory leaks & extra renders
    };
  }, [contentType, activeCategory, searchQuery, loadCategoryMovies, loadExtraSections]);

  return (
    <>
      {/* 🎬 BANNER (Critical Content First) */}
      {!searchQuery && bannerMovies.length > 0 && (
        <BannerCarousel movies={bannerMovies} />
      )}

      {/* 🏷️ CATEGORY PILLS */}
      {!searchQuery && (
        <div className="px-4 lg:px-6 mt-4">
          <CategoryPills
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      )}

      {/* 🎥 MAIN MOVIES (Priority Section) */}
      {loading ? (
        <div className="px-6 mt-6 text-white animate-pulse">
          <SkeletonCardLoader/>
        </div>
      ) : movies.length > 0 ? (
        <MovieRow movies={movies} />
      ) : (
        <p className="text-white px-6 mt-6">No results found</p>
      )}

      {/* ⭐ NON-CRITICAL SECTIONS (Lazy Loaded) */}
      {!searchQuery && topMovies.length > 0 && (
        <MovieRow title="Top Rated" movies={topMovies} />
      )}

      {!searchQuery && recommended.length > 0 && (
        <MovieRow title="Recommended For You" movies={recommended} />
      )}
    </>
  );
};

export default Home;
