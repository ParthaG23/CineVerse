import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpenState] = useState(false);

  // 🚀 Memoized open/close handlers (stable references)
  const openSidebar = useCallback(() => {
    setSidebarOpenState(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpenState(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => !prev);
  }, []);

  // 📱 Lock body scroll when sidebar is open (important for mobile UX)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // cleanup on unmount (safety)
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // 🧠 CRITICAL: Memoized context value (prevents layout re-renders)
  const value = useMemo(
    () => ({
      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      // keep backward compatibility with your existing code
      setSidebarOpen: setSidebarOpenState,
    }),
    [sidebarOpen, openSidebar, closeSidebar, toggleSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// 🔒 Safe hook (production best practice)
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
};
