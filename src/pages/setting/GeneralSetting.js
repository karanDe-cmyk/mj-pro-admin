import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SettingsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    whatsappnumber: "",
    telegram_link: "",
    upi_id: "",
    merchant_id: "",
    min_batting_rate: "",
    max_batting_rate: "",
    min_withdrawal_rate: "",
    max_withdrawal_rate: "",
    min_deposite_rate: "",
    max_deposite_rate: "",
    min_transfer: "",
    max_transfer: "",
    min_bid_amount: "",
    max_bid_amount: "",
    welcome_bonus: "",
    min_withdrawals_per_day: "", // New field added
    openTime: "",
    closeTime: "",
    closeWeek: "Sunday",
    whatsapp_deposit_option: "active",
    withdraw_option: "active",
    global_betting: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/general`);
        const data = response.data[0];

        setFormData({
          id: data._id,
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          whatsappnumber: data.whatsappnumber || "",
          telegram_link: data.telegram_link || "",
          upi_id: data.upi_id || "",
          merchant_id: data.merchant_id || "",
          min_batting_rate: data.min_batting_rate || "",
          max_batting_rate: data.max_batting_rate || "",
          min_withdrawal_rate: data.min_withdrawal_rate || "",
          max_withdrawal_rate: data.max_withdrawal_rate || "",
          min_deposite_rate: data.min_deposite_rate || "",
          max_deposite_rate: data.max_deposite_rate || "",
          min_transfer: data.min_transfer || "",
          max_transfer: data.max_transfer || "",
          min_bid_amount: data.min_bid_amount || "",
          max_bid_amount: data.max_bid_amount || "",
          welcome_bonus: data.welcome_bonus || "",
          min_withdrawals_per_day: data.min_withdrawals_per_day || "", // Set new field from API
          openTime: data.withdraw_timings?.split(" - ")[0] || "",
          closeTime: data.withdraw_timings?.split(" - ")[1] || "",
          closeWeek: data.closeWeek || 'Sunday',
          whatsapp_deposit_option: data.whatsapp_deposit_option || "active",
          withdraw_option: data.withdraw_option || "active",
          global_betting: data.global_betting || false,
        });

        setFetchingData(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to fetch settings");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchSettings();
  }, []);

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

      await axiosInstance.put(`/api/settings/general/${formData.id}`, updatedData);
      alert("Settings updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {(loading || fetchingData) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Settings Update</h2>

      {fetchingData && (
        <div className="flex justify-center items-center py-4">
          <div className="spinner"></div>
          <p className="ml-2">Loading settings...</p>
        </div>
      )}

      {/* 3-column grid for general inputs */}
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(formData).map(
          (key) =>
            !["id", "global_betting", "openTime", "closeTime", "openWeek", "closeWeek", "withdraw_option", "whatsapp_deposit_option", "telegram_link", "min_withdrawals_per_day"].includes(key) && (
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
                  disabled={loading}
                />
              </div>
            )
        )}
        {/* New input for minimum withdrawals */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold capitalize">
            Min withdrawals per day
          </label>
          <input
            type="number"
            name="min_withdrawals_per_day"
            value={formData.min_withdrawals_per_day}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Open Time Selection */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Withdraw Open Time</label>
          <select
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading}
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
            disabled={loading}
          >
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* WhatsApp Deposit Option */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">
            WhatsApp Deposit Option
          </label>
          <select
            name="whatsapp_deposit_option"
            value={formData.whatsapp_deposit_option}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Close Week Selection */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Withdraw Close Week</label>
          <select
            name="closeWeek"
            value={formData.closeWeek}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading}
          >
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Withdraw Option */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">
            Withdraw Option
          </label>
          <select
            name="withdraw_option"
            value={formData.withdraw_option}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md mt-1"
            disabled={loading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* New row for Telegram Link */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex flex-col col-span-3">
            <label className="text-sm font-semibold">
                Telegram Channel Link
            </label>
            <input
                type="text"
                name="telegram_link"
                value={formData.telegram_link}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md mt-1"
                disabled={loading}
            />
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
          disabled={loading}
        />
        <label className="text-sm font-semibold">Enable Global Betting</label>
      </div>

      {/* Centered Update Button */}
      <div className="grid grid-cols-3 mt-4">
        <div></div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-[#556EE6] text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner"></div>
                Saving...
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SettingsForm;
