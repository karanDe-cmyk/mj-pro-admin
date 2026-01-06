import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TotalWinningTable = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchWinningUsers();
  }, []);

  const fetchWinningUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/api/winning/getAllUsersTotalWinningPoints"
      );
      setWinners(res.data?.data || []);
    } catch (err) {
      console.error("Winning Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter
  const filteredUsers = winners.filter(u =>
    u.userName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
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
      <h2 className="text-2xl font-semibold mb-6">Winner Users & Winning Details</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by username or email..."
        className="mb-4 w-full rounded-lg border p-2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <div className="rounded-2xl bg-white p-6 shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Winning ₹</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No winners found
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <React.Fragment key={user.userId}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {user.userName}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ₹ {user.totalWinningPoints}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-blue-600 underline"
                        onClick={() =>
                          setExpandedUser(
                            expandedUser === user.userId ? null : user.userId
                          )
                        }
                      >
                        {expandedUser === user.userId ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* 🔽 Expanded Winning Details */}
                  {expandedUser === user.userId && (
                    <tr>
                      <td colSpan="5" className="bg-gray-50 px-6 py-4">
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="p-2">Game</th>
                              <th className="p-2">Market</th>
                              <th className="p-2">Type</th>
                              <th className="p-2">Digit</th>
                              <th className="p-2">Panna</th>
                              <th className="p-2">Win ₹</th>
                              <th className="p-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.wins.map((win, i) => (
                              <tr key={i} className="border-t">
                                <td className="p-2">{win.gameName}</td>
                                <td className="p-2">{win.marketName}</td>
                                <td className="p-2">{win.gameType}</td>
                                <td className="p-2">{win.digit || "-"}</td>
                                <td className="p-2">{win.panna || "-"}</td>
                                <td className="p-2 text-green-600 font-semibold">
                                  ₹ {win.winAmount}
                                </td>
                                <td className="p-2">{win.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
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
