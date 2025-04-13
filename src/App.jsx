import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import DashbaordLayout from "./layouts/DashboardLayout";
import AdminHome from "./pages/admin/AdminHome";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import AddEmployee from "./pages/admin/AddEmployee";
import UpdateEmployee from "./pages/admin/UpdateEmployee";
import AttendanceManagement from "./pages/common/AttendanceManagement";
import Settings from "./pages/admin/Settings";
import PayrollManagement from "./pages/admin/PayrollManagement";
// import GenerateReport from "./pages/admin/GenerateReport";
import ManagerHome from "./pages/manager/ManagerHome";
import PayrollReport from "./pages/common/PayrollReport";
import Profile from "./pages/manager/Profile";
import ViewAttendance from "./pages/user/ViewAttendance";
import UserHome from "./pages/user/UserHome";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      { path: "sign-up", element: <SignUp /> },
      { path: "verify-otp", element: <VerifyOTP /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: <DashbaordLayout userRole={"admin"} />,
    errorElement: <Error />,
    children: [
      { path: "", element: <AdminHome /> },
      { path: "employees-management", element: <EmployeeManagement /> },
      { path: "add-employee", element: <AddEmployee /> },
      { path: "update-employee/:id", element: <UpdateEmployee /> },
      { path: "attendance-management", element: <AttendanceManagement /> },
      { path: "payroll-management", element: <PayrollReport /> },
      // { path: "reports", element: <GenerateReport /> },
      { path: "settings", element: <Settings /> },

    ],
  },
  {
    path: "/manager",
    element: <DashbaordLayout userRole={"manager"} />,
    errorElement: <Error />,
    children: [
      { path: "", element: <ManagerHome /> },
      { path: "attendance-management", element: <AttendanceManagement /> },
      { path: "payroll-reports", element: <PayrollReport /> },
      { path: "settings", element: <Profile /> },
    ],
  },
  {
    path: "/user",
    element: <DashbaordLayout userRole={"user"} />,
    errorElement: <Error />,
    children: [
      { path: "", element: <UserHome /> },
      { path: "view-attendance", element: <ViewAttendance /> },
      { path: "settings", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <Error />
  }
]);

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={appRouter} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Suspense>
  );
};

export default App;