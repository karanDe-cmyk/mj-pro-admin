// EditModal.js

import React from "react";

const EditModal = ({ gameData, onChange, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-lg font-bold mb-4">Edit Game</h3>
        <div className="mb-4">
          <label className="block font-medium">Market Name</label>
          <input
            type="text"
            name="name"
            value={gameData.name}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Market Type</label>
          <select
            name="type"
            value={gameData.type || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            <option value="Type 1">Mumbai</option>
            <option value="Type 2">Pune</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Market Open Time</label>
          <input
            type="time"
            name="open"
            value={gameData.open}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Market Close Time</label>
          <input
            type="time"
            name="close"
            value={gameData.close}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Selected Game</label>
          <select
            name="selectedGame"
            value={gameData.selectedGame || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            <option value="Game 1">Game 1</option>
            <option value="Game 2">Game 2</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
