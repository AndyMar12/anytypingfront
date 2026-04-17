import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ requireSuperadmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (requireSuperadmin && user.role !== "superadmin") {
    return <Navigate to="/login" replace />;;
  }

  return <Outlet />;
}