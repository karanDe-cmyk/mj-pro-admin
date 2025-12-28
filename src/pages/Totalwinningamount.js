import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TotalWinningTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalWinning, setTotalWinning] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Filter
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const usersRes = await axiosInstance.get("/api/auth/userStatus?status=true");
      const activeUsers = usersRes.data || [];

      const winningRes = await axiosInstance.get("/api/winning/getAllUsersTotalWinningPoints");
      const winningData = winningRes.data?.data || [];

      const winningMap = {};
      winningData.forEach(item => {
        winningMap[item._id] = item.totalWinningPoints;
      });

      const finalUsers = activeUsers.map(user => ({
        ...user,
        totalWinningPoints: winningMap[user._id] || 0
      }));

      const overallTotalWinning = finalUsers.reduce(
        (sum, u) => sum + u.totalWinningPoints,
        0
      );

      setUsers(finalUsers);
      setTotalWinning(overallTotalWinning);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Paginated Users
  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">Total Winning</h2>

      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          className="w-full p-2 border rounded-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Active Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="px-4 py-3">Sr. N</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Wallet (₹)</th>
                <th className="px-4 py-3">Total Winning (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user._id} className="border-b text-sm hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/user-management/user-details/${user._id}`}
                        target="_self"
                        rel="noopener noreferrer"
                      >
                        {user.userName}
                      </a>
                    </td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 font-medium">₹ {user.walletBalance}</td>
                    <td className="px-4 py-3 font-medium text-green-600">₹ {user.totalWinningPoints}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalWinningTable;
