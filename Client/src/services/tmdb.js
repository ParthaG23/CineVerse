import api from "./api";

/* =========================
   TRENDING
========================= */
// 🔥 TRENDING
export const getTrending = (type = "movie") => {
  if (type === "anime") {
    // Anime = TV + Animation genre
    return api.get("/discover/tv", {
      params: { with_genres: 16 },
    });
  }

  return api.get(`/trending/${type}/week`);
};


// 🔥 GENRE FILTER
export const getMoviesByGenre = (type = "movie", genreId) => {
  if (type === "anime") {
    return api.get("/discover/tv", {
      params: {
        with_genres: 16,
      },
    });
  }

  return api.get(`/discover/${type}`, {
    params: { with_genres: genreId },
  });
};


/* =========================
   POPULAR
========================= */
export const getPopular = (type = "movie") => {
  if (type === "anime") {
    return api.get("/discover/tv", {
      params: {
        with_genres: 16,
        sort_by: "popularity.desc",
      },
    });
  }

  return api.get(`/${type}/popular`);
};

/* =========================
   DETAILS
========================= */
export const getDetails = (id, type = "movie") =>
  api.get(`/${type}/${id}`);

/* =========================
   VIDEOS
========================= */
export const getVideos = (id, type = "movie") =>
  api.get(`/${type}/${id}/videos`);


  
  export const getMovieCredits = (id) =>
  api.get(`/movie/${id}/credits`);




export const getMoviesByRegion = (
  type = "movie",
  region = null,
  language = null
) => {
  return api.get(`/discover/${type}`, {
    params: {
      sort_by: "popularity.desc",
      region: region || undefined,
      with_original_language: language || undefined,
      include_adult: false,
    },
  });
};
// 🔥 Hindi Dubbed (Non-Hindi movies available in Hindi UI)
export const getHindiDubbed = () => {
  return api.get("/discover/movie", {
    params: {
      sort_by: "popularity.desc",
      with_original_language: "en|te|ta|ml|ko|ja", // non-hindi industries
      with_watch_monetization_types: "flatrate",
      include_adult: false,
      language: "hi-IN", // Hindi UI (closer to dubbed catalog)
      page: 1,
    },
  });
};

/* =========================
   TOP RATED (🔥 FIX ERROR)
========================= */
// ⭐ CATEGORY-AWARE TOP RATED
export const getTopRated = (
  type = "movie",
  region = null,
  language = null
) => {
  return api.get(`/discover/${type}`, {
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 500, // avoid low vote trash results
      region: region || undefined,
      with_original_language: language || undefined,
      include_adult: false,
    },
  });
};

// 🎬 CATEGORY-AWARE RECOMMENDED (POPULAR)
export const getRecommendedByCategory = (
  type = "movie",
  region = null,
  language = null
) => {
  return api.get(`/discover/${type}`, {
    params: {
      sort_by: "popularity.desc",
      region: region || undefined,
      with_original_language: language || undefined,
      include_adult: false,
    },
  });
};


/* =========================
   SEARCH
========================= */
export const searchContent = (type = "movie", query) => {
  if (!query || query.trim() === "") {
    return Promise.resolve({ data: { results: [] } });
  }

  if (type === "anime") {
    return api.get("/search/tv", {
      params: { query },
    });
  }

  return api.get(`/search/${type}`, {
    params: { query },
  });
};

