import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import BannerCarousel from "../components/BannerCarousel";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import {
  getTrending,
  getMoviesByRegion,
  getHindiDubbed,
  searchContent,
  getTopRated,
  getPopular,
} from "../services/tmdb";
import { useContent } from "../context/ContentContext";

// 🎬 Category Config Map (unchanged but optimized usage)
const categoryMap = {
  hollywood: { region: "US", title: "Hollywood" },
  bollywood: { language: "hi", title: "Bollywood" },
  "hindi-dubbed": { custom: "hindi-dubbed", title: "Hindi Dubbed" },
  telugu: { language: "te", title: "Telugu" },
  tamil: { language: "ta", title: "Tamil" },
  malayalam: { language: "ml", title: "Malayalam" },
  webseries: { type: "tv", title: "Web Series" },
};

const CategoryPage = () => {
  const { type } = useParams();
  const { contentType, searchQuery } = useContent();

  const [movies, setMovies] = useState([]);
  const [banner, setBanner] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = categoryMap[type];

  const loadCategoryData = useCallback(async () => {
    if (!config) return;

    try {
      setLoading(true);

      // 🔍 SEARCH MODE (Priority)
      if (searchQuery && searchQuery.trim() !== "") {
        const results = await searchContent(contentType, searchQuery);
        setMovies(results);
        setBanner([]);
        setTopRated([]);
        setRecommended([]);
        return;
      }

      let results = [];
      let baseType = "movie";

      // 🎯 FAST CATEGORY LOGIC (no axios direct calls)
      if (config.custom === "hindi-dubbed") {
        results = await getHindiDubbed();
      } else if (config.type === "tv") {
        results = await getTrending("tv");
        baseType = "tv";
      } else if (config.language) {
        results = await getMoviesByRegion("movie", null, config.language);
      } else if (config.region) {
        results = await getMoviesByRegion("movie", config.region, null);
      }

      // 🎞 Main content first (improves LCP)
      setMovies(results);
      setBanner(results.slice(0, 5));

      // ⭐ Load extra sections AFTER main content (performance boost)
      setTimeout(async () => {
        const [top, popular] = await Promise.all([
          getTopRated(baseType),
          getPopular(baseType),
        ]);

        setTopRated(top.slice(0, 15));
        setRecommended(popular.slice(0, 15));
      }, 700); // defer heavy sections
    } catch (err) {
      console.error("Category Load Error:", err);
      setMovies([]);
      setBanner([]);
      setTopRated([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  }, [config, contentType, searchQuery]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  if (!config) {
    return <p className="text-white p-6">Category Not Found</p>;
  }

  return (
    <>
      {/* 🎞 BANNER (Hidden During Search) */}
      {!searchQuery && banner.length > 0 && (
        <BannerCarousel movies={banner} />
      )}

      {/* 🎬 MAIN CATEGORY ROW */}
      {loading ? (
        <SkeletonCardLoader count={8} />
      ) : movies.length > 0 ? (
        <MovieRow
          title={searchQuery ? "Search Results" : config.title}
          movies={movies}
        />
      ) : (
        <p className="text-white px-6 mt-6">No results found</p>
      )}

      {/* ⭐ TOP RATED (Lazy Loaded for Performance) */}
      {!searchQuery && topRated.length > 0 && (
        <MovieRow
          title={`${config.title} Top Rated`}
          movies={topRated}
        />
      )}

      {/* 🎬 RECOMMENDED (Lazy Loaded) */}
      {!searchQuery && recommended.length > 0 && (
        <MovieRow
          title={`Recommended ${config.title}`}
          movies={recommended}
        />
      )}
    </>
  );
};

export default CategoryPage;
