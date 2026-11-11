import { lazy } from "react";
import { Routes, Route } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import GuestOnly from "./components/GuestOnly.jsx";
import HomePage from "./pages/HomePage.jsx";
import FlightsPage from "./pages/FlightsPage.jsx";

const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const FlightDetailsPage = lazy(() => import("./pages/FlightDetailsPage.jsx"));
const NewFlightPage = lazy(() => import("./pages/NewFlightPage.jsx"));
const BoardPage = lazy(() => import("./pages/BoardPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const MyFlightsPage = lazy(() => import("./pages/MyFlightsPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="board" element={<BoardPage />} />

        <Route path="flights">
          <Route index element={<FlightsPage />} />
          {/* signed-in users only; "new" is matched before ":id" because static segments win */}
          <Route element={<RequireAuth />}>
            <Route path="new" element={<NewFlightPage />} />
          </Route>
          <Route path=":id" element={<FlightDetailsPage />} />
        </Route>

        {/* signed-in users only */}
        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-flights" element={<MyFlightsPage />} />
        </Route>

        {/* guests only: a signed-in user is redirected to /profile */}
        <Route element={<GuestOnly />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}