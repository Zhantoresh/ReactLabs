import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import PageLoader from "./PageLoader.jsx";


export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();


  if (loading) {
    return <PageLoader text="Checking your session…" />;
  }

  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}