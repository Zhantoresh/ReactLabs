import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import PageLoader from "./PageLoader.jsx";

export default function GuestOnly() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader text="Checking your session…" />;
  }

  if (user) {
    const from = location.state?.from;
    const to = from ? `${from.pathname}${from.search}` : "/profile";
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}