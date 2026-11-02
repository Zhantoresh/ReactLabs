import { lazy } from "react";
import { Routes, Route } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import FlightsPage from "./pages/FlightsPage.jsx";

// Lazy-loaded pages: their code is downloaded only when the route is opened.
// <Suspense> for them lives in RootLayout around <Outlet />.
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const FlightDetailsPage = lazy(() => import("./pages/FlightDetailsPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />

        <Route path="flights">
          <Route index element={<FlightsPage />} />
          <Route path=":id" element={<FlightDetailsPage />} />
        </Route>

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}