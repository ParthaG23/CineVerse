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
  getTopRatedByRegion
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

  const config = categoryMap[type];

  const loadCategoryData = useCallback(async () => {
    if (!config) return;

    let active = true;

    try {
      setLoading(true);

      /* SEARCH MODE */
      if (searchQuery && searchQuery.trim() !== "") {
        const results = await searchContent(contentType, searchQuery);

        if (!active) return;

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

      if (!active) return;

      /* MAIN CONTENT FIRST */

      setMovies(results);
      setBanner(results.slice(0, 5));

      /* PARALLEL LOADING */

      let topPromise;
      let recommendedPromise;

      if (config.language) {
        topPromise = getTopRatedByRegion("movie", null, config.language);
        recommendedPromise = getMoviesByRegion("movie", null, config.language);
      }
      else if (config.region) {
        topPromise = getTopRatedByRegion("movie", config.region, null);
        recommendedPromise = getMoviesByRegion("movie", config.region, null);
      }
      else {
        topPromise = getTopRated(baseType);
        recommendedPromise = getPopular(baseType);
      }

      const [top, popular] = await Promise.all([topPromise, recommendedPromise]);

      if (!active) return;

      setTopRated(top.slice(0, 15));
      setRecommended(popular.slice(0, 15));

    } catch (err) {
      console.error("Category Load Error:", err);

      setMovies([]);
      setBanner([]);
      setTopRated([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }

    return () => {
      active = false;
    };

  }, [type, contentType, searchQuery]);

  useEffect(() => {
    setTopRated([]);
    setRecommended([]);
    loadCategoryData();
  }, [loadCategoryData]);

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
      ) : movies.length > 0 ? (
        <MovieRow
          title={searchQuery ? "Search Results" : config.title}
          movies={movies}
        />
      ) : (
        <p className="text-white px-6 mt-6">No results found</p>
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