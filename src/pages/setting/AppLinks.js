import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming axiosInstance is set up
import {  } from "../../utils/config"; // Ensure  is correctly imported

const AppLinks = () => {
  const [appLinks, setAppLinks] = useState({
    id: "", // Store ID for update
    AppLink: "",
    shareMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Track fetching state for loading indicator

  // Fetch app links on mount
  useEffect(() => {
    const fetchAppLinks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/applink`);
        const data = response.data[0]; // Extract first object from array response

        if (data) {
          setAppLinks({
            id: data._id, // Store ID for update
            AppLink: data.applink || "",
            shareMessage: data.sharemessage || "",
          });
        }

        setFetchingData(false); // Done fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching app links:", error);
        alert("Failed to fetch app links");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchAppLinks();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppLinks({ ...appLinks, [name]: value });
  };

  // Handle form submission (Update API)
  const handleSave = async () => {
    if (!appLinks.id) {
      alert("Error: Missing app link ID!");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/api/settings/applink/${appLinks.id}`, {
        applink: appLinks.AppLink,
        sharemessage: appLinks.shareMessage,
      });
      alert("App Links Updated Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating app links:", error);
      alert("Failed to update app links");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
    {/* Fullscreen loading overlay */}
    {(loading || fetchingData) && (
      <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )}
  
    <h2 className="text-xl font-bold text-blue-600 mb-4">Add App Link
    </h2>
  
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Column 1: App Link */}
      <div className="flex flex-col">
        <label className="block text-sm font-semibold">App Link</label>
        <input
          type="text"
          name="AppLink"
          value={appLinks.AppLink}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          disabled={loading}
        />
      </div>
  
      {/* Column 2: Share Message */}
      <div className="flex flex-col">
        <label className="block text-sm font-semibold">Share Message</label>
        <textarea
          name="shareMessage"
          value={appLinks.shareMessage}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md h-32"
          disabled={loading}
        ></textarea>
      </div>
    </div>
  
    {/* Save button aligned at bottom start with margin-top */}
    <div className="mt-4">
      <button
        onClick={handleSave}
        className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa]"
        disabled={loading}
      >
        {loading ? "Saving..." : "Update"}
      </button>
    </div>
  </div>
  

  );
};

export default AppLinks;
