import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming you have an axios instance


const ReferEarn = () => {
  const [referDescription, setReferDescription] = useState("");
  const [referTitle, setReferTitle] = useState("");
  const [referAmount, setReferAmount] = useState("");
  const [id, setId] = useState(""); // Store the ID of the record for update
  const [loading, setLoading] = useState(false); // Loading state for API calls

  // Fetch data from the API
  useEffect(() => {
    const fetchReferEarnData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(`/api/settings/referandearn`);
        const data = response.data[0]; // Assuming data returns an array with one object
        
        if (data) {
          setReferDescription(data.refer_description);
          setReferTitle(data.title);
          setReferAmount(data.amount);
          setId(data._id); // Set ID for future update requests
        }
      } catch (error) {
        console.error("Error fetching Refer & Earn data:", error);
        alert("Failed to fetch data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchReferEarnData();
  }, []); // Empty dependency array to run only once when component mounts

  // Handle changes in the input fields
  const handleReferDescriptionChange = (e) => {
    setReferDescription(e.target.value);
  };

  const handleReferTitleChange = (e) => {
    setReferTitle(e.target.value);
  };

  const handleReferAmountChange = (e) => {
    setReferAmount(e.target.value);
  };

  // Handle the update request
  const handleUpdate = async () => {
    if (!referDescription.trim() || !referTitle.trim() || !referAmount.trim()) {
      alert("All fields must be filled out.");
      return;
    }

    setLoading(true); // Start loading for the update
    try {
      const updatedData = {
        refer_description: referDescription,
        title: referTitle,
        amount: referAmount,
      };

      await axiosInstance.put(`/api/settings/referandearn/${id}`, updatedData);
      alert("Refer & Earn Updated Successfully!");
      // console.log("Updated Data:", updatedData);
    } catch (error) {
      console.error("Error updating Refer & Earn data:", error);
      alert("Failed to update data.");
    } finally {
      setLoading(false); // Stop loading after the update
    }
  };

  return (
    <div>
  <h2 className="text-xl font-bold text-blue-600 mb-4">Refer & Earn</h2>

  {loading ? (
    <div className="text-center">Loading...</div>
  ) : (
    <>
      {/* Row 1: Refer Description with bigger height */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Refer Description</label>
        <textarea
          value={referDescription}
          onChange={handleReferDescriptionChange}
          className="w-full border border-gray-300 p-2 rounded-md h-40"
          placeholder="Enter refer description..."
        />
      </div>

      {/* Row 2: Refer Title and Refer Amount side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold">Refer Title</label>
          <input
            type="text"
            name="referTitle"
            value={referTitle}
            onChange={handleReferTitleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter refer title..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Refer Amount</label>
          <input
            type="text"
            name="referAmount"
            value={referAmount}
            onChange={handleReferAmountChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            placeholder="Enter refer amount..."
          />
        </div>
      </div>

      {/* Update Button: bottom right with margin top */}
      <div className="flex justify-start mt-8">
        <button
          onClick={handleUpdate}
          className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa]"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  )}
</div>

  );
};

export default ReferEarn;
