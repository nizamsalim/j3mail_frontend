import { Navigate } from "react-router-dom";
import { useAuth } from "../../Common/AuthContext";

export function ProtectedRoute({ children, redirect }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={`/auth/login?redirect=${redirect}`} />;
  }
  return children;
}
