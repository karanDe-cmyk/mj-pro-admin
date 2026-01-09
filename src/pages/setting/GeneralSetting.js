import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const SettingsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    whatsappnumber: "",
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
    openTime: "",
    closeTime: "",
    closeWeek: "Sunday",
    whatsapp_deposit_option: "active",
    withdraw_option: "active",
    global_betting: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setFetchingData(true);
        const response = await axiosInstance.get(`/api/settings/general`);

        // Check if settings exist
        if (response.data && response.data.length > 0) {
          const data = response.data[0]; // Extract the first object from array response

          setFormData({
            id: data._id || "", // Set ID if exists
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            whatsappnumber: data.whatsappnumber || "",
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
            openTime: data.withdraw_timings?.split(" - ")[0] || "",
            closeTime: data.withdraw_timings?.split(" - ")[1] || "",
            whatsapp_deposit_option: data.whatsapp_deposit_option || "active",
            withdraw_option: data.withdraw_option || "active",
            global_betting: data.global_betting || false,
            closeWeek: data.closeWeek || 'Sunday'
          });
          setIsCreatingNew(false);
        } else {
          // No settings found, enable create mode
          console.log("No existing settings found, enabling create mode");
          setIsCreatingNew(true);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // If 404 or no data, enable create mode
        if (error.response?.status === 404 || error.response?.status === 400) {
          setIsCreatingNew(true);
          console.log("No settings found, switching to create mode");
        } else {
          // alert("Failed to fetch settings");
        }
      } finally {
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

  // Handle form submission - Create or Update based on ID
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare data for API
      const submitData = {
        ...formData,
        withdraw_timings: `${formData.openTime} - ${formData.closeTime}`,
      };

      // Remove frontend-only fields
      delete submitData.id;
      delete submitData.openTime;
      delete submitData.closeTime;

      let response;

      if (formData.id && !isCreatingNew) {
        // UPDATE existing settings
        response = await axiosInstance.put(
          `/api/settings/general/${formData.id}`,
          submitData
        );
        alert("Settings updated successfully!");
      } else {
        // CREATE new settings
        response = await axiosInstance.post(
          `/api/settings/general`,
          submitData
        );
        // Update the form with new ID
        if (response.data.data?._id) {
          setFormData(prev => ({
            ...prev,
            id: response.data.data._id
          }));
          setIsCreatingNew(false);
        }
        alert("Settings created successfully!");
      }

    } catch (error) {
      console.error("Error saving settings:", error);
      // alert(`Failed to ${formData.id && !isCreatingNew ? 'update' : 'create'} settings: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset form for new creation
  const handleResetForNew = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      mobile: "",
      whatsappnumber: "",
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
      openTime: "",
      closeTime: "",
      closeWeek: "Sunday",
      whatsapp_deposit_option: "active",
      withdraw_option: "active",
      global_betting: false,
    });
    setIsCreatingNew(true);
  };

  return (
    <div className="relative">
      {/* Fullscreen loading overlay */}
      {(loading || fetchingData) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Settings {isCreatingNew ? 'Creation' : 'Update'}</h2>
        <div className="flex space-x-2">
          {!isCreatingNew && (
            <button
              onClick={handleResetForNew}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              disabled={loading}
            >
              Create New Settings
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {fetchingData ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg">Loading settings...</p>
        </div>
      ) : (
        <>
          {/* 3-column grid for general inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(formData).map(
              (key) =>
                key !== "id" &&
                key !== "global_betting" &&
                key !== "openTime" &&
                key !== "closeTime" &&
                key !== "openWeek" &&
                key !== "closeWeek" &&
                key !== "withdraw_option" &&
                key !== "whatsapp_deposit_option" && (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-semibold capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    />
                  </div>
                )
            )}
          </div>

          {/* New row for Time and Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Open Time Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Withdraw Open Time</label>
              <select
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select Open Time</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Close Time Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Withdraw Close Time</label>
              <select
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select Close Time</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp Deposit Option */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                WhatsApp Deposit Option
              </label>
              <select
                name="whatsapp_deposit_option"
                value={formData.whatsapp_deposit_option}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Close Week Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Withdraw Close Week</label>
              <select
                name="closeWeek"
                value={formData.closeWeek}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            {/* Withdraw Option */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Withdraw Option
              </label>
              <select
                name="withdraw_option"
                value={formData.withdraw_option}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Global Betting Checkbox */}
          <div className="flex items-center mt-6 p-4 bg-gray-50 rounded-md">
            <input
              type="checkbox"
              name="global_betting"
              checked={formData.global_betting}
              onChange={handleChange}
              className="w-5 h-5 mr-3 text-blue-600 rounded focus:ring-blue-500"
              disabled={loading}
              id="global-betting"
            />
            <label htmlFor="global-betting" className="text-sm font-semibold cursor-pointer">
              Enable Global Betting
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-md font-semibold ${isCreatingNew
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isCreatingNew ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {isCreatingNew ? '🚀 Create Settings' : '💾 Update Settings'}
                </div>
              )}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold"
              disabled={loading}
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsForm;