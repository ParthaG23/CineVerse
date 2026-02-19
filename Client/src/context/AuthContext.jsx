import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 🔥 Lazy initialization (faster than useEffect load)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Auth parse error:", err);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // 🚀 Optimized login (memoized)
  const login = useCallback((userData) => {
    try {
      setLoading(true);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Optimized logout (clears storage + state)
  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  // 🔄 Sync user across tabs (PRO feature)
  useEffect(() => {
    const syncAuth = (e) => {
      if (e.key === "user") {
        try {
          const updatedUser = e.newValue
            ? JSON.parse(e.newValue)
            : null;
          setUser(updatedUser);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // 🧠 Memoized context value (CRITICAL for performance)
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
    }),
    [user, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔒 Safe hook with error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
