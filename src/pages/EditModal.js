import React from "react";

const EditModal = ({ gameData, onChange, onSave, onClose, gameSingleMarketList }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Add other days as needed

  // Check if gameSingleMarketList is not null or undefined
  if (!gameSingleMarketList) {
    return <div>Loading...</div>;
  }

  // Map week_selection to days
  const weekSelection = gameSingleMarketList.data.games.reduce((acc, game, index) => {
    acc[days[index]] = game;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-4xl overflow-hidden relative">
        <h3 className="text-lg font-bold mb-4 text-center">Edit Market Schedule</h3>
        <div
          className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[70vh] px-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {days.map((day, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-bold mb-2">{day}</h4>
              <div className="mb-2">
                <label className="block font-medium">Market Open Time</label>
                <input
                  type="time"
                  name={`${day.toLowerCase()}Open`}
                  value={weekSelection[day] ? weekSelection[day].openTime || "" : ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium">Market Close Time</label>
                <input
                  type="time"
                  name={`${day.toLowerCase()}Close`}
                  value={weekSelection[day] ? weekSelection[day].closeTime || "" : ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Select Status</label>
                <select
                  name={`${day.toLowerCase()}Status`}
                  value={weekSelection[day] ? (weekSelection[day].open ? "Active" : "Inactive") : ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 sticky bottom-0 bg-white pt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Close
          </button>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update Market
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;