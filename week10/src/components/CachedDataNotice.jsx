export default function CachedDataNotice({ cachedAt }) {
  if (!cachedAt) return null;

  const savedAt = new Date(cachedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <p className="cached-notice" role="status">
      <span aria-hidden="true">📦</span>
      <span>
        <strong>Saved copy.</strong> You are offline — showing data saved on {savedAt}. It will update when the
        connection is back.
      </span>
    </p>
  );
}