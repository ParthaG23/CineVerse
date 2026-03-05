import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "user";

/* SAFE JSON PARSE */
const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  /* LAZY INIT USER */
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return safeParse(stored);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  /* LOGIN */
  const login = useCallback((userData) => {
    try {
      setLoading(true);
      setUser(userData);

      const serialized = JSON.stringify(userData);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* LOGOUT */
  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  /* SYNC AUTH ACROSS TABS */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      setUser(safeParse(e.newValue));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* MEMOIZED CONTEXT VALUE */
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* SAFE HOOK */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};