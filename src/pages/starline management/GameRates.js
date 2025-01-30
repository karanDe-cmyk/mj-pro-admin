import React, { useState } from 'react'

const GameRates = () => {
    const [singleDigit, setSingleDigit] = useState ("");
    const [singlePana, setSinglePana] = useState("");
    const [doublePana, setDoublePana] = useState("");
    const [triplePana, setTriplePana] = useState("");
  
    return (
      <div className="p-4 max-w-6xl mx-auto">
        {/* Box container */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-4 text-left">Add Game Rate</h2>
  
          {/* Form Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Row 1 Inputs */}
            <div className="w-full">
              <label className="font-semibold block mb-1">Single Digit</label>
              <input 
                type="number" 
                className="border px-3 py-2 rounded w-full" 
                value={singleDigit}
                onChange={(e) => setSingleDigit(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="font-semibold block mb-1">Single Pana</label>
              <input 
                type="number" 
                className="border px-3 py-2 rounded w-full" 
                value={singlePana}
                onChange={(e) => setSinglePana(e.target.value)}
              />
            </div>
            {/* Row 2 Inputs */}
            <div className="w-full">
              <label className="font-semibold block mb-1">Double Pana</label>
              <input 
                type="number" 
                className="border px-3 py-2 rounded w-full" 
                value={doublePana}
                onChange={(e) => setDoublePana(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="font-semibold block mb-1">Triple Pana</label>
              <input 
                type="number" 
                className="border px-3 py-2 rounded w-full" 
                value={triplePana}
                onChange={(e) => setTriplePana(e.target.value)}
              />
            </div>
          </div>
  
          {/* Update Button */}
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
            Update
          </button>
        </div>
      </div>
    );
  };

export default GameRates