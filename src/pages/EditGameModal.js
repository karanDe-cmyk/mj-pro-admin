import React, { useState, useEffect } from "react";

const EditGameModal = ({ isOpen, gameData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    gameTime: "",
    gameName: "",
    isActive: false,
  });

  useEffect(() => {
    if (gameData) {
      setFormData({
        id: gameData.id,
        gameTime: gameData.gameTime,
        gameName: gameData.gameName,
        isActive: gameData.isActive,
      });
    }
  }, [gameData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Game</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Game Time</label>
          <input
            type="text"
            name="gameTime"
            value={formData.gameTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Game Time"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Game Name</label>
          <input
            type="text"
            name="gameName"
            value={formData.gameName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Game Name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Game On/Off</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleToggleChange}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300 ease-in-out">
              <div className="w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:transform peer-checked:translate-x-6"></div>
            </div>
          </label>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;
