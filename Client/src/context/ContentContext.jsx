import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

const ContentContext = createContext(null);

const VALID_TYPES = ["movie", "tv", "anime"];

export const ContentProvider = ({ children }) => {
  // 🔥 Lazy init (faster + persistent UX)
  const [contentType, setContentTypeState] = useState(() => {
    try {
      return localStorage.getItem("contentType") || "movie";
    } catch {
      return "movie";
    }
  });

  const [searchQuery, setSearchQueryState] = useState("");

  // 🚀 Optimized setter (validated + memoized)
  const setContentType = useCallback((type) => {
    if (!VALID_TYPES.includes(type)) return;

    setContentTypeState(type);
    try {
      localStorage.setItem("contentType", type);
    } catch (err) {
      console.error("Storage error:", err);
    }
  }, []);

  // ⚡ Memoized search setter (prevents useless updates)
  const setSearchQuery = useCallback((query) => {
    setSearchQueryState((prev) => {
      if (prev === query) return prev; // prevent re-render if same
      return query;
    });
  }, []);

  // 🔄 Optional: Clear search when content type changes (better UX)
  useEffect(() => {
    setSearchQueryState("");
  }, [contentType]);

  // 🧠 CRITICAL: Memoized context value (BIG performance boost)
  const value = useMemo(
    () => ({
      contentType,
      setContentType,
      searchQuery,
      setSearchQuery,
      isSearching: searchQuery.trim().length > 0,
    }),
    [contentType, searchQuery, setContentType, setSearchQuery]
  );

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

// 🔒 Safe hook (production best practice)
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};
