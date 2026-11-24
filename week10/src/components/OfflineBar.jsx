import { Link, useLocation } from "react-router";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";


export default function OfflineBar() {
  const online = useOnlineStatus();
  const location = useLocation();

  if (online) return null;

  return (
    <div className="offline-bar" role="status">
      <span>You are offline. Saved pages and flights still work; changes need a connection.</span>
      {location.pathname !== "/offline" && (
        <Link to="/offline" state={{ from: location }} className="offline-bar__link">
          Details
        </Link>
      )}
    </div>
  );
}