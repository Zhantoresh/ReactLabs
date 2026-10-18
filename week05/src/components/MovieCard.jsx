import React from 'react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';

export default function MovieCard({ movie, onSelect }) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)} style={{ cursor: 'pointer' }}>
      <div className="movie-poster-container">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="movie-poster" 
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = FALLBACK_POSTER;
          }}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.genre} ({movie.year})</span>
          <span className="movie-rating">⭐ {movie.rating}</span>
        </div>
      </div>
    </div>
  );
}