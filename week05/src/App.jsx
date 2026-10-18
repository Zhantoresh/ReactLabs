import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import MovieList from './components/MovieList';
import Pagination from './components/Pagination';
import AddMovieForm from './components/AddMovieForm';
import MovieDetailModal from './components/MovieDetailModal'; 

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchEffectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getMovies({ search, genre, sortBy, page, limit: 10 });
        if (isMounted) {
          setMovies(response.data);
          setTotalPages(response.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEffectData();

    return () => {
      isMounted = false;
    };
  }, [search, genre, sortBy, page]);

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'catalog' ? (
        <>
          <FilterPanel 
            search={search} setSearch={setSearch}
            genre={genre} setGenre={setGenre}
            sortBy={sortBy} setSortBy={setSortBy}
            setPage={setPage}
          />

          {}
          <MovieList 
            movies={movies} 
            loading={loading} 
            error={error} 
            onSelectMovie={(movie) => setSelectedMovie(movie)} 
          />

          {!loading && !error && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}
        </>
      ) : (
        <AddMovieForm onMovieAdded={() => 
          setActiveTab('catalog')} />
      )}

      {}
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onMovieDeleted={() => {
            setPage(1); 
          }}
        />
      )}
    </div>
  );
}