import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming axiosInstance is set up
import { } from "../../utils/config"; // Ensure  is correctly imported

const HomeTitleSettings = () => {
  const [homeTitles, setHomeTitles] = useState({
    id: "", // Store ID for update
    homeTitle1: "",
    homeTitle2: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Track fetching state for loading indicator

  // Fetch home titles on mount
  useEffect(() => {
    const fetchHomeTitles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/hometitle`);
        const data = response.data[0]; // Extract first object from array response

        if (data) {
          setHomeTitles({
            id: data._id, // Store ID for update
            homeTitle1: data.title_1 || "",
            homeTitle2: data.title_2 || "",
          });
        }

        setFetchingData(false); // Done fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home titles:", error);
        alert("Failed to fetch home titles");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchHomeTitles();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHomeTitles({ ...homeTitles, [name]: value });
  };

  // Handle form submission (Update API)
  const handleUpdate = async () => {
    const { homeTitle1, homeTitle2, id } = homeTitles;

    if (!homeTitle1.trim() || !homeTitle2.trim()) {
      alert("Home Titles cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        // UPDATE
        await axiosInstance.put(`/api/settings/hometitle/${id}`, {
          title_1: homeTitle1,
          title_2: homeTitle2,
        });

        alert("Home Titles Updated Successfully!");
      } else {
        // CREATE
        const response = await axiosInstance.post(`/api/settings/hometitle`, {
          title_1: homeTitle1,
          title_2: homeTitle2,
        });

        setHomeTitles({
          id: response.data._id, // save new id
          homeTitle1,
          homeTitle2,
        });

        alert("Home Titles Created Successfully!");
      }

      setLoading(false);

    } catch (error) {
      console.error("Error saving home titles:", error);
      alert("Failed to save home titles");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Fullscreen loading overlay */}
        {(loading || fetchingData) && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}

        <h2 className="text-xl font-bold text-blue-600 mb-4">Home Title</h2>

        {/* One row with two columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Home Title 1</label>
            <input
              type="text"
              name="homeTitle1"
              value={homeTitles.homeTitle1}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Home Title 2</label>
            <input
              type="text"
              name="homeTitle2"
              value={homeTitles.homeTitle2}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        {/* Button container aligned to the bottom left with extra top margin */}
        <div className="mt-8">
          <button
            onClick={handleUpdate}
            className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa]"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </>

  );
};

export default HomeTitleSettings;
