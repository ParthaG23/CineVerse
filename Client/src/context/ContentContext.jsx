import { createContext, useContext, useState } from "react";

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contentType, setContentType] = useState("movie");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ContentContext.Provider
      value={{
        contentType,
        setContentType,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
