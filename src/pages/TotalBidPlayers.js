import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaEye, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const TotalBidPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/api/auth/total-bid-player"
      );

      if (res.data?.success) {
        setPlayers(res.data.data || []);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Total Bid Players (Latest Bid)
        </h2>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-red-600 text-center py-6">{error}</p>
        )}

        {/* TABLE */}
        {!loading && !error && players.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">#</th>
                  <th className="px-4 py-2 border text-left">Username</th>
                  <th className="px-4 py-2 border text-left">Wallet Balance</th>
                  <th className="px-4 py-2 border text-left">Mobile</th>
                  <th className="px-4 py-2 border text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {players.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>

                    <td className="px-4 py-2 border">
                      <a
                        href={`/admin/user-management/user-details/${item.userId}`}
                        className="px-4 py-2 font-medium text-blue-600"
                      >
                        {item.userName}
                      </a>
                    </td>

                    <td className="px-4 py-2 border">{item.walletBalance}</td>
                    <td className="px-4 py-2 border">{item.phone}</td>

                    {/* ACTION COLUMN */}
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-4 text-lg">

                        {/* VIEW */}
                        <button
                          onClick={() =>
                            navigate(`/admin/user-management/user-details/${item.userId}`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="View Profile"
                        >
                          <FaEye />
                        </button>

                        {/* WHATSAPP */}
                        <a
                          href={`https://wa.me/91${item.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:text-green-800"
                          title="WhatsApp"
                        >
                          <FaWhatsapp />
                        </a>

                        {/* CALL */}
                        <a
                          href={`tel:${item.phone}`}
                          className="text-gray-700 hover:text-black"
                          title="Call"
                        >
                          <FaPhoneAlt />
                        </a>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && players.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No bid players found
          </p>
        )}

      </div>
    </div>
  );
};

export default TotalBidPlayers;
