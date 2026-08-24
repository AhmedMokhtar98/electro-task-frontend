import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PreventRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PreventRoute;
