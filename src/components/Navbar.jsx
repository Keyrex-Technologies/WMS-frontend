import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Function to get the page title based on the current route
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname === "/admin/user-management") return "User Management";
    if (pathname === "/admin/job-management") return "Job Management";
    if (pathname === "/admin/resource-management") return "Resource Management";
    if (pathname === "/admin/settings") return "Settings";
    if (pathname === "/admin/logout") return "Logout";
    return "Dashboard"; // Default fallback title
  };

  return (
    <nav className="w-full p-4">
      <div className="w-full h-[60px] bg-white rounded-3xl shadow-sidebar flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 bg-primary rounded-full text-white"
          >
            <IoIosArrowBack size={24} />
          </button>

          <div className="text-black text-lg font-semibold">
            {getPageTitle()}
          </div>
        </div>

        {/* User Icon and User Info */}
        <div className="flex items-center gap-4">
          <FiUser size={24} className="text-primary" />
          <div className="text-black">User</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
