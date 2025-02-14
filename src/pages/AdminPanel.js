import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Layout, Menu } from "antd";
import Header from "../components/Header";

const { Sider, Content } = Layout;

const AdminPanel = () => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1080);
    const [showSidebar, setShowSidebar] = useState(!isMobile); // ✅ Controls sidebar visibility

    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username") || "Admin";

    useEffect(() => {
        const handleResize = () => {
            const isSmallScreen = window.innerWidth <= 1080;
            setIsMobile(isSmallScreen);
            setShowSidebar(!isSmallScreen);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ✅ Hide sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && showSidebar) {
                const sidebar = document.getElementById("sidebar");
                if (sidebar && !sidebar.contains(event.target)) {
                    setShowSidebar(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobile, showSidebar]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("accessToken");
        navigate("/");
    };

    const menuItems = [
        { key: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <i className="fa fa-home" /> },
        {
            key: "user-management",
            label: "User Management",
            icon: <i className="fa fa-users" />,
            children: [
                { key: "approved-users", label: "Approved Users", path: "/admin/user-management/approved" },
                { key: "unapproved-users", label: "Unapproved Users", path: "/admin/user-management/unapproved" },
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
        { key: "auto-deposit-history", label: "Auto Deposit History", path: "/admin/auto-deposit-history", icon: <i className="fa fa-history" /> },
        {
            key: "wallet-management",
            label: "Wallet Management",
            icon: <i className="fa fa-wallet" />,
            children: [
                { key: "all-deposit-history", label: "All Deposit History", path: "/admin/wallet-management/all-deposit-history" },
                { key: "withdraw-request", label: "Withdraw Request", path: "/admin/wallet-management/withdraw-request" },
                { key: "add-fund", label: "Add Fund (User Wallet)", path: "/admin/wallet-management/add-fund" },
                { key: "remove-money", label: "Remove Money", path: "/admin/wallet-management/remove-money" },
                

            ],
        },
        {
            key: "game-management",
            label: "Game Management",
            icon: <i className="fa fa-gamepad" />,
            children: [
                { key: "game-name", label: "Game Name", path: "/admin/game-management/game-name" },
                { key: "market-result", label: "Market Declare Result", path: "/admin/game-management/declare-market-result" },
                { key: "game-rates", label: "Game Rates", path: "/admin/game-management/game-rates" },
                { key: "bid-history", label: "Users Bid History", path: "/admin/game-management/bit-history" },
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
            key: "settings",
            label: "Settings",
            icon: <i className="fa fa-cog" />,
            children: [
                { label: "General Setting", path: "/admin/settings/main" },
                { label: "Bank Details", path: "/admin/settings/bank-details" },
                { label: "App Links", path: "/admin/settings/app-links" },
                { label: "Home Title", path: "/admin/settings/home-title" },
                { label: "UPI Payment ID", path: "/admin/settings/upi-payment" },
                { label: "Other Settings", path: "/admin/settings/other-settings" },
                { label: "How To Play", path: "/admin/settings/how-to-play" },
                { label: "Refer & Earn", path: "/admin/settings/refer-earn" },
                { label: "Welcome Settings", path: "/admin/settings/welcome-settings" },
                { label: "Qr Code", path: "/admin/settings/qr-code" },

            ],
        },
        { key: "notice-management", label: "Notice Management", path: "/admin/notice-management", icon: <i className="fa fa-bell" /> },
        { key: "all-bid-history", label: "All Bid History", path: "/admin/all-bid-history", icon: <i className="fa fa-history" /> },
        { key: "slider-management", label: "Slider Management", path: "/admin/slider-management", icon: <i className="fa fa-sliders" /> },
    ];

    const renderMenu = (items) =>
        items.map((item) =>
            item.children ? (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map((sub) => (
                        <Menu.Item key={sub.key}>
                            <NavLink to={sub.path}>{sub.label}</NavLink>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                    <NavLink to={item.path}>{item.label}</NavLink>
                </Menu.Item>
            )
        );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* ✅ Sidebar - Only Show When `showSidebar` is True */}
            {showSidebar && (
                <Sider
                    id="sidebar"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    theme="dark"
                    style={{
                        height: "100vh",
                        overflowY: "auto",
                        position: "fixed",
                        left: 0,
                        zIndex: 1000, // Keep it above other content
                        width: collapsed ? 80 : 200,
                        transition: "width 0.3s",
                        scrollbarWidth: "none", // Hide scrollbar in Firefox
                        msOverflowStyle: "none"
                    }}
                    className="custom-scrollbar"
                >

                    <div className="p-4 text-white text-center text-lg font-bold">Admin Panel</div>
                    <Menu theme="dark" mode="inline">
                        {renderMenu(menuItems)}
                    </Menu>
                </Sider>
            )}

            <Layout
                style={{
                    marginLeft: showSidebar && !isMobile ? (collapsed ? "80px" : "200px") : "0px",
                    transition: "margin-left 0.3s",
                }}
            >
                {/* ✅ Pass toggleSidebar function to Header */}
                <Header onToggleSidebar={() => setShowSidebar((prev) => !prev)} handleLogout={handleLogout} />
                <Content style={{ padding: "16px", background: "#fff", overflowY: "auto", minHeight: "100vh" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPanel;
