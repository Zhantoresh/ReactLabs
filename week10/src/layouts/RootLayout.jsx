import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar.jsx";
import OfflineBar from "../components/OfflineBar.jsx";
import OutboxBar from "../components/OutboxBar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import UpdateBanner from "../components/UpdateBanner.jsx";

export default function RootLayout() {
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

      <footer className="app__footer">
        Departures Board · PWA · React Router, TanStack Query &amp; Firebase · Almaty International (ALA)
      </footer>
    </div>
  );
}