import { useState, useEffect } from "react";
import { searchContent, clearCache } from "../services/tmdb";
import { useContent } from "../context/ContentContext";
import MovieCard from "../components/MovieCard";
import SkeletonCardLoader from "../components/SkeletonCardLoader";
import ErrorState from "../components/ErrorState";

const Search = () => {
  const { contentType } = useContent();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce (prevents API spam + improves performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Search Fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await searchContent(contentType, debouncedQuery);

        if (!isMounted) return;
        setResults(data || []);
      } catch (err) {
        console.error("Search Error:", err);
        if (isMounted) {
          setResults([]);
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, contentType]);

  const handleRetry = () => {
    clearCache();
    setError(null);
    if (debouncedQuery.trim()) {
      setDebouncedQuery(""); // Reset and re-trigger
      setTimeout(() => setDebouncedQuery(query), 100);
    }
  };

  return (
    <div className="px-6 pt-6 pb-10">
      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, series, anime..."
        className="w-full bg-black/40 text-white placeholder-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      {/* Results Section */}
      <div className="mt-6">
        {loading ? (
          <SkeletonCardLoader count={12} />
        ) : error ? (
          <ErrorState
            type="network"
            onRetry={handleRetry}
          />
        ) : debouncedQuery && results.length === 0 ? (
          <ErrorState
            type="empty"
            message={`No results found for "${debouncedQuery}". Try different keywords.`}
          />
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
