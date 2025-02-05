import React, { useState, useEffect } from 'react';
import instance from '../../utils/axiosInstance'; // Import your custom axios instance
import { appiD } from "../../utils/config"; // Use your API ID if needed

const GameRates = () => {
  const [singleDigit, setSingleDigit] = useState('');
  const [singlePana, setSinglePana] = useState('');
  const [doublePana, setDoublePana] = useState('');
  const [triplePana, setTriplePana] = useState('');
  const [loading, setLoading] = useState(true); // To handle loading state for fetching
  const [updating, setUpdating] = useState(false); // To handle loading state for updating

  // Fetch game rates when the component mounts
  useEffect(() => {
    const fetchGameRates = async () => {
      try {
        const response = await instance.get(`/api/starline/rates/${appiD}`);
        const { singleDigit, singlePana, doublePana, triplePana } = response.data;
        setSingleDigit(singleDigit);
        setSinglePana(singlePana);
        setDoublePana(doublePana);
        setTriplePana(triplePana);
        setLoading(false); // Data has been fetched, stop loading
      } catch (error) {
        console.error('Error fetching game rates:', error);
        setLoading(false); // Stop loading in case of an error
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

    setUpdating(true); // Start updating, show loading spinner

    try {
      const response = await instance.patch(`/api/starline/rates/${appiD}`, updatedRates);
      if (response.data) {
        alert('Game rates updated successfully!');
        // After successful update, you can re-fetch the data or update the state
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
      setUpdating(false); // Stop updating, hide loading spinner
    }
  };

  // Display loading state until data is fetched
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="text-xl text-gray-600 ml-4">Loading...</p>
      </div>
    );
  }

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
        <button
          onClick={handleUpdate}
          disabled={updating} // Disable the button while updating
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
