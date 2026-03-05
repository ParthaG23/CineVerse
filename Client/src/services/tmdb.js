import api from "./api";

/* =========================
   CONFIG
========================= */

const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const REQUEST_TIMEOUT = 8000;

/* =========================
   CACHE + REQUEST DEDUP
========================= */

const fetchWithCache = async (key, requestFn) => {
  const now = Date.now();

  // Cached result
  if (cache.has(key)) {
    const cached = cache.get(key);

    if (now < cached.expiry) {
      return cached.data;
    }

    cache.delete(key);
  }

  // Prevent duplicate requests
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
      return [];
    });

  pendingRequests.set(key, requestPromise);

  return requestPromise;
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
        timeout: REQUEST_TIMEOUT,
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/trending/${type}/week`, { timeout: REQUEST_TIMEOUT })
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
        timeout: REQUEST_TIMEOUT,
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/discover/${type}`, {
      params: {
        with_genres: genreId,
        sort_by: "popularity.desc",
      },
      timeout: REQUEST_TIMEOUT,
    })
  );
};

/* =========================
   POPULAR
========================= */

export const getPopular = (type = "movie") => {
  const key = `popular-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/popular`, { timeout: REQUEST_TIMEOUT })
  );
};

/* =========================
   TOP RATED
========================= */

export const getTopRated = (type = "movie") => {
  const key = `top-rated-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/top_rated`, { timeout: REQUEST_TIMEOUT })
  );
};

/* =========================
   DETAILS
========================= */

export const getDetails = async (id, type = "movie") => {
  try {
    return await api.get(`/${type}/${id}`, {
      timeout: REQUEST_TIMEOUT,
    });
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
    const res = await api.get(`/${type}/${id}/videos`, {
      timeout: REQUEST_TIMEOUT,
    });

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
      timeout: REQUEST_TIMEOUT,
    });

    return res?.results || [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

/* =========================
   CREDITS
========================= */

export const getMovieCredits = async (id, type = "movie") => {
  try {
    return await api.get(`/${type}/${id}/credits`, {
      timeout: REQUEST_TIMEOUT,
    });
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
  try {
    const res = await api.get(`/discover/${type}`, {
      params: {
        sort_by: "popularity.desc",
        region: region || undefined,
        with_original_language: language || undefined,
        include_adult: false,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return res?.results || [];
  } catch (error) {
    console.error("Region Movies Error:", error);
    return [];
  }
};

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
      timeout: REQUEST_TIMEOUT,
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
  try {
    const res = await api.get(`/discover/${type}`, {
      params: {
        sort_by: "vote_average.desc",
        "vote_count.gte": 200,
        include_adult: false,
        region: region || undefined,
        with_original_language: language || undefined,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return res?.results || [];
  } catch (error) {
    console.error("Top Rated Region Error:", error);
    return [];
  }
};