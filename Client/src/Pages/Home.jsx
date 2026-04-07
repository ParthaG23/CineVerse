import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

import {
  getTrending,
  getMoviesByGenre,
  searchContent,
  getTopRated,
  getPopular,
  clearCache,
} from "../services/tmdb";

import { useContent } from "../context/ContentContext";

import BannerCarousel from "../components/BannerCarousel";
import MovieRow from "../components/MovieRow";
import CategoryPills from "../components/CategoryPills";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import ErrorState from "../components/ErrorState";

/* GENRE MAP */

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

/* ANIMATION */

const containerVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const Home = () => {
  const { contentType, searchQuery } = useContent();

  const [bannerMovies, setBannerMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* CATEGORY LOADER */

  const loadCategoryMovies = useCallback(async (category, type, cancelled) => {
    try {
      setLoading(true);
      setError(null);

      let results = [];

      if (category === "Trending") {
        results = await getTrending(type);
        if (!cancelled.current) {
          setBannerMovies(results.slice(0, 5));
        }
      } else {
        const genreId = genreMap[category];
        results = await getMoviesByGenre(type, genreId);

        if (!cancelled.current) {
          setBannerMovies([]);
        }
      }

      if (!cancelled.current) {
        setMovies(results);
      }

    } catch (err) {
      console.error("Category Error:", err);

      if (!cancelled.current) {
        setMovies([]);
        setBannerMovies([]);
        setError(err);
      }

    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, []);

  /* EXTRA SECTIONS */

  const loadExtraSections = useCallback(async (type, cancelled) => {
    try {
      const [top, popular] = await Promise.all([
        getTopRated(type),
        getPopular(type),
      ]);

      if (!cancelled.current) {
        setTopMovies(top);
        setRecommended(popular);
      }

    } catch (err) {
      console.error("Extra Sections Error:", err);
    }
  }, []);

  /* SEARCH MODE */

  useEffect(() => {
    if (!searchQuery?.trim()) return;

    const cancelled = { current: false };

    const searchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await searchContent(contentType, searchQuery);

        if (!cancelled.current) {
          setMovies(results);
          setBannerMovies([]);
        }

      } catch (err) {
        console.error("Search Error:", err);

        if (!cancelled.current) {
          setMovies([]);
          setError(err);
        }

      } finally {
        if (!cancelled.current) setLoading(false);
      }
    };

    searchMovies();

    return () => {
      cancelled.current = true;
    };

  }, [searchQuery, contentType]);

  /* CATEGORY LOADING */

  useEffect(() => {
    if (searchQuery) return;

    const cancelled = { current: false };

    loadCategoryMovies(activeCategory, contentType, cancelled);

    return () => {
      cancelled.current = true;
    };

  }, [activeCategory, contentType, searchQuery, loadCategoryMovies]);

  /* EXTRA SECTIONS */

  useEffect(() => {
    if (searchQuery) return;

    const cancelled = { current: false };

    setTopMovies([]);
    setRecommended([]);

    loadExtraSections(contentType, cancelled);

    return () => {
      cancelled.current = true;
    };

  }, [contentType, searchQuery, loadExtraSections]);

  /* RETRY HANDLER */

  const handleRetry = useCallback(() => {
    clearCache();
    setError(null);
    setLoading(true);

    const cancelled = { current: false };

    if (searchQuery?.trim()) {
      searchContent(contentType, searchQuery)
        .then((results) => {
          if (!cancelled.current) {
            setMovies(results);
            setBannerMovies([]);
          }
        })
        .catch((err) => {
          if (!cancelled.current) {
            setMovies([]);
            setError(err);
          }
        })
        .finally(() => {
          if (!cancelled.current) setLoading(false);
        });
    } else {
      loadCategoryMovies(activeCategory, contentType, cancelled);
      loadExtraSections(contentType, cancelled);
    }
  }, [activeCategory, contentType, searchQuery, loadCategoryMovies, loadExtraSections]);

  return (
    <>
      {/* Banner */}
      {!searchQuery && bannerMovies.length > 0 && (
        <motion.div variants={containerVariant} initial="hidden" animate="visible">
          <BannerCarousel movies={bannerMovies} />
        </motion.div>
      )}

      {/* Category Pills */}
      {!searchQuery && (
        <motion.div
          className="px-4 lg:px-6 mt-4"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <CategoryPills
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </motion.div>
      )}

      {/* Main Movies */}
      {loading ? (
        <div className="px-6 mt-6 text-white">
          <SkeletonCardLoader />
        </div>
      ) : error ? (
        <ErrorState
          type="network"
          onRetry={handleRetry}
        />
      ) : movies.length > 0 ? (
        <motion.div
          className="px-6"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <MovieRow movies={movies} />
        </motion.div>
      ) : (
        <ErrorState
          type="empty"
          message="No results found for your search. Try different keywords."
          onRetry={handleRetry}
        />
      )}

      {/* Top Rated */}
      {!searchQuery && topMovies.length > 0 && (
        <motion.div
          className="px-6"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <MovieRow title="Top Rated" movies={topMovies} />
        </motion.div>
      )}

      {/* Recommended */}
      {!searchQuery && recommended.length > 0 && (
        <motion.div
          className="px-6"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <MovieRow title="Recommended For You" movies={recommended} />
        </motion.div>
      )}
    </>
  );
};

export default Home;