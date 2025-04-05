import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
    const location = useLocation();
    
      useEffect(() => {
        window.scrollTo(0, 0);
      }, [location.pathname]);

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