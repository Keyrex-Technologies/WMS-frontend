import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import DashbaordLayout from "./layouts/DashboardLayout";
import AdminHome from "./pages/admin/AdminHome";

const Loader = lazy(() => import("./components/Loader"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Error = lazy(() => import("./components/Error"));


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      { path: "", element: <Login /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/verify-otp", element: <VerifyOTP /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: <DashbaordLayout />,
    errorElement: <Error />,
    children: [
      { path: "", element: <AdminHome /> },
    ],
  },
]);

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={appRouter} />
    </Suspense>
  );
};

export default App;