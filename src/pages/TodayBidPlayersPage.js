import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import {
  FaUserCircle,
  FaWhatsapp,
  FaPhoneAlt,
} from "react-icons/fa";

const TodayBidPlayersPage = () => {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date"); // 👈 URL se date
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔥 API CALL
  const fetchTodayBidPlayers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/auth/today-bid-player`,
        {
          params: { date: selectedDate },
        }
      );

      setPlayers(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch today bid players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTodayBidPlayers();
    }
  }, [selectedDate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Today Bid Players
          </h2>
          {selectedDate && (
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
              Date: {selectedDate}
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">User Name</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Wallet</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No bid players found
                    </td>
                  </tr>
                ) : (
                  players.map((user, index) => (
                    <tr
                      key={user.userId}
                      className="text-center hover:bg-gray-50"
                    >
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border font-medium">
                        <a className="underline" href={`/admin/user-management/user-details/${user.userId}`}>
                          {user.userName}
                        </a>
                      </td>
                      <td className="p-2 border">{user.phone}</td>
                      <td className="p-2 border text-green-600 font-semibold">
                        ₹ {user.walletBalance}
                      </td>
                      <td className="p-2 border">
                        {user.status ? (
                          <span className="text-green-600 font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-2 border">
                        <div className="flex justify-center gap-4 text-lg">
                          {/* PROFILE */}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Bank Details"
                          >
                            <FaUserCircle />
                          </button>

                          {/* WHATSAPP */}
                          <a
                            href={`https://wa.me/91${user.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-600 hover:text-green-800"
                            title="WhatsApp"
                          >
                            <FaWhatsapp />
                          </a>

                          {/* CALL */}
                          <a
                            href={`tel:${user.phone}`}
                            className="text-gray-700 hover:text-black"
                            title="Call"
                          >
                            <FaPhoneAlt />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">
              Bank & UPI Details
            </h3>

            <div className="text-sm space-y-2">
              <p><strong>User:</strong> {selectedUser.userName}</p>
              <p><strong>Paytm:</strong> {selectedUser.upi_id?.paytmUpi || "N/A"}</p>
              <p><strong>PhonePe:</strong> {selectedUser.upi_id?.phonepeUpi || "N/A"}</p>
              <p><strong>GPay:</strong> {selectedUser.upi_id?.gpayUpi || "N/A"}</p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayBidPlayersPage;
