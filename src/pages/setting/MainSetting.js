import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { appiD } from "../../utils/config"; // Ensure appiD is imported properly

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    id: "", // ✅ Ensure ID is included
    name: "",
    email: "",
    mobile: "",
    whatsappnumber: "",
    upi_id: "",
    merchant_id: "",
    min_batting_rate: "",
    min_withdrawal_rate: "",
    mai_deposite_rate: "",
    max_deposite_rate: "",
    min_transfer: "",
    max_transfer: "",
    min_bid_amount: "",
    max_bid_amount: "",
    welcome_bonus: "",
    openTime: "",
    closeTime: "",
    global_betting: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Track fetching state for loading indicator

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/general/${appiD}`);
        const data = response.data[0]; // ✅ Extract the first object from array response

        setFormData({
          id: data._id, // ✅ Correctly set ID
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          whatsappnumber: data.whatsappnumber || "",
          upi_id: data.upi_id || "",
          merchant_id: data.merchant_id || "",
          min_batting_rate: data.min_batting_rate || "",
          min_withdrawal_rate: data.min_withdrawal_rate || "",
          mai_deposite_rate: data.mai_deposite_rate || "",
          max_deposite_rate: data.max_deposite_rate || "",
          min_transfer: data.min_transfer || "",
          max_transfer: data.max_transfer || "",
          min_bid_amount: data.min_bid_amount || "",
          max_bid_amount: data.max_bid_amount || "",
          welcome_bonus: data.welcome_bonus || "",
          openTime: data.withdraw_timings?.split(" - ")[0] || "", // ✅ Extract open time
          closeTime: data.withdraw_timings?.split(" - ")[1] || "", // ✅ Extract close time
          global_betting: data.global_betting || false,
        });

        setFetchingData(false); // Done fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to fetch settings");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchSettings();
  }, [appiD]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute of ["00", "30"]) {
        times.push(`${hour}:${minute} AM`);
        times.push(`${hour}:${minute} PM`);
      }
    }
    return times;
  };

  // Handle form submission (Update API)
  const handleSubmit = async () => {
    if (!formData.id) {
      alert("Error: Missing settings ID!");
      return;
    }

    try {
      setLoading(true);
      const updatedData = {
        ...formData,
        withdraw_timings: `${formData.openTime} - ${formData.closeTime}`,
      };

      await axiosInstance.put(`/api/settings/general/${appiD}/${formData.id}`, updatedData);
      alert("Settings updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg relative">
      {/* Fullscreen loading overlay */}
      {(loading || fetchingData) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Settings Update</h2>

      {fetchingData && (
        <div className="flex justify-center items-center py-4">
          <div className="spinner"></div> {/* Loading spinner */}
          <p className="ml-2">Loading settings...</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map(
          (key) =>
            key !== "id" && // ✅ Exclude ID from inputs
            key !== "global_betting" &&
            key !== "openTime" &&
            key !== "closeTime" && (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md mt-1"
                  disabled={loading} // Disable input when loading
                />
              </div>
            )
        )}

        {/* Open Time Selection */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Withdraw Open Time</label>
          <select
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading} // Disable input when loading
          >
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Close Time Selection */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Withdraw Close Time</label>
          <select
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading} // Disable input when loading
          >
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Betting Checkbox */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          name="global_betting"
          checked={formData.global_betting}
          onChange={handleChange}
          className="w-5 h-5 mr-2"
          disabled={loading} // Disable input when loading
        />
        <label className="text-sm font-semibold">Enable Global Betting</label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner"></div> {/* Spinner during saving */}
            Saving...
          </div>
        ) : (
          "Save Settings"
        )}
      </button>
    </div>
  );
};

export default SettingsForm;
