import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar.jsx";
import OfflineBar from "../components/OfflineBar.jsx";
import OutboxBar from "../components/OutboxBar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import Toaster from "../components/Toaster.jsx";
import UpdateBanner from "../components/UpdateBanner.jsx";
import { useAutoRefresh } from "../hooks/useAutoRefresh.js";

export default function RootLayout() {
  // reload flights when the connection comes back or the tab becomes visible
  useAutoRefresh();

  return (
    <div className="app">
      <NavBar />
      <OfflineBar />
      <OutboxBar />
      <UpdateBanner />

      <main className="app__main">
        {/* While a lazy page is being downloaded, show the fallback */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* toast messages from Redux (notifications slice) */}
      <Toaster />

      <footer className="app__footer">
        Departures Board · PWA · React Router, Redux Toolkit &amp; Firebase · Almaty International (ALA)
      </footer>
    </div>
  );
}