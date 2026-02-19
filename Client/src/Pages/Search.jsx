import { useState, useEffect } from "react";
import { searchContent } from "../services/tmdb";
import { useContent } from "../context/ContentContext";
import MovieCard from "../components/MovieCard";
import SkeletonCardLoader from "../components/SkeletonCardLoader";

const Search = () => {
  const { contentType } = useContent();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Debounce (prevents API spam + improves performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // 🚀 Optimized Search Fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let isMounted = true;

    const fetchSearch = async () => {
      try {
        setLoading(true);

        // ⚠️ Correct param order (type, query)
        const data = await searchContent(contentType, debouncedQuery);

        if (!isMounted) return;
        setResults(data || []);
      } catch (error) {
        console.error("Search Error:", error);
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false; // prevent memory leak
    };
  }, [debouncedQuery, contentType]);

  return (
    <div className="px-6 pt-6 pb-10">
      {/* 🔍 Search Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, series, anime..."
        className="w-full bg-black/40 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      {/* 🎬 Results Section */}
      <div className="mt-6">
        {/* ⏳ Skeleton Loader */}
        {loading ? (
          <SkeletonCardLoader count={12} />
        ) : debouncedQuery && results.length === 0 ? (
          <p className="text-white/60 text-center mt-10">
            No results found
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
