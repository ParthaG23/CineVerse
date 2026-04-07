import api from "./api";

/* =========================
   CONFIG
========================= */

const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/* =========================
   CACHE + REQUEST DEDUP
========================= */

const fetchWithCache = async (key, requestFn) => {
  const now = Date.now();

  // Return cached result if still valid
  if (cache.has(key)) {
    const cached = cache.get(key);

    if (now < cached.expiry) {
      return cached.data;
    }

    cache.delete(key);
  }

  // Prevent duplicate in-flight requests
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const requestPromise = requestFn()
    .then((res) => {
      const results = res?.results || [];

      cache.set(key, {
        data: results,
        expiry: Date.now() + CACHE_TTL,
      });

      pendingRequests.delete(key);
      return results;
    })
    .catch((error) => {
      console.error("TMDB Error:", error?.message || error);
      pendingRequests.delete(key);

      // Throw so callers can show proper error state
      throw error;
    });

  pendingRequests.set(key, requestPromise);

  return requestPromise;
};

/* =========================
   SAFE WRAPPER
   
   Wraps a request so it never throws.
   Returns [] on failure instead.
   Use for secondary/optional sections.
========================= */

const safeRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch {
    return [];
  }
};

/* =========================
   TRENDING
========================= */

export const getTrending = (type = "movie") => {
  const key = `trending-${type}`;

  if (type === "anime") {
    return fetchWithCache(key, () =>
      api.get("/discover/tv", {
        params: {
          with_genres: 16,
          sort_by: "popularity.desc",
        },
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/trending/${type}/week`)
  );
};

/* =========================
   GENRE
========================= */

export const getMoviesByGenre = (type = "movie", genreId) => {
  const key = `genre-${type}-${genreId}`;

  if (type === "anime") {
    return fetchWithCache(key, () =>
      api.get("/discover/tv", {
        params: {
          with_genres: 16,
          sort_by: "popularity.desc",
        },
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/discover/${type}`, {
      params: {
        with_genres: genreId,
        sort_by: "popularity.desc",
      },
    })
  );
};

/* =========================
   POPULAR
========================= */

export const getPopular = (type = "movie") => {
  const key = `popular-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/popular`)
  );
};

/* =========================
   TOP RATED
========================= */

export const getTopRated = (type = "movie") => {
  const key = `top-rated-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/top_rated`)
  );
};

/* =========================
   DETAILS
========================= */

export const getDetails = async (id, type = "movie") => {
  try {
    return await api.get(`/${type}/${id}`);
  } catch (error) {
    console.error("Details Error:", error);
    return null;
  }
};

/* =========================
   VIDEOS
========================= */

export const getVideos = async (id, type = "movie") => {
  try {
    const res = await api.get(`/${type}/${id}/videos`);
    return res?.results || [];
  } catch (error) {
    console.error("Videos Error:", error);
    return [];
  }
};

/* =========================
   SEARCH
========================= */

export const searchContent = async (type = "movie", query) => {
  if (!query?.trim()) return [];

  try {
    const endpoint = type === "anime" ? "/search/tv" : `/search/${type}`;

    const res = await api.get(endpoint, {
      params: { query },
    });

    return res?.results || [];
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

/* =========================
   CREDITS
========================= */

export const getMovieCredits = async (id, type = "movie") => {
  try {
    return await api.get(`/${type}/${id}/credits`);
  } catch (error) {
    console.error("Credits Error:", error);
    return { cast: [], crew: [] };
  }
};

/* =========================
   REGION MOVIES
========================= */

export const getMoviesByRegion = async (
  type = "movie",
  region = null,
  language = null
) => {
  const res = await api.get(`/discover/${type}`, {
    params: {
      sort_by: "popularity.desc",
      region: region || undefined,
      with_original_language: language || undefined,
      include_adult: false,
    },
  });

  return res?.results || [];
};

/* =========================
   REGION MOVIES (SAFE)
   
   Same as getMoviesByRegion but never throws.
   Use for secondary sections in CategoryPage.
========================= */

export const getMoviesByRegionSafe = (type, region, language) =>
  safeRequest(() => getMoviesByRegion(type, region, language));

/* =========================
   HINDI DUBBED
========================= */

export const getHindiDubbed = () => {
  const key = "hindi-dubbed";

  return fetchWithCache(key, () =>
    api.get("/discover/movie", {
      params: {
        sort_by: "popularity.desc",
        include_adult: false,
        with_original_language: "en",
        language: "hi-IN",
      },
    })
  );
};

/* =========================
   TOP RATED REGION
========================= */

export const getTopRatedByRegion = async (
  type = "movie",
  region = null,
  language = null
) => {
  const res = await api.get(`/discover/${type}`, {
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 200,
      include_adult: false,
      region: region || undefined,
      with_original_language: language || undefined,
    },
  });

  return res?.results || [];
};

/* =========================
   TOP RATED REGION (SAFE)
========================= */

export const getTopRatedByRegionSafe = (type, region, language) =>
  safeRequest(() => getTopRatedByRegion(type, region, language));

/* =========================
   SAFE VERSIONS OF EXISTING
========================= */

export const getTopRatedSafe = (type) =>
  safeRequest(() => getTopRated(type));

export const getPopularSafe = (type) =>
  safeRequest(() => getPopular(type));

/* =========================
   CACHE MANAGEMENT
========================= */

export const clearCache = () => {
  cache.clear();
  pendingRequests.clear();
};