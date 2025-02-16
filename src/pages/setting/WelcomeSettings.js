import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming you have an axios instance
import {  } from "../../utils/config"; // Ensure you have the correct 

const WelcomeSettings = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(""); // Store the ID of the record for update
  const [loading, setLoading] = useState(false); // Loading state for API calls

  // Fetch data from the API
  useEffect(() => {
    const fetchWelcomeData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(`/api/settings/welcome`);
        const data = response.data[0]; // Assuming data returns an array with one object
        
        if (data) {
          setTitle(data.title);
          setDescription(data.discription);
          setId(data._id); // Set ID for future update requests
        }
      } catch (error) {
        console.error("Error fetching Welcome data:", error);
        alert("Failed to fetch data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchWelcomeData();
  }, []); // Empty dependency array to run only once when component mounts

  // Handle changes in the input fields
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle the update request
  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Both fields must be filled out.");
      return;
    }

    setLoading(true); // Start loading for the update
    try {
      const updatedData = {
        title: title,
        discription: description,
      };

      await axiosInstance.put(`/api/settings/welcome/${id}`, updatedData);
      alert("Welcome Page Updated Successfully!");
      // console.log("Updated Data:", updatedData);
    } catch (error) {
      console.error("Error updating Welcome Page data:", error);
      alert("Failed to update data.");
    } finally {
      setLoading(false); // Stop loading after the update
    }
  };

  return (
    <div>
    <h2 className="text-xl font-bold text-blue-600 mb-4">Welcome Settings</h2>
  
    {loading ? (
      <div className="text-center">Loading...</div>
    ) : (
      <>
        {/* Row 1: Title with bigger height */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Enter Title</label>
          <textarea
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter welcome title"
            className="w-full border border-gray-300 p-2 rounded-md h-40"
          />
        </div>
  
        {/* Row 2: Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Enter Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter welcome description"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
  
        {/* Update Button: small, bottom left with margin-top */}
        <div className="mt-8">
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

export default WelcomeSettings;
