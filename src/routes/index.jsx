import { useLayoutEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import PreventRoute from "./PreventRoute";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "@/common/NotFoundPage";
import Profile from "@/pages/profile/Profile";
import Layout from "@/layout";
import Tasks from "@/pages/tasks/Tasks";
import Register from "@/pages/auth/Register";
import EmailConfirmation from "@/pages/auth/EmailConfirmation";
import ResetPassword from "@/pages/auth/ResetPassword";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import { useTheme } from "@/layout/themeColor/ThemeContext";

const PrivateLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const LightThemeOnly = () => {
  const { setForcedThemeMode } = useTheme();

  useLayoutEffect(() => {
    setForcedThemeMode("light");

    return () => setForcedThemeMode(null);
  }, [setForcedThemeMode]);

  return <Outlet />;
};

const AllRoutes = () => (
  <Routes>
      <Route element={<PreventRoute />}>
        <Route element={<LightThemeOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route index element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AllRoutes;
