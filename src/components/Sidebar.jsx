import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdManageAccounts,
    MdWork,
    MdFolderShared,
    MdSettings,
    MdLogout,
    MdClose,
} from "react-icons/md";

// Define navigation items for the sidebar
const navItemsTop = [
    { href: "/admin", icon: <MdDashboard size={18} />, label: "Dashboard" },
    {
        href: "/admin/employees-management",
        icon: <MdManageAccounts size={18} />,
        label: "Employees Management",
    },
    {
        href: "/admin/job-management",
        icon: <MdWork size={18} />,
        label: "Managers Management",
    },
    // {
    //     href: "/admin/resource-management",
    //     icon: <MdFolderShared size={18} />,
    //     label: "Resource Management",
    // },
];

const navItemsBottom = [
    { href: "/admin/settings", icon: <MdSettings size={18} />, label: "Settings" },
    { href: "/admin/logout", icon: <MdLogout size={18} />, label: "Logout" },
];

const Separator = () => (
    <div className="w-full my-4 h-[1px] bg-gradient-to-r from-primary/5 via-primary to-primary/5"></div>
);

const NavItem = ({ href, icon, label, isActive }) => (
    <li className="w-full">
        <Link to={href}>
            <div
                className={`flex items-center gap-4 p-3 rounded-2xl text-xs font-montserrat transition-all
        ${isActive
                        ? "bg-primary text-white font-semibold text-textdark shadow-sidebar"
                        : "text-textlight font-medium"}
      `}
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


const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div
            className={`lg:w-[320px] w-[290px] fixed left-0 md:translate-x-0 top-0 h-screen p-5 transition-all duration-300 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
        >
            <div className="w-full bg-white shadow-sidebar rounded-3xl h-full p-2 flex flex-col justify-between overflow-y-auto">
                {/* Sidebar top */}
                <div className="w-full text-center flex flex-col">
                    <div className="w-full py-7 px-4">
                        <h2 className="text-[22px] font-montserrat text-textdark font-bold leading-[135%]">
                            RestaurantPro
                        </h2>
                    </div>

                    <Separator />

                    <ul className="w-full pt-8 flex flex-col gap-2">
                        {navItemsTop.map((item) => (
                            <NavItem
                                key={item.href}
                                {...item}
                                isActive={pathname === item.href}
                            />
                        ))}
                    </ul>
                </div>

                {/* Sidebar bottom */}
                <div className="w-full">
                    <ul className="w-full pt-8 flex flex-col gap-2">
                        {navItemsBottom.map((item) => (
                            <NavItem
                                key={item.href}
                                {...item}
                                isActive={pathname === item.href}
                            />
                        ))}
                    </ul>
                </div>

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
