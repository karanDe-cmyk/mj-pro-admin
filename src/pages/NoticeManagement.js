import React, { useState } from "react";

const NoticeManagement = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    // Simulate an API call to save notice data
    if (formData.title && formData.description) {
      setMessage("Notice updated successfully!");
    } else {
      setMessage("Please fill out both fields.");
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
          className="bg-blue-500 text-white mt-4 px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Update
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
