import React from "react";

const EditGameModal = ({ 
  editingGame, 
  setEditingGame, 
  handleUpdateGame, 
  closeEditPopup, 
  toggleDayStatus, 
  loadingAction 
}) => {
  if (!editingGame) return null; // Don't render if no game is selected

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Game</h2>

        {/* Main Game Name & Close Time */}
        <label className="block font-semibold">Game Name</label>
        <input
          type="text"
          value={editingGame.game_name}
          onChange={(e) => setEditingGame({ ...editingGame, game_name: e.target.value })}
          className="w-full border p-2 rounded-md mb-2"
        />

        <label className="block font-semibold">Close Time</label>
        <input
          type="text"
          value={editingGame.close_time}
          onChange={(e) => setEditingGame({ ...editingGame, close_time: e.target.value })}
          className="w-full border p-2 rounded-md mb-4"
        />

        {/* All Days with Game Name, Close Time & Active Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editingGame.week_selection.map((day, index) => (
            <div key={index} className="border p-3 rounded-md shadow-md">
              <h3 className="font-semibold text-center">{day.day}</h3>

              <label className="block text-sm mt-2">Game Name</label>
              <input
                type="text"
                value={day.game_name}
                onChange={(e) =>
                  setEditingGame((prev) => {
                    const updatedDays = [...prev.week_selection];
                    updatedDays[index].game_name = e.target.value;
                    return { ...prev, week_selection: updatedDays };
                  })
                }
                className="w-full border p-2 rounded-md mb-2"
              />

              <label className="block text-sm">Close Time</label>
              <input
                type="text"
                value={day.close_time}
                onChange={(e) =>
                  setEditingGame((prev) => {
                    const updatedDays = [...prev.week_selection];
                    updatedDays[index].close_time = e.target.value;
                    return { ...prev, week_selection: updatedDays };
                  })
                }
                className="w-full border p-2 rounded-md mb-2"
              />

              <button
                onClick={() => toggleDayStatus(index, editingGame._id)}
                disabled={loadingAction === `toggle-day-${index}`}
                className={`w-full px-3 py-2 rounded-md text-white font-semibold ${
                  day.is_open ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {loadingAction === `toggle-day-${index}` ? "Updating..." : day.is_open ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
        </div>

        {/* Update & Cancel Buttons */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleUpdateGame} 
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
          <button 
            onClick={closeEditPopup} 
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;
