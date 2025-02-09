import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {  } from "../../utils/config"; // Ensure  is correctly imported

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState({
    id: "", // To store ID for updates
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Track fetching state for loading indicator

  // Fetch bank details on mount
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/bankdetails`);
        const data = response.data[0]; // Extract first object from array response

        if (data) {
          setBankDetails({
            id: data._id, // Store ID for update
            account_holder_name: data.account_holder_name || "",
            account_number: data.account_number || "",
            ifsc_code: data.ifsc_code || "",
          });
        }

        setFetchingData(false); // Done fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bank details:", error);
        alert("Failed to fetch bank details");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchBankDetails();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  // Handle form submission (Update API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankDetails.id) {
      alert("Error: Missing bank details ID!");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/api/settings/bankdetails/${bankDetails.id}`, bankDetails);
      alert("Bank details updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating bank details:", error);
      alert("Failed to update bank details");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      {/* Fullscreen loading overlay */}
      {loading || fetchingData ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : null}

      <h2 className="text-xl font-bold text-blue-600 mb-4">Add Bank Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Account Holder Name</label>
          <input
            type="text"
            name="account_holder_name" // Make sure name matches the state property
            value={bankDetails.account_holder_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Account Number</label>
          <input
            type="text"
            name="account_number" // Correct name to match state property
            value={bankDetails.account_number}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">IFSC Code</label>
          <input
            type="text"
            name="ifsc_code" // Correct name to match state property
            value={bankDetails.ifsc_code}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default BankDetails;
