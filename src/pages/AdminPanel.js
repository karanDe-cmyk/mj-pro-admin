import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch } from "react-redux";

import { logout } from "../features/auth/authSlice";
import Header from "../components/Header";




const AdminPanel = () => {
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username") || "Admin";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: <i className="fa fa-home" aria-hidden="true"></i>,
        },
        {
            label: "User Management",
            icon: <i className="fa fa-users" aria-hidden="true"></i>,
            children: [
                { label: "Approved Users", path: "/admin/user-management/approved" },
                { label: "Unapproved Users", path: "/admin/user-management/unapproved" },
            ],
        },
        {
            label: "Game Management",
            icon: <i className="fa fa-gamepad" aria-hidden="true"></i>,
            children: [
                { label: "Game Name", path: "/admin/game-management/game-name" },
                { label: "Market Declare Result", path: "/admin/game-management/declare-market-result" },
                { label: "Game Rates", path: "/admin/game-management/game-rates" },
                { label: "Users Bid History", path: "/admin/game-management/bit-history" },
              
            ],
        },
        {
            label: "Game & Number",
            icon: <i className="fa fa-dice" aria-hidden="true"></i>,
            children: [
                { label: "Single Digit", path: "/admin/game-number/single-digit" },
                { label: "Jodi Digit", path: "/admin/game-number/jodi-digit" },
                { label: "Single Pana", path: "/admin/game-number/single-pana" },
                { label: "Double Pana", path: "/admin/game-number/double-pana" },
                { label: "Triple Pana", path: "/admin/game-number/triple-pana" },
                { label: "Half Sangam", path: "/admin/game-number/half-sangam" },
                { label: "Full Sangam", path: "/admin/game-number/full-sangam" },
            ],
        },
        {
            label: "Wallet Management",
            icon: <i className="fa fa-wallet" aria-hidden="true"></i>,
            children: [
                // { label: "All Fund Requests", path: "/admin/wallet-management/all-fund-request" },
                // { label: "Fund Request", path: "/admin/wallet-management/fund-request" },
                // { label: "Offline Payment Records", path: "/admin/wallet-management/offline-payment-records" },
                { label: "Withdraw Request", path: "/admin/wallet-management/withdraw-request" },
                { label: "Add Fund (User Wallet)", path: "/admin/wallet-management/add-fund" },
                { label: "Remove Money", path: "/admin/wallet-management/remove-money" },
            ],
        },
        {
            label: "Starline Management",
            icon: <i className="fa fa-star" aria-hidden="true"></i>,
            children: [
                { label: "Game Name", path: "/admin/starline-management/game-name" },
                { label: "Bid History", path: "/admin/starline-management/bid-history" },
                { label: "Declare Result", path: "/admin/starline-management/declare-result-starline" },
                { label: "Game Rates", path: "/admin/starline-management/game-rates" },
            ],
        },
        {
            label: "All Bid History",
            path: "/admin/starline-management/all-bid-history",
            icon: <i class="fa fa-history" aria-hidden="true"></i>,
        },
        {
            label: "Auto Deposit History",
            path: "/admin/auto-deposit-history",
            icon: <i className="fa fa-history" aria-hidden="true"></i>,
        },
       
        {
            label: "Notice Management",
            path: "/admin/notice-management",
            icon: <i className="fa fa-cog" aria-hidden="true"></i>,
        },

        {
            label: "Settings",
            icon: <i className="fa fa-cog"></i>,
            children: [
                { label: "General Setting", path: "/admin/settings/main" },
                { label: "Bank Details", path: "/admin/settings/bank-details" },
                { label: "App Links", path: "/admin/settings/app-links" },
                { label: "Home Title", path: "/admin/settings/home-title" },
                { label: "UPI Payment ID", path: "/admin/settings/upi-payment" }, // Added UPI Payment ID
                { label: "Other Settings", path: "/admin/settings/other-settings" }, // Added Other Settings
                { label: "How To Play", path: "/admin/settings/how-to-play" }, // Added How To Play
                { label: "Refer & Earn", path: "/admin/settings/refer-earn" }, // Added Refer & Earn
                { label: "Welcome Settings", path: "/admin/settings/welcome-settings" }, // Added Welcome Settings

            ],
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleMenu = (label) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [label]: !prevOpenMenus[label],
        }));
    };

  const handleLogout = () => {
    dispatch(logout()); // Reset Redux state
    localStorage.removeItem("isAuthenticated"); 
    localStorage.removeItem("accessToken"); // Clear authentication from localStorage
    navigate("/"); // Redirect to login
  };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderMenuItems = (items) => {
        return items.map((item) => (
            <li key={item.label} className="mb-2 overflow-y-auto">
                {item.children ? (
                    <>
                        <div
                            onClick={() => toggleMenu(item.label)}
                            className="cursor-pointer flex justify-between items-center px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700"
                        >
                            <div className="flex items-center">
                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                <span className="font-medium text-white">{item.label}</span>
                            </div>
                            <span className="text-gray-400">{openMenus[item.label] ? "▲" : "▼"}</span>
                        </div>
                        {openMenus[item.label] && (
                            <ul className="ml-4 mt-2 border-l-4 border-blue-500 pl-4">
                                {renderMenuItems(item.children)}
                            </ul>
                        )}
                    </>
                ) : (
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "block px-3 py-2 bg-blue-500 text-white rounded-md"
                                : "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                        }
                    >
                        <div className="flex items-center">
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            {item.label}
                        </div>
                    </NavLink>
                )}
            </li>
        ));
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/5
            
             bg-gray-800 text-white fixed h-screen overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                    <ul>{renderMenuItems(menuItems)}</ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-[20%] h-fit overflow-y-auto">
                {/* Header */}
                <Header username={username} handleLogout={handleLogout} />

                {/* Scrollable Main Content */}
                <main className="p-1 overflow-y-auto h-fit">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
