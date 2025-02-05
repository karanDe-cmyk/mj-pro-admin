import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Import your Axios instance
import { appiD } from "../../utils/config";

const AllBidHistory = () => {
  const [search, setSearch] = useState("");
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBidHistory(); // Fetch data on component mount
  }, []);

  // ✅ Fetch All Bid History
  const fetchBidHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(
        `/api/starlinebid/getallbid/${appiD}`
      );
      setBidHistoryData(response.data);
    } catch (err) {
      setError("Failed to load bid history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete Bid
  const handleDeleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;

    try {
      await axiosInstance.delete(
        `/api/starlinebid/deletbid/${appiD}/${bidId}`
      );

      // ✅ Update state to remove the deleted bid
      setBidHistoryData((prevBids) =>
        prevBids.filter((bid) => bid.bidId !== bidId)
      );
      alert("Bid deleted and amount refunded to user wallet");
    } catch (err) {
      alert("Failed to delete bid. Please try again.");
    }
  };

  return (
    <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Bid History List</h3>

      {/* Search & Entries */}
      <div className="flex justify-between mb-2">
        <div>
          Show
          <select className="border px-2 py-1 mx-2 rounded">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          entries
        </div>
        <input
          type="text"
          className="border px-3 py-2 rounded"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Loading...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Sr No</th>
              <th className="py-2 px-4 border">Member Name</th>
              <th className="py-2 px-4 border">Betting Amount</th>
              <th className="py-2 px-4 border">Betting Number</th>
              <th className="py-2 px-4 border">Betting Time</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {bidHistoryData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data available in table
                </td>
              </tr>
            ) : (
              bidHistoryData.map((bid, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{bid.userName}</td>
                  <td className="py-2 px-4 border">{bid.points}</td>
                  <td className="py-2 px-4 border">{bid.digit || bid.panna}</td>
                  <td className="py-2 px-4 border">{bid.time}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteBid(bid.bidId)} // Pass bidId dynamically
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Placeholder */}
      <div className="flex justify-between mt-4">
        <span>Showing {bidHistoryData.length} entries</span>
        <div>
          <button className="px-3 py-1 border rounded-l bg-gray-300">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-r bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllBidHistory;
