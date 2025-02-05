import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // Import axios instance
import { appiD } from "../utils/config"; // Import API ID

const AutoDepositHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        setLoading(true); // Set loading to true before API call
        const response = await axios.get(`/api/userPayment/getpaymentResponse/${appiD}`);
        setData(response.data.data || []); // Ensure data is an array
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error("Error fetching deposit history:", err);
        setError("Failed to fetch deposit history. Please try again.");
        setLoading(false); // Stop loading on error
      }
    };

    fetchDepositHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Auto Deposit History</h2>
  
      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center space-x-4 py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
  
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Txn ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Txn Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.username}</td>
                      <td className="border border-gray-300 px-4 py-2">₹ {item.amount}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.txnId || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </div>
  
  );
};

export default AutoDepositHistory;
