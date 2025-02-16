import React, { useState, useEffect } from "react";
import moment from "moment";
import instance from "../../utils/axiosInstance";  // Importing your custom axios instance
import {  } from "../../utils/config";


const OtherSettings = () => {
  const [settings, setSettings] = useState({
    marketOpenTime: moment().format("hh:mm"), // 12-hour format
    amPm: moment().format("A"), // AM or PM
    alertMessage: "",
    id: "", // To store the ID for updates
  });
  
  const [loading, setLoading] = useState(false); // Loading state for data fetch and update

  // Fetch data from the API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await instance.get(`/api/settings/othersettings`); // Use custom axios instance
        const data = response.data[0]; // Assuming API returns an array with one object
        if (data) {
          setSettings({
            marketOpenTime: data.market_open_time,
            alertMessage: data.alert_message,
            amPm: data.market_open_time.split(" ")[1], // AM/PM part
            id: data._id, // Store ID for the update request
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to fetch settings.");
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  // Convert Time to hh:mm A Format
  const handleTimeChange = (e) => {
    const newTime = moment(e.target.value, "HH:mm").format("hh:mm"); // Converts to 12-hour format
    setSettings({ ...settings, marketOpenTime: newTime });
  };

  // Handle the update request
  const handleUpdate = async () => {
    if (!settings.marketOpenTime.trim() || !settings.alertMessage.trim()) {
      alert("Fields cannot be empty.");
      return;
    }

    try {
      setLoading(true); // Set loading to true while updating
      // Prepare updated data
      const updatedData = {
        market_open_time: `${settings.marketOpenTime} ${settings.amPm}`,
        alert_message: settings.alertMessage,
      };

      // PUT request to update data using your custom axios instance
      await instance.put(`/api/settings/othersettings/${settings.id}`, updatedData);

      alert("Settings Updated Successfully!");
      // console.log("Updated Settings:", updatedData);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    } finally {
      setLoading(false); // Set loading to false after update is complete
    }
  };

  return (
    <div className="relative">
    {/* Fullscreen loading overlay */}
    {loading && (
      <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )}
  
    <h2 className="text-xl font-bold text-blue-600 mb-4">Other Settings</h2>
  
    {loading ? (
      <div className="text-center">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    ) : (
      <>
        {/* One row with two columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Market Open Time Input */}
          <div>
            <label className="block text-sm font-semibold">Market Open Time</label>
            <div className="flex items-center">
              <input
                type="time"
                name="marketOpenTime"
                value={moment(settings.marketOpenTime + " " + settings.amPm, "hh:mm A").format("HH:mm")}
                onChange={handleTimeChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
              <select
                name="amPm"
                value={settings.amPm}
                onChange={handleChange}
                className="ml-2 border border-gray-300 p-2 rounded-md bg-white"
                disabled={loading}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
  
          {/* Alert Message Input */}
          <div>
            <label className="block text-sm font-semibold">Alert Message</label>
            <input
              type="text"
              name="alertMessage"
              value={settings.alertMessage}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
          </div>
        </div>
  
        {/* Update Button: small, left-aligned with extra top margin */}
        <div className="mt-8">
          <button
            onClick={handleUpdate}
            className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner"></div>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </>
    )}
  </div>
  
  
  );
};

export default OtherSettings;
