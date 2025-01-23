import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem('username') || 'Admin';

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: <i className="fa fa-home" aria-hidden="true"></i>,
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
                { label: 'Game Name', path: '/admin/game-management/game-name' },
                { label: 'Game Rates', path: '/admin/game-management/game-rates' },
                { label: 'On/Off Market', path: '/admin/game-management/on-off-market' },
                { label: 'Users Bid History', path: '/admin/game-management/bit-history' },
                { label: 'Bid Date Wise', path: '/admin/game-management/bid-date' },
                { label: 'Bet List', path: '/admin/game-management/bet-list' },
                { label: 'Winning History', path: '/admin/game-management/winning-history' },
            ],
        },
        {
            label: 'Game & Number',
            children: [
                { label: 'Single Digit', path: '/admin/game-number/single-digit' },
                { label: 'Jodi Digit', path: '/admin/game-number/jodi-digit' },
                { label: 'Single Pana', path: '/admin/game-number/single-pana' },
                { label: 'Double Pana', path: '/admin/game-number/double-pana' },
                { label: 'Triple Pana', path: '/admin/game-number/triple-pana' },
                { label: 'Half Sangam', path: '/admin/game-number/half-sangam' },
                { label: 'Full Sangam', path: '/admin/game-number/full-sangam' },
            ],
        },
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
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter((path) => path);
        return paths.map((path, index) => {
            const to = `/${paths.slice(0, index + 1).join('/')}`;
            return (
                <span key={to} className="text-gray-600">
                    {index > 0 && <span className="mx-2">/</span>}
                    <NavLink to={to} className="hover:underline">
                        {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
                    </NavLink>
                </span>
            );
        });
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? 'w-1/4' : 'w-0'
                } bg-gray-800 text-white overflow-hidden transition-all duration-300`}
            >
                <div className={`${isSidebarOpen ? 'p-6' : 'p-2'}`}>
                    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                    {isSidebarOpen && <ul>{renderMenuItems(menuItems)}</ul>}
                </div>
            </div>

            {/* Main Content */}
            <div className={`${isSidebarOpen ? 'w-3/4' : 'w-full'} bg-gray-100 transition-all duration-300`}>
                {/* Header */}
                <header className="flex justify-between items-center bg-white shadow-md p-4">
                    <button onClick={toggleSidebar} className="text-gray-500 text-xl">
                        <i className="fas fa-bars"></i>
                    </button>
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

                {/* Breadcrumbs */}
                <div className="p-4 bg-gray-200 text-sm">
                    {/* <span className="text-gray-600">Home</span> */}
                    {getBreadcrumbs()}
                </div>

                {/* Outlet */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
