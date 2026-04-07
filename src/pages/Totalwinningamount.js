import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TotalWinningTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchWinningUsers();
  }, [selectedDate]);


  const fetchWinningUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/winning/getAllUsersTotalWinningPoints?date=${selectedDate}`
      );

      const data = res.data?.data || [];

      // 🔁 FLATTEN users + wins
      const flatRows = [];

      data.forEach(user => {
        user.wins.forEach(win => {
          flatRows.push({
            userId: user.userId,
            userName: user.userName,
            email: user.email,
            totalWinningPoints: user.totalWinningPoints,
            gameName: win.gameName,
            marketName: win.marketName,
            gameType: win.gameType,
            digit: win.digit,
            panna: win.panna,
            winAmount: win.winAmount,
            date: win.date
          });
        });
      });

      setRows(flatRows);
    } catch (err) {
      console.error("Winning Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter
  const filteredRows = rows.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.gameName.toLowerCase().includes(search.toLowerCase()) ||
    r.marketName.toLowerCase().includes(search.toLowerCase())
  );


  // 📄 Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Winner Users – Complete Winning Details
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by user, email or game..."
        className="mb-4 w-full rounded-lg border p-2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 font-semibold">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Game</th>
              <th className="px-3 py-2">Market</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Digit</th>
              <th className="px-3 py-2">Panna</th>
              <th className="px-3 py-2">Winning ₹</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-500">
                  No winning records found
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    <a href={`/admin/user-management/user-details/${row.userId}`}>
                      {row.userName}
                    </a>
                  </td>
                  <td className="px-3 py-2">{row.email}</td>
                  <td className="px-3 py-2">{row.gameName}</td>
                  <td className="px-3 py-2">{row.marketName}</td>
                  <td className="px-3 py-2 capitalize">{row.gameType}</td>
                  <td className="px-3 py-2">{row.digit || "-"}</td>
                  <td className="px-3 py-2">{row.panna || "-"}</td>
                  <td className="px-3 py-2 font-semibold text-green-600">
                    ₹ {row.winAmount}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(row.date).toLocaleDateString("en-GB")}
                  </td>
                </tr>
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
