import React, { useState, useEffect } from 'react';
import instance from '../../utils/axiosInstance'; // Import your custom axios instance
import { } from "../../utils/config"; // Use your API ID if needed

const GameRates = () => {
  const [singleDigit, setSingleDigit] = useState('');
  const [singlePana, setSinglePana] = useState('');
  const [doublePana, setDoublePana] = useState('');
  const [triplePana, setTriplePana] = useState('');
  const [loading, setLoading] = useState(true); // For fetching data
  const [updating, setUpdating] = useState(false); // For updating data

  // Fetch game rates when the component mounts
  useEffect(() => {
    const fetchGameRates = async () => {
      try {
        const response = await instance.get(`/api/starline/rates`);
        const { singleDigit, singlePana, doublePana, triplePana } = response.data;
        setSingleDigit(singleDigit);
        setSinglePana(singlePana);
        setDoublePana(doublePana);
        setTriplePana(triplePana);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game rates:', error);
        setLoading(false);
      }
    };

    fetchGameRates();
  }, []);

  // Handle updating the game rates
  const handleUpdate = async () => {
    const updatedRates = {
      singleDigit,
      singlePana,
      doublePana,
      triplePana,
    };

    setUpdating(true);
    try {
      const response = await instance.patch(`/api/starline/rates`, updatedRates);
      if (response.data) {
        alert('Game rates updated successfully!');
        const { singleDigit, singlePana, doublePana, triplePana } = response.data;
        setSingleDigit(singleDigit);
        setSinglePana(singlePana);
        setDoublePana(doublePana);
        setTriplePana(triplePana);
      }
    } catch (error) {
      console.error('Error updating game rates:', error);
      alert('Failed to update game rates');
    } finally {
      setUpdating(false);
    }
  };

  // Display a loading indicator until data is fetched
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="text-xl text-gray-600 ml-4">Loading...</p>
      </div>
    );
  }

  // Helper function to compute and display the formula (1 rupees = value/10)
  const computeDivision = (value) => {
    if (value === '' || isNaN(value)) return 'N/A';
    const result = Number(value) / 10;
    return `1 rupees = ${result}`;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Container */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-left">Add Game Rate</h2>

        {/* Each input row */}
        <div className="space-y-4">
          {/* Single Digit Row */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col w-40">
              <label className="font-bold text-gray-900 text-sm mb-1">Single Digit</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-md p-2 text-sm" 
                value={singleDigit}
                onChange={(e) => setSingleDigit(e.target.value)}
              />
            </div>
            <div className="w-28 text-right">
              <span className="font-bold text-gray-900 text-sm">{computeDivision(singleDigit)}</span>
            </div>
          </div>

          {/* Single Pana Row */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col w-40">
              <label className="font-bold text-gray-900 text-sm mb-1">Single Pana</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-md p-2 text-sm" 
                value={singlePana}
                onChange={(e) => setSinglePana(e.target.value)}
              />
            </div>
            <div className="w-28 text-right">
              <span className="font-bold text-gray-900 text-sm">{computeDivision(singlePana)}</span>
            </div>
          </div>

          {/* Double Pana Row */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col w-40">
              <label className="font-bold text-gray-900 text-sm mb-1">Double Pana</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-md p-2 text-sm" 
                value={doublePana}
                onChange={(e) => setDoublePana(e.target.value)}
              />
            </div>
            <div className="w-28 text-right">
              <span className="font-bold text-gray-900 text-sm">{computeDivision(doublePana)}</span>
            </div>
          </div>

          {/* Triple Pana Row */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col w-40">
              <label className="font-bold text-gray-900 text-sm mb-1">Triple Pana</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-md p-2 text-sm" 
                value={triplePana}
                onChange={(e) => setTriplePana(e.target.value)}
              />
            </div>
            <div className="w-28 text-right">
              <span className="font-bold text-gray-900 text-sm">{computeDivision(triplePana)}</span>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto flex justify-center items-center"
        >
          {updating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-white mr-2"></div>
              <span>Updating...</span>
            </>
          ) : (
            <span>Update</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameRates;
