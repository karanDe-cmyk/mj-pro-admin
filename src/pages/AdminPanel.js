import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Layout, Menu } from "antd";
import Header from "../components/Header";
import "./custom.css"; // Import the custom CSS

const { Sider, Content } = Layout;

const AdminPanel = () => {
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1080);
  const [openKeys, setOpenKeys] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 1080;
      setIsMobile(isSmallScreen);
      // On desktop show sidebar; on mobile, you may default to hidden.
      setShowSidebar(!isSmallScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide sidebar when clicking outside on mobile (ignore clicks on the hamburger button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && showSidebar) {
        const sidebar = document.getElementById("sidebar");
        const hamburger = document.querySelector(".hamburger-button");
        // If the click target is not inside the sidebar or the hamburger button, hide the sidebar.
        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          !(hamburger && hamburger.contains(event.target))
        ) {
          setShowSidebar(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, showSidebar]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // Define menu items with unique keys
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <i className="fa fa-home" />,
    },
    {
      key: "user-management",
      label: "User Management",
      icon: <i className="fa fa-users" />,
      children: [
        {
          key: "approved-users",
          label: "Approved Users",
          path: "/admin/user-management/approved",
        },
        {
          key: "unapproved-users",
          label: "Unapproved Users",
          path: "/admin/user-management/unapproved",
        },
      ],
    },
    {
      key: "market-result-top",
      label: "Declare Result",
      path: "/admin/game-management/declare-market-result",
      icon: <i className="fa fa-bullhorn" />,
    },
    {
      label: "Starline Management",
      icon: <i className="fa fa-star" aria-hidden="true"></i>,
      children: [
        { key: "starline-game-name", label: "Game Name", path: "/admin/starline-management/game-name" },
        { key: "starline-bid-history", label: "Bid History", path: "/admin/starline-management/bid-history" },
        { key: "starline-declare-result", label: "Declare Result", path: "/admin/starline-management/declare-result-starline" },
        { key: "starline-game-rates", label: "Game Rates", path: "/admin/starline-management/game-rates" },
        { key: "starline-bid-revert", label: "Starline Bid Revert", path: "/admin/starline-management/starline-bid-revert" },
      ],
    },
    {
      key: "winning-prediction",
      label: "Winning Prediction",
      path: "/admin/winning-prediction",
      icon: <i className="fa fa-circle" />,
    },
    {
      key: "auto-deposit-history",
      label: "Auto Deposit History",
      path: "/admin/auto-deposit-history",
      icon: <i className="fa fa-history" />,
    },
    {
      key: "auto-withdrawal-history",
      label: "Auto Withdrawal History",
      path: "/admin/auto-withdrawal-history",
      icon: <i className="fa fa-exchange" />,
    },
    {
      key: "wallet-management",
      label: "Wallet Management",
      icon: <i className="fa fa-wallet" />,
      children: [
        {
          key: "all-deposit-history",
          label: "All Deposit History",
          path: "/admin/wallet-management/all-deposit-history",
        },
        {
          key: "all-deposit-by-admin",
          label: "All Deposit By Admin",
          path: "/admin/wallet-management/all-deposit-by-admin",
        },
        {
          key: "withdraw-request",
          label: "Withdraw Request",
          path: "/admin/wallet-management/withdraw-request",
        },
        {
          key: "add-fund",
          label: "Add Fund (User Wallet)",
          path: "/admin/wallet-management/add-fund",
        },
        {
          key: "remove-money",
          label: "Remove Money",
          path: "/admin/wallet-management/remove-money",
        },
      ],
    },
    {
      key: "game-management",
      label: "Game Management",
      icon: <i className="fa fa-gamepad" />,
      children: [
        {
          key: "game-name",
          label: "Game Name",
          path: "/admin/game-management/game-name",
        },
        {
          key: "market-result",
          label: "Declare Result",
          path: "/admin/game-management/declare-market-result",
          icon: <i className="fa fa-bullhorn" />,
        },
        {
          key: "game-rates",
          label: "Game Rates",
          path: "/admin/game-management/game-rates",
        },
        {
          key: "bid-history",
          label: "Users Bid History",
          path: "/admin/game-management/bit-history",
        },
      ],
    },
    {
      label: "Game & Number",
      icon: <i className="fa fa-dice" aria-hidden="true"></i>,
      children: [
        { key: "single-digit", label: "Single Digit", path: "/admin/game-number/single-digit" },
        { key: "jodi-digit", label: "Jodi Digit", path: "/admin/game-number/jodi-digit" },
        { key: "single-pana", label: "Single Pana", path: "/admin/game-number/single-pana" },
        { key: "double-pana", label: "Double Pana", path: "/admin/game-number/double-pana" },
        { key: "triple-pana", label: "Triple Pana", path: "/admin/game-number/triple-pana" },
        { key: "half-sangam", label: "Half Sangam", path: "/admin/game-number/half-sangam" },
        { key: "full-sangam", label: "Full Sangam", path: "/admin/game-number/full-sangam" },
      ],
    },
    {
      key: "settings",
      label: "Settings",
      icon: <i className="fa fa-cog" />,
      children: [
        {
          key: "main-setting",
          label: "Main Setting",
          path: "/admin/settings/main",
          icon: <i className="fa fa-cog" />,
        },
        {
          key: "slider-management",
          label: "Slider-Management",
          path: "/admin/settings/slider-management",
          icon: <i className="fa fa-sliders" />,
        },
        {
          key: "change-password",
          label: "Change Password",
          path: "/admin/settings/ChangePassword",
          icon: <i className="fa-solid fa-key"></i>,
        },
        {
          key: "FCM-Management",
          label: "FCM Management",
          path: "/admin/settings/fcm",
          icon: <i className="fa-solid fa-bell"></i>,
        },
      ],
    },
    // {
    //   key: "galidisawar-games",
    //   label: "Galidisawar Games",
    //   icon: <i className="fa fa-dice" />,
    //   children: [
    //     { key: "galidi-game-name", label: "Game Name", path: "/admin/galidisawer-games/game-list" },
    //     { key: "galidi-bid-history", label: "Bid History", path: "/admin/galidisawer-games/bid-history" },
    //     { key: "galidi-declare-results", label: "Declare Results", path: "/admin/galidisawer-games/declare-result" },
    //     { key: "galidi-game-rates", label: "Game Rates", path: "/admin/galidisawer-games/game-rates" },
    //     { key: "galidisawar-bid-revert", label: "Gali Disawar Bid Revert", path: "/admin/galidisawer-games/galidisawar-bid-revert" },
    //   ],
    // },
    {
      key: "Jackpot-games",
      label: "Jackpot Games",
      icon: <i className="fa fa-dice" />,
      children: [
        { key: "jackpot-game-name", label: "Game Name", path: "/admin/jackpot-games/jackpot-game-list" },
        { key: "jackpot-bid-history", label: "Bid History", path: "/admin/jackpot-games/jackpot-bid-history" },
        { key: "jackpot-declare-results", label: "Declare Results", path: "/admin/jackpot-games/jackpot-declare-result" },
        { key: "jackpot-game-rates", label: "Game Rates", path: "/admin/jackpot-games/jackpot-game-rates" },
        { key: "jackpot-bid-revert", label: " Jackpot Bid Revert", path: "/admin/jackpot-games/jackpot-bid-revert" },
      ],
    },
    {
      key: "notice-management",
      label: "Notice Management",
      path: "/admin/notice-management",
      icon: <i className="fa fa-bell" />,
      children: [
        { key: "Withdraw & Fund Note", label: "Withdraw & Fund Note", path: "/admin/notes" },
      ],
    },
    {
      key: "all-bid-history",
      label: "All Bid History",
      path: "/admin/all-bid-history",
      icon: <i className="fa fa-history" />,
    },
    {
      key: "bidrevert",
      label: "BidRevert",
      path: "/admin/bidrevert",
      icon: <i className="fa fa-history" />,
    },
    {
      key: "custom-notification",
      label: "Custom Notification",
      path: "/admin/custom-notification",
      icon: <i className="fa fa-history" />,
    },
  ];

  // Determine selected keys based on the location
  const getSelectedKeys = () => {
    const { pathname } = location;
    const selected = [];
    menuItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.path === pathname) {
            selected.push(child.key);
          }
        });
      } else {
        if (item.path === pathname) {
          selected.push(item.key);
        }
      }
    });
    return selected;
  };

  const selectedKeys = getSelectedKeys();

  useEffect(() => {
    if (location.pathname === "/admin/game-management/declare-market-result") {
      setOpenKeys((prevKeys) =>
        prevKeys.includes("game-management")
          ? prevKeys
          : [...prevKeys, "game-management"]
      );
    }
    if (location.pathname.startsWith("/admin/settings")) {
      setOpenKeys((prevKeys) =>
        prevKeys.includes("settings")
          ? prevKeys
          : [...prevKeys, "settings"]
      );
    }
  }, [location.pathname]);

  const renderMenu = (items) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((sub) => (
            <Menu.Item key={sub.key} icon={sub.icon ? sub.icon : null}>
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

  // Toggle sidebar visibility when hamburger is clicked
  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {showSidebar && (
        <Sider
          id="sidebar"
          theme="dark"
          width={240}
          collapsedWidth={0}
          style={{
            height: "100vh",
            overflowY: "auto",
            position: "fixed",
            left: 0,
            zIndex: 1000,
            transition: "all 0.3s",
            backgroundColor: "#1F2640",
          }}
          className="custom-scrollbar"
        >
          <div className="p-4 text-center text-lg font-bold">
            <NavLink to="/admin/dashboard" style={{ color: "#556EE6" }}>
              Admin Panel
            </NavLink>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
          >
            {renderMenu(menuItems)}
          </Menu>
        </Sider>
      )}

      <Layout
        style={{
          marginLeft: showSidebar ? "240px" : "0px",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Make sure your Header component's hamburger button has the className "hamburger-button"
            and calls the onToggleSidebar prop. */}
        <Header onToggleSidebar={handleToggleSidebar} handleLogout={handleLogout} />
        <Content
          style={{
            padding: "16px",
            background: "#f3edf7",
            overflowY: "auto",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
