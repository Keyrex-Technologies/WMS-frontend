import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountNotApproved from "./pages/auth/AccountNotApproved";
// Lazy loaded components
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));

const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const DashbaordLayout = lazy(() => import("./layouts/DashboardLayout"));

const DashbaordHome = lazy(() => import("./pages/common/DashbaordHome"));
const AttendanceManagement = lazy(() => import("./pages/common/AttendanceManagement"));
const PayrollReport = lazy(() => import("./pages/common/PayrollReport"));
const Profile = lazy(() => import("./pages/common/Profile"));

const EmployeeManagement = lazy(() => import("./pages/admin/EmployeeManagement"));
const AddEmployee = lazy(() => import("./pages/admin/AddEmployee"));
const UpdateEmployee = lazy(() => import("./pages/admin/UpdateEmployee"));

const ViewAttendance = lazy(() => import("./pages/user/ViewAttendance"));
const UserHome = lazy(() => import("./pages/user/UserHome"));

const Loader = lazy(() => import("./components/Loader"));
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
      { path: "not-approve", element: <AccountNotApproved /> },
    ],
  },
  {
    path: "/admin",
    element: <DashbaordLayout userRole={"admin"} />,
    errorElement: <Error />,
    children: [
      { path: "", element: <DashbaordHome /> },
      { path: "employees-management", element: <EmployeeManagement /> },
      { path: "add-employee", element: <AddEmployee /> },
      { path: "update-employee/:id", element: <UpdateEmployee /> },
      { path: "attendance-management", element: <AttendanceManagement /> },
      { path: "payroll-management", element: <PayrollReport /> },
      // { path: "reports", element: <GenerateReport /> },
      { path: "settings", element: <Profile /> },

    ],
  },
  {
    path: "/manager",
    element: <DashbaordLayout userRole={"manager"} />,
    errorElement: <Error />,
    children: [
      { path: "", element: <DashbaordHome /> },
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