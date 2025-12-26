import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TodayRegisteredPlayed = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/api/auth/today-register-played?status=true"
      );

      if (res.data.success) {
        setData(res.data.data || []);
        setDate(res.data.date);
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
          Today Registered & Played Players
          {date && <span className="text-gray-500 text-sm ml-2">({date})</span>}
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
        {!loading && !error && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">#</th>
                  <th className="px-4 py-2 border text-left">Username</th>
                  <th className="px-4 py-2 border text-left">Mobile</th>
                  <th className="px-4 py-2 border text-left">Market</th>
                  <th className="px-4 py-2 border text-left">Game</th>
                  <th className="px-4 py-2 border text-left">Game Type</th>
                  <th className="px-4 py-2 border text-left">Digit / Panna</th>
                  <th className="px-4 py-2 border text-left">Session</th>
                  <th className="px-4 py-2 border text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>

                    <td className="px-4 py-2 border font-medium text-blue-600">
                      {item.userName}
                    </td>

                    <td className="px-4 py-2 border">{item.phone}</td>

                    <td className="px-4 py-2 border">{item.market}</td>

                    <td className="px-4 py-2 border">{item.gameName}</td>

                    <td className="px-4 py-2 border">{item.gameType}</td>

                    <td className="px-4 py-2 border">
                      {item.digit}
                    </td>

                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.session === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.session}
                      </span>
                    </td>

                    <td className="px-4 py-2 border text-sm text-gray-600">
                      {item.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && data.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No players found for today
          </p>
        )}
      </div>
    </div>
  );
};

export default TodayRegisteredPlayed;
