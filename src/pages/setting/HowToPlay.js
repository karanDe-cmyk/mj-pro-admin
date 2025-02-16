import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming axiosInstance is set up
import {  } from "../../utils/config"; // Ensure  is correctly imported

const HowToPlay = () => {
  const [description, setDescription] = useState("Enter a short description...");
  const [howToPlayContent, setHowToPlayContent] = useState(
    "Download our application from Google Play Store or from our official website. Register with your mobile number, email, and start using our platform."
  );
  const [videoLink, setVideoLink] = useState("");
  const [id, setId] = useState(""); // To store the ID of the existing content
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the existing content using GET API
  useEffect(() => {
    const fetchHowToPlayContent = async () => {
      try {
        setLoading(true); // Set loading to true while data is being fetched
        const response = await axiosInstance.get(`/api/settings/howtoplay`);
        const data = response.data[0]; // Assuming data is an array with one object
        
        if (data) {
          setDescription(data.howtoplay_content || "Enter a short description...");
          setHowToPlayContent(data.howtoplay_content || ""); 
          setVideoLink(data.video_link || "");
          setId(data._id); // Save the ID for updating
        }
      } catch (error) {
        console.error("Error fetching How to Play data:", error);
        alert("Failed to fetch How to Play content.");
      } finally {
        setLoading(false); // Set loading to false after the data fetch is complete
      }
    };

    fetchHowToPlayContent();
  }, []); // Empty dependency array to run only once when component mounts

  // Handle input changes
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleContentChange = (e) => {
    setHowToPlayContent(e.target.value);
  };

  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value);
  };

  // Handle the update request using PUT API
  const handleUpdate = async () => {
    if (!description.trim() || !howToPlayContent.trim() || !videoLink.trim()) {
      alert("All fields must be filled out.");
      return;
    }

    try {
      await axiosInstance.put(`/api/settings/howtoplay/${id}`, {
        howtoplay_content: howToPlayContent,
        video_link: videoLink,
      });

      alert("How to Play Content Updated Successfully!");
      // console.log("Updated Description:", description);
      // console.log("Updated Content:", howToPlayContent);
      // console.log("Updated Video Link:", videoLink);
    } catch (error) {
      console.error("Error updating How to Play content:", error);
      alert("Failed to update How to Play content.");
    }
  };

  return (
    <div>
    <h2 className="text-xl font-bold text-blue-600 mb-4">How To Play</h2>
  
    {loading ? (
      <div className="text-center">Loading...</div>
    ) : (
      <>
        {/* How To Play Content */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">How To Play Content</label>
          <textarea
            name="howToPlayContent"
            value={howToPlayContent}
            onChange={handleContentChange}
            placeholder="Enter detailed How To Play instructions..."
            className="w-full border border-gray-300 p-2 rounded-md h-40"
          />
        </div>
  
        {/* Video Link */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Video Link</label>
          <input
            type="text"
            name="videoLink"
            value={videoLink}
            onChange={handleVideoLinkChange}
            placeholder="Enter YouTube or Video Link"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
  
        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa]"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </>
    )}
  </div>
    
  
  );
};

export default HowToPlay;
