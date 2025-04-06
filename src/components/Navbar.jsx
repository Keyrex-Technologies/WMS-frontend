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
    if (pathname === "/admin/employees-management") return "Employees Management";
    if (pathname === "/admin/attendance-management") return "Attendance Management";
    if (pathname === "/admin/payroll-management") return "Payroll Management";
    if (pathname === "/admin/settings") return "Settings";
    if (pathname === "/admin/reports") return "Generate Reports";
    return "Dashboard"; // Default fallback title
  };

  // Function to get the user's initials for the profile bubble
  const getUserInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  const userName = "Alice Roberts"; // Sample user name
  const userInitials = getUserInitials(userName);

  return (
    <nav className="w-full p-4">
      <div className="w-full h-[60px] bg-white rounded-3xl shadow-sidebar flex items-center justify-between md:px-10 px-6">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 bg-primary rounded-full text-white"
          >
            <IoIosArrowBack size={24} />
          </button>

          {/* Page Title */}
          <div className="text-black text-lg font-semibold">
            {getPageTitle()}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {userInitials}
          </div>

          {/* User Info */}
          <div className="hidden md:flex flex-col text-black text-sm">
            <span>{userName}</span>
            <Link to="/admin/settings" className="text-primary">Profile Settings</Link>
          </div>

          {/* User Icon (for smaller screens) */}
          <FiUser size={24} className="text-primary md:hidden" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
