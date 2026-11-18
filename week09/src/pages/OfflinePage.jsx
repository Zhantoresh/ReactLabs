import { useLocation, useNavigate } from "react-router";
import OfflineMessage from "../components/OfflineMessage.jsx";


export default function OfflinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  function handleBackOnline() {
    navigate(from ? `${from.pathname}${from.search}` : "/", { replace: true });
  }

  return (
    <section className="page offline-page">
      <OfflineMessage onBackOnline={handleBackOnline} title="No internet connection" />
    </section>
  );
}