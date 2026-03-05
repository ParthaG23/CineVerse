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
const STORAGE_KEY = "contentType";

/* SAFE STORAGE READ */
const getStoredType = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_TYPES.includes(stored) ? stored : "movie";
  } catch {
    return "movie";
  }
};

export const ContentProvider = ({ children }) => {
  /* LAZY INIT */
  const [contentType, setContentTypeState] = useState(getStoredType);
  const [searchQuery, setSearchQueryState] = useState("");

  /* SET CONTENT TYPE */
  const setContentType = useCallback((type) => {
    if (!VALID_TYPES.includes(type)) return;

    setContentTypeState((prev) => {
      if (prev === type) return prev;

      try {
        localStorage.setItem(STORAGE_KEY, type);
      } catch {}

      return type;
    });
  }, []);

  /* SET SEARCH QUERY */
  const setSearchQuery = useCallback((query) => {
    setSearchQueryState((prev) => (prev === query ? prev : query));
  }, []);

  /* CLEAR SEARCH WHEN TYPE CHANGES */
  useEffect(() => {
    setSearchQueryState("");
  }, [contentType]);

  /* MEMOIZED VALUE */
  const value = useMemo(
    () => ({
      contentType,
      setContentType,
      searchQuery,
      setSearchQuery,
      isSearching: Boolean(searchQuery.trim()),
    }),
    [contentType, searchQuery, setContentType, setSearchQuery]
  );

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

/* SAFE HOOK */
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};