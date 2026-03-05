import api from "./api";

/* =========================
   SMART CACHE + REQUEST DEDUPLICATION
========================= */

const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const fetchWithCache = async (key, requestFn) => {
  const now = Date.now();

  // Return cached data
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);

    if (now < expiry) return data;

    // Remove expired cache
    cache.delete(key);
  }

  // Prevent duplicate requests
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const requestPromise = requestFn()
    .then((res) => {
      const results = res?.data?.results || [];

      cache.set(key, {
        data: results,
        expiry: now + CACHE_TTL,
      });

      pendingRequests.delete(key);
      return results;
    })
    .catch((error) => {
      console.error("TMDB Error:", error?.response?.data || error.message);
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
        timeout: 8000,
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/trending/${type}/week`, { timeout: 8000 })
  );
};

/* =========================
   GENRE FILTER
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
        timeout: 8000,
      })
    );
  }

  return fetchWithCache(key, () =>
    api.get(`/discover/${type}`, {
      params: {
        with_genres: genreId,
        sort_by: "popularity.desc",
      },
      timeout: 8000,
    })
  );
};

/* =========================
   POPULAR
========================= */

export const getPopular = (type = "movie") => {
  const key = `popular-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/popular`, { timeout: 8000 })
  );
};

/* =========================
   TOP RATED (OFFICIAL ENDPOINT)
========================= */

export const getTopRated = (type = "movie") => {
  const key = `top-rated-${type}`;

  return fetchWithCache(key, () =>
    api.get(`/${type}/top_rated`, { timeout: 8000 })
  );
};

/* =========================
   DETAILS
========================= */

export const getDetails = async (id, type = "movie") => {
  try {
    const res = await api.get(`/${type}/${id}`, { timeout: 8000 });
    return res.data;
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
    const res = await api.get(`/${type}/${id}/videos`, { timeout: 8000 });
    return res.data?.results || [];
  } catch (error) {
    console.error("Video Error:", error);
    return [];
  }
};

/* =========================
   SEARCH
========================= */

export const searchContent = async (type = "movie", query) => {
  if (!query || query.trim() === "") return [];

  try {
    const endpoint = type === "anime" ? "/search/tv" : `/search/${type}`;

    const res = await api.get(endpoint, {
      params: { query },
      timeout: 8000,
    });

    return res.data?.results || [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

/* =========================
   MOVIE CREDITS
========================= */

export const getMovieCredits = async (id, type = "movie") => {
  try {
    const res = await api.get(`/${type}/${id}/credits`, { timeout: 8000 });
    return res.data;
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
      timeout: 8000,
    });

    return res.data?.results || [];
  } catch (error) {
    console.error("Region Movies Error:", error);
    return [];
  }
};

export const getHindiDubbed = () => {
  const key = `hindi-dubbed`;

  return fetchWithCache(key, () =>
    api.get("/discover/movie", {
      params: {
        sort_by: "popularity.desc",
        include_adult: false,
        with_original_language: "en",
        language: "hi-IN",
      },
      timeout: 8000,
    })
  );
};
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
      timeout: 8000,
    });

    return res.data?.results || [];
  } catch (error) {
    console.error("Top Rated Region Error:", error);
    return [];
  }
};