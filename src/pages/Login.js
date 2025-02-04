import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import instance from '../utils/axiosInstance';
import { apiUrl } from '../utils/config';
const Login = () => {
    const [username, setUsername] = useState('matka');
    const [password, setPassword] = useState('1234');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("API URL:", `${apiUrl}/api/auth/adminLogin`);
            console.log("Sending:", { username, password });

            const response = await instance.post(`${apiUrl}/api/auth/adminLogin`, { username, password });

            if (response && response.data) {
                console.log("API Response after login:", response.data);

                const token = response.data.token;
                if (token) {
                    localStorage.setItem("accessToken", token);
                    localStorage.setItem("isAuthenticated", "true");
                    console.log("Token stored in localStorage:", token);
                    navigate("/admin/dashboard");
                } else {
                    console.error("No token received in API response.");
                }
            }
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Data:", error.response.data);
            }

            alert("Invalid credentials. Please try again.");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
