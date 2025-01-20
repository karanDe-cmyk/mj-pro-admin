import React, { useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


const AdminPanel = () => {
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Admin';

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: <i class="fa fa-home" aria-hidden="true"></i>,
        },
        {
            label: 'User Management',
            children: [
                {
                    label: 'Approved Users',
                    path: '/admin/user-management/approved',
                },
                {
                    label: 'Unapproved Users',
                    path: '/admin/user-management/unapproved',
                },
            ],
        },
        {
            label: 'Game Management',
            children: [
                {
                    label: 'Game Name',
                    path: '/admin/game-management/game-name',
                },
                
            ],
        },
        // {
        //     label: 'Game Management',
        //     path: '/admin/game-management',
        // },
        {
            label: 'Starline Management',
            path: '/admin/starline-management',
        },
    ];

    const toggleMenu = (label) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [label]: !prevOpenMenus[label],
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const renderMenuItems = (items) => {
        return items.map((item) => (
            <li key={item.label} className="mb-2">
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
                            <span className="text-gray-400">
                                {openMenus[item.label] ? '▲' : '▼'}
                            </span>
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
                                ? 'block px-3 py-2 bg-blue-500 text-white rounded-md'
                                : 'block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md'
                        }
                    >
                        {item.label}
                    </NavLink>
                )}
            </li>
        ));
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/4 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                <ul>{renderMenuItems(menuItems)}</ul>
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
