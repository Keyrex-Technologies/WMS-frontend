import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdManageAccounts,
    MdWork,
    MdSettings,
    MdLogout,
    MdClose,
} from "react-icons/md";
import { IoMdCash } from "react-icons/io";
import Cookies from "js-cookie";
import { logout } from "../utils/profile";
import { useSocket } from "../context/SocketContext";

const adminNavItems = [
    { href: "/admin", icon: <MdDashboard size={18} />, label: "Dashboard" },
    { href: "/admin/employees-management", icon: <MdManageAccounts size={18} />, label: "Employees Management" },
    { href: "/admin/attendance-management", icon: <MdWork size={18} />, label: "Attendance Management" },
    { href: "/admin/payroll-management", icon: <IoMdCash size={18} />, label: "Payroll Management" },
    // { href: "/admin/reports", icon: <MdWork size={18} />, label: "Generate Reports" },
];

const managerNavItems = [
    { href: "/manager", icon: <MdDashboard size={18} />, label: "Dashboard" },
    { href: "/manager/attendance-management", icon: <MdWork size={18} />, label: "Attendance Management" },
    { href: "/manager/payroll-reports", icon: <MdWork size={18} />, label: "Generate Reports" },
];

const userNavItems = [
    { href: "/user", icon: <MdDashboard size={18} />, label: "Home" },
    { href: "/user/view-attendance", icon: <MdWork size={18} />, label: "View Attendance" },
];

const navItemsBottom = [
    { href: "/settings", icon: <MdSettings size={18} />, label: "Settings" },
    { href: "", icon: <MdLogout size={18} />, label: "Logout" },
];

const Separator = () => (
    <div className="w-full my-4 h-[1px] bg-gradient-to-r from-primary/5 via-primary to-primary/5"></div>
);

const NavItem = ({ href, icon, label, isActive, onClick }) => (
    <li className="w-full">
        <Link to={href} onClick={onClick}>
            <div
                className={`flex items-center gap-4 p-3 rounded-2xl text-xs font-montserrat transition-all
                ${isActive
                        ? "bg-primary text-white font-semibold text-textdark shadow-sidebar"
                        : "text-textlight font-medium"}`}
            >
                <div
                    className={`w-[30px] h-[30px] rounded-xl flex items-center justify-center 
                    ${isActive
                            ? "text-primary bg-white"
                            : "bg-white text-primary shadow-card-shadow"
                        }`}
                >
                    {icon}
                </div>
                {label}
            </div>
        </Link>
    </li>
);

const Sidebar = ({ isSidebarOpen, toggleSidebar, userRole }) => {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const { socket } = useSocket();

    const handleLogout = async () => {
        const user = JSON.parse(Cookies.get("user"));
        if (user.role === "employee" && socket) {
            socket.emit('check-out', {
                userId: user?._id,
                date: new Date(),
            });
        }
        Cookies.remove("token");
        Cookies.remove("user");
        await logout()
        navigate('/')
    }

    const navItems = userRole === "admin" ? adminNavItems : userRole === "manager" ? managerNavItems : userNavItems;

    return (
        <div
            className={`lg:w-[320px] w-[290px] bg-white/10 backdrop-blur-3xl fixed left-0 md:translate-x-0 top-0 h-screen p-5 transition-all duration-300 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-[9999]`}
        >
            <div className="w-full bg-white shadow-sidebar rounded-3xl h-full p-2 flex flex-col justify-between overflow-y-auto">
                {/* Sidebar Top */}
                <div className="w-full text-center flex flex-col">
                    <div className="w-full py-7 px-4">
                        <h2 className="text-[22px] font-montserrat text-textdark font-bold leading-[135%]">
                            {userRole === "admin" ? "Admin Dashboard" : userRole === "manager" ? "Manager Dashboard" : "User Dashboard"}
                        </h2>
                    </div>

                    <Separator />

                    <ul className="w-full pt-8 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                {...item}
                                isActive={pathname === item.href}
                            />
                        ))}
                    </ul>
                </div>

                {/* Sidebar Bottom */}
                <div className="w-full">
                    <ul className="w-full pt-8 flex flex-col gap-2">
                        {navItemsBottom.map((item) => (
                            item.label === "Settings" ? (
                                <NavItem
                                    key={item.href}
                                    {...item}
                                    href={`/${userRole}${item.href}`}
                                    onClick={undefined}
                                    isActive={pathname === `/${userRole}${item.href}`}
                                />
                            ) : (
                                <li key={item.href} onClick={handleLogout} className={`w-full cursor-pointer flex items-center gap-4 p-3 rounded-2xl text-xs font-montserrat transition-all text-textlight font-medium`}>
                                    <div className={`w-[30px] h-[30px] rounded-xl flex items-center justify-center bg-white text-primary shadow-card-shadow`}>
                                        {item.icon}
                                    </div>
                                    {item.label}
                                </li>
                            )
                        ))}
                    </ul>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden absolute top-7 right-8 w-6 h-6 flex items-center justify-center text-xl font-semibold text-white bg-primary rounded-full"
                >
                    <MdClose size={16} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
