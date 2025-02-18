import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";

const NoticeManagement = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [noticeId, setNoticeId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch notice data on component mount
  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/api/settings/noticeManagement/");
        if (response.data && response.data.length > 0) {
          // Extract only title, description and _id from the first object in the array
          const { _id, title, description } = response.data[0];
          setNoticeId(_id);
          setFormData({ title, description });
        }
      } catch (error) {
        console.error("Error fetching notice data:", error);
        setMessage("Error fetching notice data");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.description) {
      setMessage("Please fill out both fields.");
      return;
    }
    try {
      setLoading(true);
      if (!noticeId) {
        setMessage("Notice ID not found");
        return;
      }
      // Call the PUT API with the notice ID dynamically added to the URL
      const response = await instance.put(
        `/api/settings/noticeManagement/${noticeId}`,
        formData
      );
      setMessage("Notice updated successfully!");
      // Optionally, update the state with the response data
      if (response.data) {
        const { title, description } = response.data;
        setFormData({ title, description });
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      setMessage("Error updating notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Form Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Notification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-500 text-white mt-4 px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

      {/* Message Section */}
      {message && (
        <div className="mt-4">
          <p
            className={`${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            } font-medium`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;
