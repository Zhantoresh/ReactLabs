import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar.jsx";
import PageLoader from "../components/PageLoader.jsx";
import UpdateBanner from "../components/UpdateBanner.jsx";

export default function RootLayout() {
  return (
    <div className="app">
      <NavBar />
      <UpdateBanner />

      <main className="app__main">
        {/* While a lazy page is being downloaded, show the fallback */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="app__footer">
        Departures Board · React Router, TanStack Query &amp; Firebase Auth · Almaty International (ALA)
      </footer>
    </div>
  );
}