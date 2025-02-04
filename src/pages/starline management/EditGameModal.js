import React, { useState, useEffect } from "react";

const EditGameModal = ({ isOpen, gameData, onSave, onCancel }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (gameData) {
      // Initialize formData dynamically for each day
      const initialData = days.reduce((acc, day) => {
        acc[day] = {
          gameName: gameData.gameName || "",
          openTime: "",
          closeTime: "",
          isActive: gameData[day]?.isActive || false, // Get active status per day
        };
        return acc;
      }, {});

      setFormData(initialData);
    }
  }, [gameData]);

  // Handle input changes (Market Name, Open Time, Close Time)
  const handleInputChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  // Handle Status Toggle for a Specific Day
  const handleToggleChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      [day]: { ...prev[day], isActive: !prev[day].isActive },
    }));
  };

  // Save Changes
  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg z-50 p-4">
      <div className="bg-white p-6 rounded-md w-full max-w-4xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-sm"
        >
          ✖
        </button>

        {/* Modal Header */}
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Edit Game Schedule</h3>

        {/* Scrollable Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto px-2">
          {days.map((day) => (
            <div key={day} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">{day}</h4>
              
              {/* Market Name */}
              <div className="mb-2">
                <label className="block font-medium text-gray-600">Market Name</label>
                <input
                  type="text"
                  value={formData[day]?.gameName || ""}
                  onChange={(e) => handleInputChange(day, "gameName", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Open Time */}
              <div className="mb-2">
                <label className="block font-medium text-gray-600">Market Open Time</label>
                <input
                  type="time"
                  value={formData[day]?.openTime || ""}
                  onChange={(e) => handleInputChange(day, "openTime", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Close Time */}
              <div className="mb-2">
                <label className="block font-medium text-gray-600">Market Close Time</label>
                <input
                  type="time"
                  value={formData[day]?.closeTime || ""}
                  onChange={(e) => handleInputChange(day, "closeTime", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Toggle Button for Each Day */}
              <div className="flex items-center justify-between">
                <label className="block font-medium text-gray-600">Market Status</label>
                <button
                  onClick={() => handleToggleChange(day)}
                  className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-300 ${
                    formData[day]?.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {formData[day]?.isActive ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end mt-4 bg-white pt-4">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-3 hover:bg-blue-600 transition duration-200"
          >
            Update Market
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;
