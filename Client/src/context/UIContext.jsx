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

  /* OPEN */
  const openSidebar = useCallback(() => {
    setSidebarOpenState(true);
  }, []);

  /* CLOSE */
  const closeSidebar = useCallback(() => {
    setSidebarOpenState(false);
  }, []);

  /* TOGGLE */
  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => !prev);
  }, []);

  /* BODY SCROLL LOCK */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;

    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  /* MEMOIZED CONTEXT VALUE */
  const value = useMemo(
    () => ({
      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,

      // keep compatibility with existing code
      setSidebarOpen: setSidebarOpenState,
    }),
    [sidebarOpen, openSidebar, closeSidebar, toggleSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

/* SAFE HOOK */
export const useUI = () => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }

  return context;
};