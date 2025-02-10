import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Importing Axios instance
import {  } from "../../utils/config";

const AddFund = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users from API using Axios instance
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/api/app/userslist`);
        const data = response.data; // Extracting response data

        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setSelectedUser(data[0].email); // Default to first user
          setWalletBalance(data[0].walletBalance || 0); // Set initial wallet balance
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection change
  const handleUserChange = (e) => {
    const selectedEmail = e.target.value;
    setSelectedUser(selectedEmail);

    // Find the selected user and update wallet balance
    const user = users.find((u) => u.email === selectedEmail);
    if (user) {
      setWalletBalance(user.walletBalance || 0);
    }
  };

  // Handle form submit (Adding Balance)
  // Handle form submit (Adding Balance)
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount!");
    return;
  }

  setLoading(true);

  try {
    const response = await axiosInstance.post(`/api/deposit/Addfunds`, {
      email: selectedUser,
      amount: parseFloat(amount),
    });

    const result = response.data; // Extract response data
    alert("Balance added successfully!");

    // Update wallet balance by adding the added amount
    setWalletBalance((prevBalance) => prevBalance + result.requestAmount);

    setAmount(""); // Reset amount input
  } catch (error) {
    console.error("Error adding balance:", error);
    alert("Failed to add balance. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add Balance In User Wallet</h2>
          <form onSubmit={handleSubmit}>
            {/* User List Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">User List</label>
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={selectedUser}
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <option key={user.userId} value={user.email}>
                    {user.userName} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Balance Display */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Wallet Balance</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md bg-gray-200"
                value={`₹ ${walletBalance}`}
                readOnly
              />
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <footer className="absolute bottom-2 text-gray-500 text-sm">2025 ©Matka.</footer>
    </div>
  );
};

export default AddFund;
