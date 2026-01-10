import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

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
        // alert("Failed to fetch bank details");
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

    const payload = {
      account_holder_name: bankDetails.account_holder_name.trim(),
      account_number: Number(bankDetails.account_number), // ✅ IMPORTANT
      ifsc_code: bankDetails.ifsc_code.trim(),
    };

    try {
      setLoading(true);

      if (bankDetails.id) {
        await axiosInstance.put(
          `/api/settings/bankdetails/${bankDetails.id}`,
          payload
        );
        alert("Bank details updated successfully!");
      } else {
        await axiosInstance.post(
          `/api/settings/bankdetails`,
          payload
        );
        alert("Bank details created successfully!");
      }

    } catch (error) {
      console.error("Error saving bank details:", error);
      alert("Failed to save bank details");
    } finally {
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

      <h2 className="text-xl font-bold text-blue-600 mb-4">Add Bank Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          {/* Column 1: Account Holder Name and Update Button */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold">Account Holder Name</label>
            <input
              type="text"
              name="account_holder_name"
              value={bankDetails.account_holder_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
            {/* Increased margin and reduced width on the button */}
            <button
              type="submit"
              className="mt-8 w-32 bg-[#556EE6] text-white py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

          </div>

          {/* Column 2: Account Number */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold">Account Number</label>
            <input
              type="text"
              name="account_number"
              value={bankDetails.account_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
          </div>

          {/* Column 3: IFSC Code */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold">IFSC Code</label>
            <input
              type="text"
              name="ifsc_code"
              value={bankDetails.ifsc_code}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>


  );
};

export default BankDetails;
