import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Header from "../components/Header";
const { Sider, Content } = Layout;

const AdminPanel = () => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username") || "Admin";

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
            key: "wallet-management",
            label: "Wallet Management",
            icon: <i className="fa fa-wallet" />,
            children: [
                { key: "withdraw-request", label: "Withdraw Request", path: "/admin/wallet-management/withdraw-request" },
                { key: "add-fund", label: "Add Fund (User Wallet)", path: "/admin/wallet-management/add-fund" },
                { key: "remove-money", label: "Remove Money", path: "/admin/wallet-management/remove-money" },
            ],
        },
        {
            key: "settings",
            label: "Settings",
            icon: <i className="fa fa-cog" />,
            children: [
                { key: "general-settings", label: "General Setting", path: "/admin/settings/main" },
                { key: "bank-details", label: "Bank Details", path: "/admin/settings/bank-details" },
                { key: "app-links", label: "App Links", path: "/admin/settings/app-links" },
                { key: "home-title", label: "Home Title", path: "/admin/settings/home-title" },
                { key: "upi-payment", label: "UPI Payment ID", path: "/admin/settings/upi-payment" },
            ],
        },
        { key: "all-bid-history", label: "All Bid History", path: "/admin/starline-management/all-bid-history", icon: <i className="fa fa-history" /> },
        { key: "auto-deposit-history", label: "Auto Deposit History", path: "/admin/auto-deposit-history", icon: <i className="fa fa-history" /> },
        { key: "notice-management", label: "Notice Management", path: "/admin/notice-management", icon: <i className="fa fa-bell" /> },
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
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
                <div className="p-4 text-white text-center text-lg font-bold">Admin Panel</div>
                <Menu theme="dark" mode="inline">{renderMenu(menuItems)}</Menu>
            </Sider>
            <Layout>
                <Header username={username} handleLogout={handleLogout} onToggleSidebar={() => setCollapsed(!collapsed)} />
                <Content style={{ padding: "16px", background: "#fff" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPanel;
