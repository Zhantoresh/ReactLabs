import React from 'react';

export default function Pagination({ page, totalPages, setPage }) {
  
  const getPageNumbers = () => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    let l;
    for (let i of uniqueRange) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination-container">
      {}
      <button 
        className="pagination-btn"
        onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
        disabled={page === 1}
      >
        ← Prev
      </button>

      {}
      <div className="pagination-numbers">
        {getPageNumbers().map((item, index) => {
          if (item === '...') {
            return <span key={index} className="pagination-dots">...</span>;
          }

          return (
            <button
              key={index}
              className={`pagination-number-btn ${page === item ? 'active' : ''}`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          );
        })}
      </div>

      {}
      <button 
        className="pagination-btn"
        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
        disabled={page === totalPages}
      >
        Next →
      </button>
    </div>
  );
}