import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Cookies from "js-cookie";
import { useSocket } from "../context/SocketContext";

const DashboardLayout = ({ userRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get("token");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const restrictedPaths = ["admin", "manager", "user"];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { socket, isConnected } = useSocket();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        return () => {
          if (socket?.emit && user?._id) {
            socket.emit('check-out', {
              userId: user._id,
              date: new Date(),
            });
          } else {
            console.warn("Socket or user is not available on unmount");
          }
        };
      }, [socket, user]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const checkAuthStatus = () => {
            const currentPath = location.pathname.split("/")[1];
            const isRestricted = restrictedPaths.includes(currentPath);

            if (!token && isRestricted) {
                navigate('/')
            } else if (user?.role === "admin" && currentPath !== "admin") {
                navigate("/admin");
            } else if (user?.role === "manager" && currentPath !== "manager") {
                navigate(`/manager`);
            } else if (user?.role === "employee" && currentPath !== "user") {
                navigate("/user");
            } else {
                setLoading(false);
            }
        };

        setLoading(true);
        checkAuthStatus();
    }, [token, location.pathname]);

    if (loading) return <Loader />;

    return (
        <div className="w-full min-h-screen flex justify-end">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userRole={userRole} />

            <div className="lg:w-[calc(100%-330px)] md:w-[calc(100%-300px)] w-full flex flex-col gap-10">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="sm:px-6 px-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
