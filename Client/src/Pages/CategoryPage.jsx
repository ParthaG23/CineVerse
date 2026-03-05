import { useEffect, useState } from "react";
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
  getTopRatedByRegion,
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

  useEffect(() => {
    if (!config) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);

        /* SEARCH MODE */

        if (searchQuery && searchQuery.trim()) {
          const results = await searchContent(contentType, searchQuery);

          if (cancelled) return;

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

        if (cancelled) return;

        /* MAIN CONTENT FIRST (better LCP) */

        setMovies(results);
        setBanner(results.slice(0, 5));

        /* PARALLEL SECONDARY LOAD */

        let topPromise;
        let recPromise;

        if (config.language) {
          topPromise = getTopRatedByRegion("movie", null, config.language);
          recPromise = getMoviesByRegion("movie", null, config.language);
        } 
        else if (config.region) {
          topPromise = getTopRatedByRegion("movie", config.region, null);
          recPromise = getMoviesByRegion("movie", config.region, null);
        } 
        else {
          topPromise = getTopRated(baseType);
          recPromise = getPopular(baseType);
        }

        const [top, popular] = await Promise.all([topPromise, recPromise]);

        if (cancelled) return;

        setTopRated(top.slice(0, 15));
        setRecommended(popular.slice(0, 15));

      } catch (err) {
        console.error("Category Load Error:", err);

        if (!cancelled) {
          setMovies([]);
          setBanner([]);
          setTopRated([]);
          setRecommended([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    setTopRated([]);
    setRecommended([]);

    loadData();

    return () => {
      cancelled = true;
    };

  }, [type, contentType, searchQuery, config]);

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