import { useState } from "react";

const Header = ({ username, handleLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="flex justify-between items-center bg-white shadow-md p-4 sticky top-0 z-10 w-full">
            {/* Sidebar Toggle Button */}
            <button onClick={() => alert("Toggle Sidebar")} className="text-gray-500 text-xl">
                <i className="fas fa-bars"></i>
            </button>

            {/* Username with User Icon and Dropdown */}
            <div className="relative ml-auto flex items-center">
                {/* User Icon */}
                <i className="fas fa-user-circle text-2xl text-gray-700 mr-2"></i>
                <span className="font-medium text-gray-700 mr-2">
                    <strong>{username}</strong>
                </span>

                {/* Dropdown Toggle */}
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-500 text-xl">
                    <i className="fas fa-chevron-down"></i>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-10 w-40 bg-white shadow-lg rounded-md border border-gray-200">
                        <ul>
                            <li>
                                <button
                                    onClick={() => alert("Settings")}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                                >
                                    <i className="fas fa-cogs mr-2 text-gray-500"></i> Settings
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                                >
                                    <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
