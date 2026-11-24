// Page buttons. The current page lives in the URL (?page=2),
// the parent passes onPageChange which updates the URL.
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn--ghost btn--small" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ← Prev
      </button>

      {pages.map((number) => (
        <button
          key={number}
          className={`btn btn--small ${number === page ? "" : "btn--ghost"}`}
          onClick={() => onPageChange(number)}
          aria-current={number === page ? "page" : undefined}
        >
          {number}
        </button>
      ))}

      <button
        className="btn btn--ghost btn--small"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </nav>
  );
}