import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Spin } from "antd";
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

const Login = lazy(() => import("../pages/auth/Login"));

const PageLoader = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
    <Spin size="large" />
  </div>
);

const PrivateLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const AllRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PreventRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route index element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AllRoutes;