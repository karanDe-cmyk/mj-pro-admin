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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      {/* Fullscreen loading overlay */}
      {loading || fetchingData ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : null}

      <h2 className="text-xl font-bold text-blue-600 mb-4">App Links Management</h2>

      <div className="mb-4">
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

      <div className="mb-4">
        <label className="block text-sm font-semibold">Share Message</label>
        <input
          type="text"
          name="shareMessage"
          value={appLinks.shareMessage}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Links"}
      </button>
    </div>
  );
};

export default AppLinks;
