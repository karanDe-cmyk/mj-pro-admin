import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
    const navigate = useNavigate();


    const username = localStorage.getItem('username') || 'Admin';

    const toggleUserManagement = () => {
        setIsUserManagementOpen(!isUserManagementOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">

            <div className="w-1/4 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                <ul>
                    <li className="mb-2">
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400' : 'text-white'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="mb-2">
                        <div
                            onClick={toggleUserManagement}
                            className="cursor-pointer flex justify-between items-center px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700"
                        >
                            <span className="font-medium text-white">User Management</span>
                            <span className="text-gray-400">
                                {isUserManagementOpen ? '▲' : '▼'}
                            </span>
                        </div>
                        {isUserManagementOpen && (
                            <ul className="ml-4 mt-2 border-l-4 border-blue-500 pl-4">
                                <li className="mb-1">
                                    <NavLink
                                        to="/admin/user-management/approved"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'block px-3 py-2 bg-blue-500 text-white rounded-md'
                                                : 'block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md'
                                        }
                                    >
                                        Approved Users
                                    </NavLink>
                                </li>
                                <li className="mb-1">
                                    <NavLink
                                        to="/admin/user-management/unapproved"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'block px-3 py-2 bg-blue-500 text-white rounded-md'
                                                : 'block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md'
                                        }
                                    >
                                        Unapproved Users
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="mb-2">
                        <NavLink
                            to="/admin/starline-management"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400' : 'text-white'
                            }
                        >
                            Starline Management
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="w-3/4 bg-gray-100">

                <header className="flex justify-between items-center bg-white shadow-md p-4">
                    <div className="font-medium text-gray-700">
                        Welcome, <strong>{username}</strong>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
