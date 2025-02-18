import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { Spin, message } from "antd";

// Define the fields you want to manage, pairing each rate with its corresponding value.
const fields = [
  { label: "Triple Pana", rateKey: "triplePana", valueKey: "triplePanaValue" },
  { label: "Panel Group", rateKey: "panelGroup", valueKey: "panelGroupValue" },
  { label: "SP DP TP", rateKey: "spDpTp", valueKey: "spDpTpValue" },
  { label: "Choice Panna SP DP", rateKey: "choicePannaSpDp", valueKey: "choicePannaSpDpValue" },
  { label: "SP Motor", rateKey: "spMotor", valueKey: "spMotorValue" },
  { label: "DP Motor", rateKey: "dpMotor", valueKey: "dpMotorValue" },
  { label: "Odd Even", rateKey: "oddEven", valueKey: "oddEvenValue" },
  { label: "Two Digits Panel", rateKey: "twoDigitsPanel", valueKey: "twoDigitsPanelValue" },
  { label: "Group Jodi", rateKey: "groupJodi", valueKey: "groupJodiValue" },
  { label: "Digit Based Jodi", rateKey: "digitBasedJodi", valueKey: "digitBasedJodiValue" },
  { label: "Red Bracket", rateKey: "redBracket", valueKey: "redBracketValue" },
  { label: "Half Sangam A", rateKey: "halfSangamA", valueKey: "halfSangamAValue" },
  { label: "Half Sangam B", rateKey: "halfSangamB", valueKey: "halfSangamBValue" },
  { label: "Full Sangam", rateKey: "fullSangam", valueKey: "fullSangamValue" },
  { label: "Single Digits", rateKey: "singleDigits", valueKey: "singleDigitsValue" },
  { label: "Single Digits Bulk", rateKey: "singleDigitsBulk", valueKey: "singleDigitsBulkValue" },
  { label: "Jodi", rateKey: "jodi", valueKey: "jodiValue" },
  { label: "Jodi Bulk", rateKey: "jodiBulk", valueKey: "jodiBulkValue" },
  { label: "Single Pana", rateKey: "singlePana", valueKey: "singlePanaValue" },
  { label: "Single Pana Bulk", rateKey: "singlePanaBulk", valueKey: "singlePanaBulkValue" },
  { label: "Double Pana", rateKey: "doublePana", valueKey: "doublePanaValue" },
  { label: "Double Pana Bulk", rateKey: "doublePanaBulk", valueKey: "doublePanaBulkValue" },
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

  // Update the state when an input value changes.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRates({ ...rates, [name]: value });
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
            {fields.map((field) => (
              <div key={field.rateKey} className="grid grid-cols-2 gap-4 items-center">
                {/* Column for Rate Input */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {field.label} (Rate)
                  </label>
                  <input
                    type="number"
                    name={field.rateKey}
                    value={rates[field.rateKey] || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                {/* Column for Value Input with rupee symbol */}
                <div className="flex flex-col">
                  <label className="font-bold text-gray-900 text-sm mb-1">
                    {field.label} (Value)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <span className="px-2 text-lg">₹</span>
                    <input
                      type="number"
                      name={field.valueKey}
                      value={rates[field.valueKey] || ""}
                      onChange={handleInputChange}
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
