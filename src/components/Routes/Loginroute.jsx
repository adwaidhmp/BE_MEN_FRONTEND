import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LoginRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return <Navigate to={user.is_staff ? "/admin" : "/home"} replace />;
  }

  return children;
};


export default LoginRoute;
