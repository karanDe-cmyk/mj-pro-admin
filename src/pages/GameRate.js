import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { Spin, message } from "antd";

// Define the 7 groups and the subcategory keys for each group.
const groups = [
  {
    groupLabel: "Single Digit",
    subKeys: ["singleDigits", "singleDigitsBulk", "oddEven"],
  },
  {
    groupLabel: "Single Pana",
    subKeys: ["singlePana", "choicePannaSpDp", "singlePanaBulk", "spMotor"],
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
  const [displayRates, setDisplayRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBetRates();
  }, []);

  const fetchBetRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rates/getBetRates`);
      if (response.data) {
        const { _id, createdAt, updatedAt, __v, ...filteredData } = response.data;
        setRates(filteredData);
        setDisplayRates(filteredData); // Use the same data for display
      }
    } catch (error) {
      console.error("Error fetching bet rates:", error);
      alert("Failed to fetch bet rates!");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupInputChange = (group, field, e) => {
    const { value } = e.target;
    // Convert to number, but handle empty strings
    const numericValue = value === "" ? "" : Number(value);
    
    const updatedRates = { ...rates };
    const updatedDisplayRates = { ...displayRates };

    group.subKeys.forEach((key) => {
      if (field === "rate") {
        updatedRates[key] = numericValue;
        updatedDisplayRates[key] = numericValue;
      } else if (field === "value") {
        const valueKey = key + "Value";
        updatedRates[valueKey] = numericValue;
        updatedDisplayRates[valueKey] = numericValue;
      }
    });

    setRates(updatedRates);
    setDisplayRates(updatedDisplayRates);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      
      // Convert all values to numbers before sending
      const transformedRates = {};
      for (const key in rates) {
        if (rates[key] === "" || rates[key] === null || rates[key] === undefined) {
          transformedRates[key] = 0; // Set default value if empty
        } else {
          transformedRates[key] = Number(rates[key]);
        }
      }
      
      await axios.put(`/api/rates/updateBetRates`, transformedRates);
      fetchBetRates();
      message.success("Rates updated successfully!");
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
                {/* Rate Input */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {group.groupLabel} (Rate)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name={group.subKeys[0]}
                    value={displayRates[group.subKeys[0]] ?? ""}
                    onChange={(e) => handleGroupInputChange(group, "rate", e)}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                {/* Value Input */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {group.groupLabel} (Value)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <span className="px-2 text-lg">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      name={group.subKeys[0] + "Value"}
                      value={displayRates[group.subKeys[0] + "Value"] ?? ""}
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