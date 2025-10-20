import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.is_banned) {
    // Banned user → redirect to banned page or login with message
    return <Navigate to="/no-access" replace />;
  }

  if (user.is_staff) {
    // Admin trying to access normal user route → redirect to /admin
    return <Navigate to="/admin" replace />;
  }

  // Normal user → allow access
  return children;
};

export default ProtectedRoute;