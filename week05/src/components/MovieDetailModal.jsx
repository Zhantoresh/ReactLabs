import React from 'react';
import { api } from '../services/api';

export default function MovieDetailModal({ movie, onClose, onMovieDeleted }) {
  if (!movie) return null;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      try {
        await api.deleteMovie(movie.id);
        if (onMovieDeleted) {
          onMovieDeleted();
        }
        onClose();
      } catch (err) {
        alert('Failed to delete the movie.');
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#161922',
          border: '1px solid #2a2e39',
          borderRadius: '16px',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '25px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          color: '#f1f5f9'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#1a1d24',
            border: '1px solid #2a2e39',
            color: '#94a3b8',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
          <img 
            src={movie.poster} 
            alt={movie.title} 
            style={{ 
              width: '200px', 
              height: '300px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #2a2e39'
            }} 
          />

          <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#fff' }}>{movie.title}</h2>
            
            {movie.director && (
              <div style={{ color: '#f5a623', fontSize: '15px', fontWeight: 600 }}>
                🎬 Director: {movie.director}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#94a3b8' }}>
              <span>📅 {movie.year}</span>
              <span>🏷️ {movie.genre}</span>
              {movie.duration && <span>⏱️ {movie.duration} min</span>}
            </div>

            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f5a623' }}>
              ⭐ {movie.rating} / 10
            </div>

            <div style={{ marginTop: '5px', fontSize: '15px', lineHeight: '1.6', color: '#cbd5e1' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Description:</h4>
              <p style={{ margin: 0 }}>{movie.description || 'Description not available.'}</p>
            </div>

            {/* Кнопка удаления фильма */}
            <button 
              onClick={handleDelete}
              style={{
                marginTop: '15px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                alignSelf: 'flex-start'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Delete Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}