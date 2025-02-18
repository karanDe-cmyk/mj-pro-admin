import React, { useState, useEffect } from 'react';
import instance from '../../utils/axiosInstance';
import { Spin, message } from 'antd';

// Define the fields to be managed, each with a label, a rate key, and a value key.
const fields = [
  { label: "Single Digit", rateKey: "singleDigit", valueKey: "singleDigitValue" },
  { label: "Double Pana", rateKey: "doublePana", valueKey: "doublePanaValue" },
  { label: "Single Pana", rateKey: "singlePana", valueKey: "singlePanaValue" },
  { label: "Triple Pana", rateKey: "triplePana", valueKey: "triplePanaValue" },
];

const GameRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Function to fetch game rates.
  const fetchGameRates = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/starline/rates`);
      if (response.data) {
        // Remove unwanted fields.
        const { _id, __v, createdAt, updatedAt, ...filteredData } = response.data;
        setRates(filteredData);
      }
    } catch (error) {
      console.error('Error fetching game rates:', error);
      alert('Failed to fetch game rates!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch game rates when the component mounts.
  useEffect(() => {
    fetchGameRates();
  }, []);

  // Handle input changes for both rate and value fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRates({ ...rates, [name]: value });
  };

  // Handle updating the game rates.
  const handleUpdate = async () => {
    const updatedRates = { ...rates };
    setUpdating(true);
    try {
      const response = await instance.patch(`/api/starline/rates`, updatedRates);
      if (response.data) {
        message.success('Game rates updated successfully!');
        alert(`Rates Updated Successfully!`)

        // Automatically re-fetch updated rates.
        await fetchGameRates();

      }
    } catch (error) {
      console.error('Error updating game rates:', error);
      alert('Failed to update game rates');
    } finally {
      setUpdating(false);
    }
  };

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
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-left">Update Game Rates</h2>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.rateKey} className="grid grid-cols-2 gap-4 items-center">
              {/* Rate Input Column */}
              <div className="flex flex-col">
                <label className="font-bold text-gray-900 text-sm mb-1">
                  {field.label} (Rate)
                </label>
                <input
                  type="number"
                  name={field.rateKey}
                  value={rates[field.rateKey] || ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              {/* Value Input Column with Rupee Symbol */}
              <div className="flex flex-col">
                <label className="font-bold text-gray-900 text-sm mb-1">
                  {field.label} (Value)
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <span className="px-2 text-lg">₹</span>
                  <input
                    type="number"
                    name={field.valueKey}
                    value={rates[field.valueKey] || ""}
                    onChange={handleInputChange}
                    className="p-2 text-sm flex-1 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
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
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default GameRates;
