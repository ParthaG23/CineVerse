import { useState } from "react";
import { searchContent } from "../services/tmdb";
import { useContent } from "../context/ContentContext";

const Search = () => {
  const { contentType } = useContent();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await searchContent(query, contentType);
    setResults(res.data.results);
  };

  return (
    <div className="px-6 pt-6">
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, series, anime..."
          className="w-full bg-black/30 rounded-xl px-4 py-3"
        />
      </form>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {results.map(item => (
          <img
            key={item.id}
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
            className="rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
