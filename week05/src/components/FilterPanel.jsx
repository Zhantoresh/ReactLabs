import React from 'react';

export default function FilterPanel({ search, setSearch, genre, setGenre, sortBy, setSortBy, setPage }) {
  return (
    <div className="filter-panel">
      <input 
        type="text" 
        className="filter-input"
        placeholder="Search movies or directors..." 
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <select 
        className="filter-select"
        value={genre} 
        onChange={(e) => { setGenre(e.target.value); setPage(1); }}
      >
        <option value="">All Genres</option>
        <option value="Action">Action</option>
        <option value="Drama">Drama</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Comedy">Comedy</option>
        <option value="Thriller">Thriller</option>
        <option value="Animation">Animation</option>
      </select>

      <select 
        className="filter-select"
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="title">By Title (A-Z)</option>
        <option value="yearDesc">Newest First</option>
        <option value="ratingDesc">By Rating</option>
      </select>
    </div>
  );
}