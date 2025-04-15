import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../components/Loader";

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get("token");
      const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

      if (token && user) {
        // Redirect logged-in users away from auth pages
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/user");
        }
      } else {
        // Allow unauthenticated users to access auth pages
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  if (loading) return <Loader />;

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
