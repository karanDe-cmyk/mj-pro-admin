import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // Import Axios instance
import { appiD } from "../utils/config"; // Import API ID
import { Spin } from "antd"; // Import Ant Design Spinner

const GameRate = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch Bet Rates on Component Mount
  useEffect(() => {
    fetchBetRates();
  }, []);

  const fetchBetRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rates/getBetRates/${appiD}`);

      if (response.data) {
        // ✅ Remove unwanted fields (_id, createdAt, updatedAt, __v)
        const { _id, createdAt, updatedAt, __v, ...filteredData } = response.data;
        setRates(filteredData);
      }
    } catch (error) {
      console.error("Error fetching bet rates:", error);
      alert("Failed to fetch bet rates!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRates({ ...rates, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(`/api/rates/updateBetRates/${appiD}`, rates);
      fetchBetRates(); // Refresh data after update
    } catch (error) {
      console.error("Error updating bet rates:", error);
      alert("Failed to update rates!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Game Rates Management</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* ✅ Dynamically Generate Input Fields */}
            {Object.keys(rates).map((key) => (
              <div key={key}>
                <label className="block font-medium mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type="number"
                  name={key}
                  value={rates[key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* ✅ Update Button with Spinner */}
        <button
          onClick={handleUpdate}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          disabled={updating}
        >
          {updating ? (
            <>
              <Spin size="small" style={{ marginRight: "8px" }} />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default GameRate;
