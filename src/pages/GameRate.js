import React, { useState } from "react";

const GameRate = () => {

  const [rates, setRates] = useState({
    singleDigit: 10,
    mumbaiJodi: 100,
    singlePana: 150,
    doublePana: 270,
    triplePana: 700,
    halfSangam: 1000,
    fullSangam: 10000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRates({ ...rates, [name]: value });
  };

  const handleUpdate = () => {
    console.log("Updated rates:", rates);
    alert("Rates updated successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Games Rate</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Input fields for each rate */}
          <div>
            <label className="block font-medium mb-1">Single Digit</label>
            <input
              type="number"
              name="singleDigit"
              value={rates.singleDigit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Mumbai Jodi</label>
            <input
              type="number"
              name="mumbaiJodi"
              value={rates.mumbaiJodi}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Single Pana</label>
            <input
              type="number"
              name="singlePana"
              value={rates.singlePana}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Double Pana</label>
            <input
              type="number"
              name="doublePana"
              value={rates.doublePana}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Triple Pana</label>
            <input
              type="number"
              name="triplePana"
              value={rates.triplePana}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Half Sangam</label>
            <input
              type="number"
              name="halfSangam"
              value={rates.halfSangam}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Full Sangam</label>
            <input
              type="number"
              name="fullSangam"
              value={rates.fullSangam}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default GameRate;
