import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search menu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" aria-label="Search">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default Search;
