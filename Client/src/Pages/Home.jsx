import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  // 🎬 Load Category Movies
  const loadCategoryMovies = async (category) => {
    setLoading(true);
    try {
      if (category === "Trending") {
        const res = await getTrending(contentType);
        const results = res.data.results || [];
        setMovies(results);
        setBannerMovies(results.slice(0, 5)); // for carousel
      } else {
        const genreId = genreMap[category];
        const res = await getMoviesByGenre(contentType, genreId);
        setMovies(res.data.results || []);
        setBannerMovies([]); // hide banner for genre pages
      }
    } catch (err) {
      console.error("Category Error:", err);
      setMovies([]);
    }
    setLoading(false);
  };

  // ⭐ Load Top Rated & Recommended (IMPORTANT FIX)
  const loadExtraSections = async () => {
    try {
      const [topRes, popularRes] = await Promise.all([
        getTopRated(contentType),
        getPopular(contentType),
      ]);

      setTopMovies(topRes?.data?.results || []);
      setRecommended(popularRes?.data?.results || []);
    } catch (err) {
      console.error("Extra Sections Error:", err);
      setTopMovies([]);
      setRecommended([]);
    }
  };

  // 🔍 MAIN DATA CONTROLLER (SEARCH + CATEGORY)
  useEffect(() => {
    const loadData = async () => {
      // SEARCH MODE (highest priority)
      if (searchQuery && searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const res = await searchContent(contentType, searchQuery);
          setMovies(res?.data?.results || []);
          setBannerMovies([]); // hide banner while searching
        } catch (err) {
          console.error("Search Error:", err);
          setMovies([]);
        }
        setLoading(false);
        return;
      }

      // NORMAL MODE
      loadCategoryMovies(activeCategory);
    };

    loadData();
  }, [contentType, activeCategory, searchQuery]);

  // 🔥 MISSING EFFECT (THIS WAS YOUR BUG)
  useEffect(() => {
    if (!searchQuery) {
      loadExtraSections();
    }
  }, [contentType, searchQuery]);

  return (
    <>
          {/* BANNER */}
    {!searchQuery && bannerMovies.length > 0 && (
      <BannerCarousel movies={bannerMovies} />
    )}

    {/* CATEGORY PILLS */}
    {!searchQuery && (
      <div className="px-4 lg:px-6 mt-4">
        <CategoryPills
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>
    )}

    {/* MAIN MOVIES */}
    {loading ? (
      <p className="text-white px-6 mt-6">Loading...</p>
    ) : movies.length > 0 ? (
      <MovieRow movies={movies} />
    ) : (
      <p className="text-white px-6 mt-6">
        No results found
      </p>
    )}

    {/* TOP RATED */}
    {!searchQuery && topMovies.length > 0 && (
      <MovieRow title="Top Rated" movies={topMovies} />
    )}

    {/* RECOMMENDED */}
    {!searchQuery && recommended.length > 0 && (
      <MovieRow title="Recommended For You" movies={recommended} />
    )}
  </>
    
  );
};

export default Home;
