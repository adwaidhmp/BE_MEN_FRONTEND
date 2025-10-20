import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NoAccess from "../no access";

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.is_staff) {
    // Logged in but not admin → show NoAccess
    return <NoAccess />;
  }

  // Admin → allow access
  return children;
};

export default AdminRoute;
