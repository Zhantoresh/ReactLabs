import { useState } from "react";
import { useAppUpdate } from "../hooks/useAppUpdate.js";


export default function UpdateBanner() {
  const { updateAvailable, applyUpdate } = useAppUpdate();
  const [hidden, setHidden] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!updateAvailable || hidden) return null;

  function handleUpdate() {
    setUpdating(true);
    applyUpdate();
  }

  return (
    <div className="update-banner" role="status">
      <span className="update-banner__text">🚀 A new version of Departures Board is available.</span>
      <div className="update-banner__actions">
        <button className="btn btn--small" onClick={handleUpdate} disabled={updating}>
          {updating ? "Updating…" : "Update now"}
        </button>
        <button className="btn btn--ghost btn--small" onClick={() => setHidden(true)} disabled={updating}>
          Later
        </button>
      </div>
    </div>
  );
}