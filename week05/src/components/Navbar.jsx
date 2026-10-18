import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">🎬 CineVerse</h1>
      <div className="nav-buttons">
        <button 
          className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Catalog
        </button>
        <button 
          className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          + Add Movie
        </button>
      </div>
    </nav>
  );
}