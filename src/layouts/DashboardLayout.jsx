import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ userRole }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
