import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar.jsx";
import OfflineBar from "../components/OfflineBar.jsx";
import OutboxBar from "../components/OutboxBar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import UpdateBanner from "../components/UpdateBanner.jsx";
import { useAutoRefresh } from "../hooks/useAutoRefresh.js";

export default function RootLayout() {
  
  useAutoRefresh();

  return (
    <div className="app">
      <NavBar />
      <OfflineBar />
      <OutboxBar />
      <UpdateBanner />

      <main className="app__main">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="app__footer">
        Departures Board · PWA · React Router, Redux Toolkit &amp; Firebase · Almaty International (ALA)
      </footer>
    </div>
  );
}