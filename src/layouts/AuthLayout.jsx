import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../components/Loader";

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuthStatus = () => {
      if (token) {
        const user = JSON.parse(Cookies.get("user"));
        navigate(`/user`)
      } else {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname, token]);

  if (loading) return <Loader />;

  return (
    <div className={`w-full flex flex-col items-center overflow-hidden `}>
      {/* max-w-[1724px] */}
      <div className={` w-full relative`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;