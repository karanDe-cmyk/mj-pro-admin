import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const UPISettings = () => {
  // UPI Data State
  // UPI Data State
  const [upiData, setUpiData] = useState({
    id: "",
    id: "",
    upiName: "",
    upiPaymentId: "",
    upiPaytmId: "",
    upiPhonePeId: "",
    upiGooglePayId: "",
    status: "Active",
  });

  // FBM Gateway Data State
  const [fbmData, setFbmData] = useState({
    id: "",
    usertoken: "",
    minAmount: "",
    maxAmount: "",
    status: "Inactive",
    status: "Active",
  });

  // FBM Gateway Data State
  const [fbmData, setFbmData] = useState({
    id: "",
    usertoken: "",
    minAmount: "",
    maxAmount: "",
    status: "Inactive",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' or 'fbm'
  const [fetchingData, setFetchingData] = useState(true);
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' or 'fbm'

  // Fetch all settings data on mount
  // Fetch all settings data on mount
  useEffect(() => {
    const fetchSettingsData = async () => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        
        // Fetch UPI data
        const upiResponse = await axiosInstance.get(`/api/settings/upipayment`);
        const upiDataResponse = upiResponse.data[0];

        if (upiDataResponse) {
        
        // Fetch UPI data
        const upiResponse = await axiosInstance.get(`/api/settings/upipayment`);
        const upiDataResponse = upiResponse.data[0];

        if (upiDataResponse) {
          setUpiData({
            id: upiDataResponse._id,
            upiName: upiDataResponse.upi_name || "",
            upiPaymentId: upiDataResponse.upi_paymentid || "",
            upiPaytmId: upiDataResponse.upi_paytm_id || "",
            upiPhonePeId: upiDataResponse.upi_phonepay_id || "",
            upiGooglePayId: upiDataResponse.upi_googlepay_id || "",
            status: upiDataResponse.status || "Active",
          });
        }

        // Fetch FBM gateway data
        const fbmResponse = await axiosInstance.get(`/api/settings/fbmgateway`);
        const fbmDataResponse = fbmResponse.data[0];

        if (fbmDataResponse) {
          setFbmData({
            id: fbmDataResponse._id,
            usertoken: fbmDataResponse.usertoken || "",
            minAmount: fbmDataResponse.min_amount || "",
            maxAmount: fbmDataResponse.max_amount || "",
            status: fbmDataResponse.status || "Inactive",
            id: upiDataResponse._id,
            upiName: upiDataResponse.upi_name || "",
            upiPaymentId: upiDataResponse.upi_paymentid || "",
            upiPaytmId: upiDataResponse.upi_paytm_id || "",
            upiPhonePeId: upiDataResponse.upi_phonepay_id || "",
            upiGooglePayId: upiDataResponse.upi_googlepay_id || "",
            status: upiDataResponse.status || "Active",
          });
        }

        // Fetch FBM gateway data
        const fbmResponse = await axiosInstance.get(`/api/settings/fbmgateway`);
        const fbmDataResponse = fbmResponse.data[0];

        if (fbmDataResponse) {
          setFbmData({
            id: fbmDataResponse._id,
            usertoken: fbmDataResponse.usertoken || "",
            minAmount: fbmDataResponse.min_amount || "",
            maxAmount: fbmDataResponse.max_amount || "",
            status: fbmDataResponse.status || "Inactive",
          });
        }

        setFetchingData(false);
        setFetchingData(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings data:", error);
        alert("Failed to fetch settings data");
        console.error("Error fetching settings data:", error);
        alert("Failed to fetch settings data");
        setLoading(false);
        setFetchingData(false);
      }
    };

    fetchSettingsData();
    fetchSettingsData();
  }, []);

  // Handle input change for UPI
  const handleUpiChange = (e) => {
  // Handle input change for UPI
  const handleUpiChange = (e) => {
    const { name, value } = e.target;
    setUpiData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input change for FBM
  const handleFbmChange = (e) => {
    const { name, value } = e.target;
    setFbmData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input change for FBM
  const handleFbmChange = (e) => {
    const { name, value } = e.target;
    setFbmData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle UPI form submission
  const handleUpiUpdate = async () => {
    const { upiName, upiPaymentId } = upiData;
  // Handle UPI form submission
  const handleUpiUpdate = async () => {
    const { upiName, upiPaymentId } = upiData;

    if (!upiName.trim() || !upiPaymentId.trim()) {
      alert("UPI Name and Payment ID cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/api/settings/upipayment/${upiData.id}`, {
        upi_name: upiData.upiName,
        upi_paymentid: upiData.upiPaymentId,
        upi_paytm_id: upiData.upiPaytmId,
        upi_phonepay_id: upiData.upiPhonePeId,
        upi_googlepay_id: upiData.upiGooglePayId,
        status: upiData.status,
      });
      alert("UPI Details Updated Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating UPI data:", error);
      alert("Failed to update UPI data");
      setLoading(false);
    }
  };

  // Handle FBM form submission
  const handleFbmUpdate = async () => {
    const { usertoken, minAmount, maxAmount } = fbmData;

    if (!usertoken.trim()) {
      alert("API Key and Merchant ID cannot be empty.");
      return;
    }

    if (isNaN(minAmount) || isNaN(maxAmount) || parseInt(minAmount) <= 0 || parseInt(maxAmount) <= 0) {
      alert("Please enter valid amount limits.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        usertoken: fbmData.usertoken,
        min_amount: fbmData.minAmount,
        max_amount: fbmData.maxAmount,
        status: fbmData.status,
      };

      // If we have an ID, update existing. Otherwise create new.
      if (fbmData.id) {
        await axiosInstance.put(`/api/settings/fbmgateway/${fbmData.id}`, payload);
      } else {
        await axiosInstance.post(`/api/settings/fbmgateway`, payload);
      }

      alert("FBM Gateway Settings Updated Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating FBM gateway data:", error);
      alert("Failed to update FBM gateway data");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {/* Loading overlay */}
      {(loading || fetchingData) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'upi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('upi')}
        >
          UPI Settings
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'fbm' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fbm')}
        >
          FBM Gateway
        </button>
      </div>

      {/* UPI Settings Tab */}
      {activeTab === 'upi' && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">UPI Payment Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* UPI Fields */}
            <div>
              <label className="block text-sm font-semibold">UPI Name</label>
              <input
                type="text"
                name="upiName"
                value={upiData.upiName}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">UPI Payment ID</label>
              <input
                type="text"
                name="upiPaymentId"
                value={upiData.upiPaymentId}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">UPI Paytm ID</label>
              <input
                type="text"
                name="upiPaytmId"
                value={upiData.upiPaytmId}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">UPI PhonePe ID</label>
              <input
                type="text"
                name="upiPhonePeId"
                value={upiData.upiPhonePeId}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">UPI Google Pay ID</label>
              <input
                type="text"
                name="upiGooglePayId"
                value={upiData.upiGooglePayId}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Status</label>
              <select
                name="status"
                value={upiData.status}
                onChange={handleUpiChange}
                className="w-full border border-gray-300 p-2 rounded-md bg-white"
                disabled={loading}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleUpiUpdate}
              className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa] ml-4"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}

      {/* FBM Gateway Tab */}
      {activeTab === 'fbm' && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">FBM Gateway Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">User Token</label>
              <input
                type="text"
                name="usertoken"
                value={fbmData.usertoken}
                onChange={handleFbmChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Minimum Amount (₹)</label>
              <input
                type="number"
                name="minAmount"
                value={fbmData.minAmount}
                onChange={handleFbmChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Maximum Amount (₹)</label>
              <input
                type="number"
                name="maxAmount"
                value={fbmData.maxAmount}
                onChange={handleFbmChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Status</label>
              <select
                name="status"
                value={fbmData.status}
                onChange={handleFbmChange}
                className="w-full border border-gray-300 p-2 rounded-md bg-white"
                disabled={loading}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleFbmUpdate}
              className="w-32 bg-[#556EE6] text-white px-4 py-2 rounded-md hover:bg-[#4455aa] ml-4"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPISettings;