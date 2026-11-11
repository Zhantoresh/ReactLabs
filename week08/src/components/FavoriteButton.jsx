import { useAuth } from "../hooks/useAuth.js";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites.js";

export default function FavoriteButton({ flightId, variant = "icon" }) {
  const { user } = useAuth();
  const { isSaved } = useFavorites();
  const toggle = useToggleFavorite();

  if (!user) return null;

  const saved = isSaved(flightId);
  const label = saved ? "Remove from My flights" : "Add to My flights";

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggle.mutate(flightId);
  }

  if (variant === "button") {
    return (
      <button className={`btn btn--small ${saved ? "" : "btn--ghost"}`} onClick={handleClick} aria-pressed={saved}>
        {saved ? "★ Saved to My flights" : "☆ Add to My flights"}
      </button>
    );
  }

  return (
    <button
      className={`fav ${saved ? "fav--on" : ""}`}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}