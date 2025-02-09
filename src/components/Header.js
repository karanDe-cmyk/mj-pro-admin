import { useState } from "react";
import { Layout, Dropdown, Menu, Button } from "antd";
import { MenuFoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header = ({ username = "Admin", onToggleSidebar, handleLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const menu = (
        <Menu>
            <Menu.Item key="settings" onClick={() => navigate("/admin/settings/main")} icon={<SettingOutlined />}>
                Settings
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <AntHeader className="bg-white shadow-md flex justify-between items-center p-4 sticky top-0 z-50 w-full">
            {/* ✅ Sidebar Toggle Button (Works in Mobile & Desktop) */}
            <Button
                type="text"
                icon={<MenuFoldOutlined />}
                onClick={onToggleSidebar} // ✅ Triggers sidebar toggle
                className="text-gray-700 text-xl"
            />

            {/* Username with Dropdown */}
            <Dropdown overlay={menu} trigger={["click"]} open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <div className="cursor-pointer flex items-center">
                    <UserOutlined className="text-2xl text-gray-700 mr-2" />
                    <span className="font-medium text-gray-700">{username}</span>
                </div>
            </Dropdown>
        </AntHeader>
    );
};

export default Header;
