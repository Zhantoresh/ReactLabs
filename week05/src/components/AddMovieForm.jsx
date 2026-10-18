import React, { useState } from 'react';
import { api } from '../services/api';

export default function AddMovieForm({ onMovieAdded }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Action');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [director, setDirector] = useState(''); 
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    
    const parsedYear = Number(year);
    if (isNaN(parsedYear) || parsedYear < 1895 || parsedYear > 2030) {
      alert('Please enter a valid release year (between 1895 and 2030).');
      return;
    }

  
    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      alert('Rating must be a number between 0 and 10.');
      return;
    }

    
    const trimmedDirector = director.trim();
    if (trimmedDirector) {
     
      const isOnlyNumbers = /^\d+$/.test(trimmedDirector);
      if (isOnlyNumbers || trimmedDirector.length < 2) {
        alert('Please enter a valid director name (cannot be just numbers or a single character).');
        return;
      }
    }

    setSubmitting(true);
    setSuccessMsg('');

    try {
      await api.addMovie({
        title,
        genre,
        year: parsedYear,
        rating: parsedRating,
        director: trimmedDirector || 'Unknown Director', 
        description
      });

      setSuccessMsg('Movie successfully added to the catalog!');
      
     
      setTitle('');
      setGenre('Action');
      setYear('');
      setRating('');
      setDirector('');
      setDescription('');

      if (onMovieAdded) {
        onMovieAdded();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add movie. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Movie</h2>
      {successMsg && <div style={{ color: '#10b981', marginBottom: '15px', fontWeight: 'bold' }}>{successMsg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Movie Title *</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Inception"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="Action">Action</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Drama">Drama</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Release Year *</label>
            <input 
              type="number" 
              className="form-input" 
              required 
              min="1895" 
              max="2030"
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              placeholder="e.g. 2010"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Rating (0 - 10) *</label>
            <input 
              type="number" 
              step="0.1" 
              className="form-input" 
              required 
              min="0" 
              max="10"
              value={rating} 
              onChange={(e) => setRating(e.target.value)} 
              placeholder="e.g. 8.8"
            />
          </div>

          {}
          <div className="form-group">
            <label className="form-label">Director</label>
            <input 
              type="text" 
              className="form-input" 
              value={director} 
              onChange={(e) => setDirector(e.target.value)} 
              placeholder="e.g. Christopher Nolan"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            className="form-textarea" 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Short plot summary..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
}