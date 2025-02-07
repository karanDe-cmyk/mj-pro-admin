import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming axiosInstance is set up
import { appiD } from "../../utils/config"; // Ensure appiD is correctly imported

const UPISettings = () => {
  const [upiData, setUpiData] = useState({
    id: "", // Store ID for update
    upiName: "",
    upiPaymentId: "",
    upiPaytmId: "",
    upiPhonePeId: "",
    upiGooglePayId: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // Track fetching state for loading indicator

  // Fetch UPI data on mount
  useEffect(() => {
    const fetchUPIData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/settings/upipayment/${appiD}`);
        const data = response.data[0]; // Extract the first object from the array response

        if (data) {
          setUpiData({
            id: data._id, // Store ID for update
            upiName: data.upi_name || "",
            upiPaymentId: data.upi_paymentid || "",
            upiPaytmId: data.upi_paytm_id || "",
            upiPhonePeId: data.upi_phonepay_id || "",
            upiGooglePayId: data.upi_googlepay_id || "",
          });
        }

        setFetchingData(false); // Done fetching data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching UPI data:", error);
        alert("Failed to fetch UPI data");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchUPIData();
  }, [appiD]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpiData({ ...upiData, [name]: value });
  };

  // Handle form submission (Update API)
  const handleUpdate = async () => {
    const { upiName, upiPaymentId } = upiData;

    // Trim values to avoid spaces
    if (!upiName.trim() || !upiPaymentId.trim()) {
      alert("UPI Name and Payment ID cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/api/settings/upipayment/${appiD}/${upiData.id}`, {
        upi_name: upiData.upiName,
        upi_paymentid: upiData.upiPaymentId,
        upi_paytm_id: upiData.upiPaytmId,
        upi_phonepay_id: upiData.upiPhonePeId,
        upi_googlepay_id: upiData.upiGooglePayId,
      });
      alert("UPI Details Updated Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating UPI data:", error);
      alert("Failed to update UPI data");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      {/* Fullscreen loading overlay */}
      {(loading || fetchingData) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <h2 className="text-xl font-bold text-blue-600 mb-4">UPI Payment ID</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold">UPI Name</label>
          <input
            type="text"
            name="upiName"
            value={upiData.upiName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading} // Disable input when loading
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">UPI Payment ID</label>
          <input
            type="text"
            name="upiPaymentId"
            value={upiData.upiPaymentId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading} // Disable input when loading
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">UPI Paytm ID</label>
          <input
            type="text"
            name="upiPaytmId"
            value={upiData.upiPaytmId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading} // Disable input when loading
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">UPI PhonePe ID</label>
          <input
            type="text"
            name="upiPhonePeId"
            value={upiData.upiPhonePeId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading} // Disable input when loading
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">UPI Google Pay ID</label>
          <input
            type="text"
            name="upiGooglePayId"
            value={upiData.upiGooglePayId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            disabled={loading} // Disable input when loading
          />
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default UPISettings;
