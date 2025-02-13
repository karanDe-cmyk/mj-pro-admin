import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance"; // Import your Axios instance
import { } from "../../utils/config";

const RemoveMoney = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users from API using Axios
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/app/userslist`);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setSelectedUser(data[0].email);
          setWalletBalance(data[0].walletBalance || 0);
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

  // Handle money deduction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    if (amount > walletBalance) {
      alert("Insufficient balance!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/wallet/deduct-balance`, {
        email: selectedUser,
        amount: parseFloat(amount),
      });

      setLoading(false);
      alert(`Balance deducted successfully! New Balance: ₹${response.data.walletBalance}`);
      setWalletBalance(response.data.walletBalance);
      setAmount(""); // Reset input field
    } catch (error) {
      setLoading(false);
      console.error("Error deducting balance:", error);
      alert(error.response?.data?.message || "Failed to deduct balance. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md mt-20">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Deduct Balance In User Wallet</h2>
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
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Positioned at the Bottom */}
      <footer className="mt-auto py-4 text-center text-gray-500 text-sm w-full">
        2025 © Matka.
      </footer>
    </div>

  );
};

export default RemoveMoney;
