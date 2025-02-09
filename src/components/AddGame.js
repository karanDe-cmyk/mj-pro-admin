import React, { useState } from "react";
import { TimePicker, Switch, Button, message } from "antd";
import moment from "moment";
import { apiUrl  } from "../utils/config";
import instance from "../utils/axiosInstance";

const AddGame = ({ onGameAdded }) => {
  const [formData, setFormData] = useState({
    marketOpenTime: null,
    marketCloseTime: null,
    isMarketActive: false,
  });

  // Handle Time Change
  const handleTimeChange = (time, timeString, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: time,
    }));
  };

  // Toggle Market On/Off
  const handleToggleChange = (checked) => {
    setFormData((prev) => ({ ...prev, isMarketActive: checked }));
  };

  // Handle Add Game
  const handleAddMarket = async () => {
    try {
      if (!formData.marketOpenTime || !formData.marketCloseTime) {
        message.error("Please select both open and close times.");
        return;
      }

      const formattedOpenTime = formData.marketOpenTime.format("hh:mm A");
      const formattedCloseTime = formData.marketCloseTime.format("hh:mm A");

      const url = `${apiUrl}/api/starline/addGameList`;
      console.log("Sending POST request to:", url);

      const response = await instance.post(url, {
        game_name: formattedOpenTime,
        close_time: formattedCloseTime,
        is_active: formData.isMarketActive,
      });

      if (response.data.success) {
        message.success("Game added successfully!");

        // Send the new game data to parent component (GameSchedule)
        onGameAdded({
          _id: response.data.data._id, // Assuming API returns new game ID
          game_name: formattedOpenTime,
          close_time: formattedCloseTime,
          is_active: formData.isMarketActive,
        });

        // Reset form fields
        setFormData({
          marketOpenTime: null,
          marketCloseTime: null,
          isMarketActive: false,
        });
      } else {
        message.error("Failed to add game.");
      }
    } catch (error) {
      console.error("Error adding game:", error);
      message.error("Error adding game. Please try again.");
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Add Game</h2>
      <div className="flex flex-wrap items-center gap-4">
        {/* Game Name (Open Time) */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">Game Name (Open Time)</label>
          <TimePicker
            use12Hours
            format="hh:mm A"
            value={formData.marketOpenTime}
            onChange={(time, timeString) => handleTimeChange(time, timeString, "marketOpenTime")}
            className="w-full"
          />
        </div>

        {/* Market Close Time */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">Market Close Time</label>
          <TimePicker
            use12Hours
            format="hh:mm A"
            value={formData.marketCloseTime}
            onChange={(time, timeString) => handleTimeChange(time, timeString, "marketCloseTime")}
            className="w-full"
          />
        </div>

        {/* Market On/Off Toggle */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">Market On/Off</label>
          <div className="flex items-center">
            <Switch checked={formData.isMarketActive} onChange={handleToggleChange} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <Button type="primary" onClick={handleAddMarket}>
          Add Game
        </Button>
      </div>
    </div>
  );
};

export default AddGame;
