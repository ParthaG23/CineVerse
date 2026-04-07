import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import MovieRow from "../components/MovieRow";
import BannerCarousel from "../components/BannerCarousel";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import ErrorState from "../components/ErrorState";

import {
  getTrending,
  getMoviesByRegion,
  getHindiDubbed,
  searchContent,
  getTopRatedSafe,
  getPopularSafe,
  getTopRatedByRegionSafe,
  getMoviesByRegionSafe,
  clearCache,
} from "../services/tmdb";

import { useContent } from "../context/ContentContext";

/* CATEGORY CONFIG */

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
  const [error, setError] = useState(null);

  const config = categoryMap[type];

  const loadData = useCallback(async (cancelled) => {
    if (!config) return;

    try {
      setLoading(true);
      setError(null);

      /* SEARCH MODE */

      if (searchQuery && searchQuery.trim()) {
        const results = await searchContent(contentType, searchQuery);

        if (cancelled?.current) return;

        setMovies(results);
        setBanner([]);
        setTopRated([]);
        setRecommended([]);
        return;
      }

      let results = [];
      let baseType = "movie";

      /* MAIN CATEGORY CONTENT */

      if (config.custom === "hindi-dubbed") {
        results = await getHindiDubbed();
      } 
      else if (config.type === "tv") {
        results = await getTrending("tv");
        baseType = "tv";
      } 
      else if (config.language) {
        results = await getMoviesByRegion("movie", null, config.language);
      } 
      else if (config.region) {
        results = await getMoviesByRegion("movie", config.region, null);
      }

      if (cancelled?.current) return;

      /* MAIN CONTENT */

      setMovies(results);
      setBanner(results.slice(0, 5));

      /* SECONDARY SECTIONS (use Safe variants — never throw) */

      let topPromise;
      let recPromise;

      if (config.language) {
        topPromise = getTopRatedByRegionSafe("movie", null, config.language);
        recPromise = getMoviesByRegionSafe("movie", null, config.language);
      } 
      else if (config.region) {
        topPromise = getTopRatedByRegionSafe("movie", config.region, null);
        recPromise = getMoviesByRegionSafe("movie", config.region, null);
      } 
      else {
        topPromise = getTopRatedSafe(baseType);
        recPromise = getPopularSafe(baseType);
      }

      const [top, popular] = await Promise.all([topPromise, recPromise]);

      if (cancelled?.current) return;

      setTopRated(top.slice(0, 15));
      setRecommended(popular.slice(0, 15));

    } catch (err) {
      console.error("Category Load Error:", err);

      if (!cancelled?.current) {
        setMovies([]);
        setBanner([]);
        setTopRated([]);
        setRecommended([]);
        setError(err);
      }
    } finally {
      if (!cancelled?.current) setLoading(false);
    }
  }, [config, contentType, searchQuery]);

  useEffect(() => {
    if (!config) return;

    const cancelled = { current: false };

    setTopRated([]);
    setRecommended([]);

    loadData(cancelled);

    return () => {
      cancelled.current = true;
    };

  }, [type, loadData]);

  /* RETRY HANDLER */

  const handleRetry = useCallback(() => {
    clearCache();
    setError(null);
    loadData({ current: false });
  }, [loadData]);

  if (!config) {
    return <p className="text-white p-6">Category Not Found</p>;
  }

  return (
    <>
      {/* Banner */}
      {!searchQuery && banner.length > 0 && (
        <BannerCarousel movies={banner} />
      )}

      {/* Main Row */}
      {loading ? (
        <SkeletonCardLoader count={8} />
      ) : error ? (
        <ErrorState
          type="network"
          onRetry={handleRetry}
        />
      ) : movies.length > 0 ? (
        <MovieRow
          title={searchQuery ? "Search Results" : config.title}
          movies={movies}
        />
      ) : (
        <ErrorState
          type="empty"
          message="No content found in this category."
          onRetry={handleRetry}
        />
      )}

      {/* Top Rated */}
      {!searchQuery && topRated.length > 0 && (
        <MovieRow
          title={`${config.title} Top Rated`}
          movies={topRated}
        />
      )}

      {/* Recommended */}
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