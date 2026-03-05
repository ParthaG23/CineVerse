import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

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

const containerVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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
        setBannerMovies([]);
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

  const loadExtraSections = useCallback(async (type) => {
    try {
      const [top, popular] = await Promise.all([
        getTopRated(type),
        getPopular(type),
      ]);

      setTopMovies(top);
      setRecommended(popular);
    } catch (err) {
      console.error("Extra Sections Error:", err);
    }
  }, []);

  // 🔍 Search
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery || searchQuery.trim() === "") return;

      try {
        setLoading(true);
        const results = await searchContent(contentType, searchQuery);

        setMovies(results);
        setBannerMovies([]);
      } catch (err) {
        console.error("Search Error:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [searchQuery, contentType]);

  // 🎬 Category loader
  useEffect(() => {
    if (searchQuery) return;

    loadCategoryMovies(activeCategory, contentType);
  }, [activeCategory, contentType, searchQuery, loadCategoryMovies]);

  // ⭐ Extra sections
  useEffect(() => {
    if (searchQuery) return;

    setTopMovies([]);
    setRecommended([]);

    loadExtraSections(contentType);
  }, [contentType, searchQuery, loadExtraSections]);

  return (
    <>
      {/* Banner */}
      {!searchQuery && bannerMovies.length > 0 && (
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
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
        <div className="px-6 mt-6 text-white animate-pulse">
          <SkeletonCardLoader />
        </div>
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
        <p className="text-white px-6 mt-6">No results found</p>
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