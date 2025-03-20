import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { Spin, message } from "antd";

// Define the 7 groups and the subcategory keys for each group.
const groups = [
  {
    groupLabel: "Single Digit",
    subKeys: ["singleDigits", "singleDigitsBulk", "spMotor", "oddEven"],
  },
  {
    groupLabel: "Single Pana",
    subKeys: ["singlePana", "choicePannaSpDp", "singlePanaBulk"],
  },
  {
    groupLabel: "Double Pana",
    subKeys: ["doublePana", "doublePanaBulk", "dpMotor"],
  },
  {
    groupLabel: "Jodi Digit",
    subKeys: ["groupJodi", "digitBasedJodi", "jodi", "jodiBulk", "redBracket"],
  },
  {
    groupLabel: "Triple Pana",
    subKeys: ["triplePana"],
  },
  {
    groupLabel: "Half Sangam",
    subKeys: ["halfSangamA", "halfSangamB"],
  },
  {
    groupLabel: "Full Sangam",
    subKeys: ["fullSangam"],
  },
];

const GameRate = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch Bet Rates on component mount.
  useEffect(() => {
    fetchBetRates();
  }, []);

  const fetchBetRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rates/getBetRates`);
      if (response.data) {
        // Remove unwanted fields from the response.
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

  // Handle changes for a group field (rate or value)
  const handleGroupInputChange = (group, field, e) => {
    const { value } = e.target;
    // Create a new state object
    const updatedRates = { ...rates };
    group.subKeys.forEach((key) => {
      if (field === "rate") {
        updatedRates[key] = value;
      } else if (field === "value") {
        updatedRates[key + "Value"] = value;
      }
    });
    setRates(updatedRates);
  };

  // Call the update API and refresh data.
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(`/api/rates/updateBetRates`, rates);
      fetchBetRates(); // Refresh data after update
      message.success("Rates updated successfully!");
      alert("Rates updated successfully!");
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
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.groupLabel} className="grid grid-cols-2 gap-4 items-center">
                {/* Column for Rate Input */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {group.groupLabel} (Rate)
                  </label>
                  <input
                    type="number"
                    name={group.subKeys[0]}
                    value={rates[group.subKeys[0]] || ""}
                    onChange={(e) => handleGroupInputChange(group, "rate", e)}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                {/* Column for Value Input with rupee symbol */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {group.groupLabel} (Value)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <span className="px-2 text-lg">₹</span>
                    <input
                      type="number"
                      name={group.subKeys[0] + "Value"}
                      value={rates[group.subKeys[0] + "Value"] || ""}
                      onChange={(e) => handleGroupInputChange(group, "value", e)}
                      className="p-2 text-sm flex-1 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
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
