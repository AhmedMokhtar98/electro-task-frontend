import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { auth } = useSelector((state) => state.authData);

  const checkAuthorizedUser = auth ? true : false;
  return checkAuthorizedUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
