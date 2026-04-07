import axios from "axios";

/* =========================
   ENV SAFETY CHECK
========================= */

const DIRECT_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL; // https://api.themoviedb.org/3
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const isDev = import.meta.env.DEV;

if (!DIRECT_BASE_URL || !API_KEY) {
  console.error("Missing TMDB environment variables. Check .env file.");
}

/* =========================
   MULTI-STRATEGY PROXY SYSTEM
   
   TMDB API may be blocked by certain ISPs.
   We try multiple approaches until one works:
   
   1. Vite dev proxy (development only - server-side fetch)
   2. Direct TMDB API (works in most regions)
   3. Multiple CORS relay proxies (bypass ISP blocks)
   
   Once a working strategy is found, it's cached
   for all subsequent requests in the session.
========================= */

const buildStrategies = () => {
  const strategies = [];

  // Dev mode: Vite proxy (server-side, bypasses browser restrictions)
  if (isDev) {
    strategies.push({
      name: "Vite-Proxy",
      baseUrl: "/tmdb-api",
      needsFullUrl: false,
    });
  }

  // Direct API
  strategies.push({
    name: "Direct",
    baseUrl: DIRECT_BASE_URL,
    needsFullUrl: false,
  });

  // CORS Relay Proxies (for ISP-blocked regions)
  strategies.push(
    {
      name: "CorsProxy-io",
      baseUrl: "https://corsproxy.io/?url=",
      needsFullUrl: true,
    },
    {
      name: "AllOrigins",
      baseUrl: "https://api.allorigins.win/raw?url=",
      needsFullUrl: true,
    },
    {
      name: "CodeTabs",
      baseUrl: "https://api.codetabs.com/v1/proxy?quest=",
      needsFullUrl: true,
    }
  );

  return strategies;
};

const STRATEGIES = buildStrategies();

/* =========================
   STRATEGY STATE
========================= */

let workingStrategyIndex = 0;
let strategyLocked = false;

// Promise that resolves once the first strategy discovery completes.
// All concurrent requests wait for this instead of each trying strategies independently.
let discoveryPromise = null;

/* =========================
   BUILD REQUEST URL
========================= */

const buildUrl = (strategy, path, params) => {
  const queryString = new URLSearchParams({
    ...params,
    api_key: API_KEY,
  }).toString();

  if (strategy.needsFullUrl) {
    const fullTmdbUrl = `${DIRECT_BASE_URL}${path}?${queryString}`;
    return `${strategy.baseUrl}${encodeURIComponent(fullTmdbUrl)}`;
  }

  return `${strategy.baseUrl}${path}?${queryString}`;
};

/* =========================
   STRATEGY DISCOVERY
   
   Called once when no strategy is locked.
   All concurrent requests await this single 
   discovery instead of each trying independently.
========================= */

const discoverWorkingStrategy = async () => {
  for (let i = 0; i < STRATEGIES.length; i++) {
    const strategy = STRATEGIES[i];

    try {
      // Use a lightweight endpoint for probing
      const url = buildUrl(strategy, "/configuration", {});

      await axios.get(url, {
        timeout: 8000,
        headers: { Accept: "application/json" },
      });

      // Success!
      workingStrategyIndex = i;
      strategyLocked = true;
      console.info(`✓ TMDB: Locked to ${strategy.name}`);
      return;

    } catch (error) {
      const isTimeout = error.code === "ECONNABORTED";
      console.warn(
        `⚠ TMDB ${strategy.name}: ${isTimeout ? "Timeout" : error.response?.status || error.message}`
      );
    }
  }

  // None worked — default to first CORS proxy for retry attempts
  workingStrategyIndex = Math.max(2, isDev ? 2 : 1);
  strategyLocked = true;
  console.warn("⚠ TMDB: All strategies failed during discovery, defaulting to proxy");
};

/* =========================
   SINGLE REQUEST (using locked strategy)
========================= */

const executeRequest = async (path, params) => {
  const strategy = STRATEGIES[workingStrategyIndex];
  const url = buildUrl(strategy, path, params);

  const response = await axios.get(url, {
    timeout: 15000,
    headers: { Accept: "application/json" },
  });

  let data = response.data;

  // Some proxies return string instead of parsed JSON
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      throw new Error("Invalid JSON response from proxy");
    }
  }

  // Validate TMDB response
  if (!data || (typeof data === "object" && data.status_code && data.status_code >= 30)) {
    throw new Error(`TMDB API error: ${data?.status_message || "Unknown"}`);
  }

  return data;
};

/* =========================
   CORE REQUEST ENGINE
========================= */

const makeRequest = async (path, params = {}) => {
  // If strategy not yet discovered, discover it (only once)
  if (!strategyLocked) {
    if (!discoveryPromise) {
      discoveryPromise = discoverWorkingStrategy().finally(() => {
        discoveryPromise = null;
      });
    }
    await discoveryPromise;
  }

  // Now use the locked strategy
  try {
    return await executeRequest(path, params);
  } catch (error) {
    // If locked strategy fails, unlock and re-discover on next request
    const status = error.response?.status;

    // Don't re-discover for client errors (bad request, not found)
    if (status && status >= 400 && status < 500) {
      throw error;
    }

    // Network/timeout failure — unlock for re-discovery
    console.warn(`⚠ TMDB: Locked strategy failed, will re-discover on next request`);
    strategyLocked = false;

    throw error;
  }
};

/* =========================
   PUBLIC API INTERFACE
========================= */

const api = {
  get: (path, config = {}) => {
    const params = config.params || {};
    return makeRequest(path, params);
  },
};

/* =========================
   UTILITIES
========================= */

export const resetStrategy = () => {
  workingStrategyIndex = 0;
  strategyLocked = false;
  discoveryPromise = null;
};

export default api;