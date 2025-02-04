import React, { useState } from "react";

import { apiUrl, appiD } from "../utils/config";
import instance from "../utils/axiosInstance";


const AddGame = ({ onGameAdded }) => {
  const [formData, setFormData] = useState({
    marketOpenTime: "",
    marketCloseTime: "",
    isMarketActive: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({ ...prev, isMarketActive: !prev.isMarketActive }));
  };

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleAddMarket = async () => {
    try {
      const formattedCloseTime = formatTime(formData.marketCloseTime);
      const formattedOpenTime = formatTime(formData.marketOpenTime);

      const url = `${apiUrl}/api/starline/addGameList/${appiD}`;
      console.log("Sending POST request to:", url);

      const response = await instance.post(url, {
        game_name: formattedOpenTime,
        close_time: formattedCloseTime,
        is_active: formData.isMarketActive,
      });

      if (response.data.success) {
        alert("Game added successfully!");

        // Send the new game data to parent component (GameSchedule)
        onGameAdded({
          _id: response.data.data._id, // Assuming API returns new game ID
          game_name: formattedOpenTime,
          close_time: formattedCloseTime,
          is_active: formData.isMarketActive,
        });

        setFormData({
          marketOpenTime: "",
          marketCloseTime: "",
          isMarketActive: false,
        });
      } else {
        alert("Failed to add game");
      }
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Error adding game. Please try again.");
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Add Game</h2>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Game Name</label>
          <input
            type="time"
            name="marketOpenTime"
            value={formData.marketOpenTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Market Close Time</label>
          <input
            type="time"
            name="marketCloseTime"
            value={formData.marketCloseTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Market On/Off</label>
          <div className="flex items-center justify-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMarketActive}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300 ease-in-out">
                <div className="w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:transform peer-checked:translate-x-6"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleAddMarket}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Game
        </button>
      </div>
    </div>
  );
};

export default AddGame;
