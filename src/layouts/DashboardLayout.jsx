import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Cookies from "js-cookie";

const DashboardLayout = ({ userRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get("token");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const checkAuthStatus = () => {
            if (!token) {
                navigate('/')
            } else {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [location.pathname, token]);

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
