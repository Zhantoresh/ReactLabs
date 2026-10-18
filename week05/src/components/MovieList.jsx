import React from 'react';
import MovieCard from './MovieCard';

export default function MovieList({ movies, loading, error, onSelectMovie }) {
  if (error) {
    return <div className="state-message error-message">{error}</div>;
  }

  if (loading) {
    return <div className="state-message">Loading movies...</div>;
  }

  if (!loading && movies.length === 0) {
    return <div className="state-message">No movies found. Try adjusting your search filters.</div>;
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
      ))}
    </div>
  );
}