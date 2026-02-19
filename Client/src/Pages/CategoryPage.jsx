import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import BannerCarousel from "../components/BannerCarousel";
import {
  getTrending,
  getMoviesByRegion,
  getHindiDubbed,
  searchContent,
} from "../services/tmdb";
import { useContent } from "../context/ContentContext";
import api from "../services/api"; // needed for advanced discover queries

// 🎬 Category Config Map
const categoryMap = {
  hollywood: {
    region: "US",
    title: "Hollywood",
  },
  bollywood: {
    language: "hi",
    title: "Bollywood",
  },
  "hindi-dubbed": {
    custom: "hindi-dubbed",
    title: "Hindi Dubbed",
  },
  telugu: {
    language: "te",
    title: "Telugu",
  },
  tamil: {
    language: "ta",
    title: "Tamil",
  },
  malayalam: {
    language: "ml",
    title: "Malayalam",
  },
  webseries: {
    type: "tv",
    title: "Web Series",
  },
};

const CategoryPage = () => {
  const { type } = useParams();
  const { contentType, searchQuery } = useContent();

  const [movies, setMovies] = useState([]);
  const [banner, setBanner] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = categoryMap[type];

  useEffect(() => {
    const loadData = async () => {
      if (!config) return;

      setLoading(true);

      try {
        // 🔍 GLOBAL SEARCH (WORKS ON ALL PAGES)
        if (searchQuery && searchQuery.trim() !== "") {
          const res = await searchContent(contentType, searchQuery);
          const results = res?.data?.results || [];

          setMovies(results);
          setBanner([]);
          setTopRated([]);
          setRecommended([]);
          setLoading(false);
          return;
        }

        let results = [];
        let baseType = "movie";

        // 🎯 HINDI DUBBED (SPECIAL HANDLER)
        if (config.custom === "hindi-dubbed") {
          const res = await getHindiDubbed();
          results = res.data.results || [];
          baseType = "movie";
        }

        // 📺 WEB SERIES (TV CONTENT)
        else if (config.type === "tv") {
          const res = await getTrending("tv");
          results = res.data.results || [];
          baseType = "tv";
        }

        // 🌏 LANGUAGE BASED (Bollywood, Telugu, Tamil, Malayalam)
        else if (config.language) {
          const res = await getMoviesByRegion(
            "movie",
            null,
            config.language
          );
          results = res.data.results || [];
          baseType = "movie";
        }

        // 🌎 REGION BASED (Hollywood)
        else if (config.region) {
          const res = await getMoviesByRegion(
            "movie",
            config.region,
            null
          );
          results = res.data.results || [];
          baseType = "movie";
        }

        // 🎞 Set Main Content
        setMovies(results);
        setBanner(results.slice(0, 5)); // Banner top 5

        // ⭐ CATEGORY-SPECIFIC TOP RATED (SMART FILTER)
        const topRatedRes = await api.get(`/discover/${baseType}`, {
          params: {
            sort_by: "vote_average.desc",
            "vote_count.gte": 300,
            with_original_language: config.language || undefined,
            region: config.region || undefined,
            include_adult: false,
          },
        });

        // 🎬 CATEGORY-SPECIFIC RECOMMENDED (POPULAR)
        const recommendedRes = await api.get(`/discover/${baseType}`, {
          params: {
            sort_by: "popularity.desc",
            with_original_language: config.language || undefined,
            region: config.region || undefined,
            include_adult: false,
          },
        });

        setTopRated(topRatedRes?.data?.results?.slice(0, 15) || []);
        setRecommended(recommendedRes?.data?.results?.slice(0, 15) || []);
      } catch (err) {
        console.error("Category Load Error:", err);
        setMovies([]);
        setBanner([]);
        setTopRated([]);
        setRecommended([]);
      }

      setLoading(false);
    };

    loadData();
  }, [type, contentType, searchQuery]);

  if (!config) {
    return <p className="text-white p-6">Category Not Found</p>;
  }

  return (
    <>
      {/* 🎞 BANNER (Hidden During Search Like Netflix) */}
      {!searchQuery && banner.length > 0 && (
        <BannerCarousel movies={banner} />
      )}

      {/* 🎬 MAIN CATEGORY ROW */}
      {loading ? (
        <p className="text-white px-6 mt-6">
          {searchQuery
            ? "Searching..."
            : `Loading ${config.title}...`}
        </p>
      ) : movies.length > 0 ? (
        <MovieRow
          title={searchQuery ? "Search Results" : config.title}
          movies={movies}
        />
      ) : (
        <p className="text-white px-6 mt-6">No results found</p>
      )}

      {/* ⭐ TOP RATED (CATEGORY SPECIFIC) */}
      {!searchQuery && topRated.length > 0 && (
        <MovieRow
          title={`${config.title} Top Rated`}
          movies={topRated}
        />
      )}

      {/* 🎬 RECOMMENDED (CATEGORY SPECIFIC) */}
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
