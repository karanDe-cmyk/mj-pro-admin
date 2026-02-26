import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';

// Custom alert component to replace window.alert
const AlertMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  let bgColor, borderColor, textColor;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      borderColor = 'border-green-400';
      textColor = 'text-green-700';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-400';
      textColor = 'text-red-700';
      break;
    default: // info
      bgColor = 'bg-blue-100';
      borderColor = 'border-blue-400';
      textColor = 'text-blue-700';
      break;
  }

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md border-l-4 shadow-lg z-50 ${bgColor} ${borderColor} ${textColor}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <p className="font-bold">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</p>
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} opacity-50 hover:opacity-100`}
        >
          <svg className="h-4 w-4" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 0 1 1.697 1.697L11.697 10l2.652 2.651a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
};

const UPISettings = () => {
  // UPI Data State
  const [upiData, setUpiData] = useState({
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
    status: "Active",
  });

  // PayU Gateway State
  const [payuData, setPayuData] = useState({
    id: "",
    status: "inactive",
    merchantKey: "",
    salt: "",
    mode: "test",
    backendUrl: ""
  });

  // Razorpay Gateway State
  const [razorpayData, setRazorpayData] = useState({
    id: "",
    key_id: "",
    key_secret: "",
    status: "inactive"
  });

  const [loading, setLoading] = useState(false);
  const [payuLoading, setPayuLoading] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [activeTab, setActiveTab] = useState("upi"); // 'upi', 'fbm', 'payu', or 'razorpay'
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Handle alert closure
  const handleAlertClose = () => {
    setAlert({ message: '', type: '' });
  };

  const normalizeStatus = (status) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Fetch all settings data on mount
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setFetchingData(true);

        // Fetch UPI data
        const upiResponse = await axiosInstance.get(`/api/settings/upipayment`);
        const upiDataResponse = upiResponse.data[0];

        if (upiDataResponse) {
          setUpiData({
            id: upiDataResponse._id || "",
            upiName: upiDataResponse.upi_name || "",
            upiPaymentId: upiDataResponse.upi_paymentid || "",
            upiPaytmId: upiDataResponse.upi_paytm_id || "",
            upiPhonePeId: upiDataResponse.upi_phonepay_id || "",
            upiGooglePayId: upiDataResponse.upi_googlepay_id || "",
            status: normalizeStatus(upiDataResponse.status),
          });
        }

        // Fetch FBM gateway data
        const fbmResponse = await axiosInstance.get(`/api/settings/fbmgateway`);
        const fbmDataResponse = fbmResponse.data.data[0];

        if (fbmDataResponse) {
          setFbmData({
            id: fbmDataResponse._id || "",
            usertoken: fbmDataResponse.usertoken || "",
            minAmount: fbmDataResponse.min_amount || "",
            maxAmount: fbmDataResponse.max_amount || "",
            status: normalizeStatus(fbmDataResponse.status),
          });
        }

        // Fetch PayU gateway status
        const payuResponse = await axiosInstance.get(`/api/settings/payu/status/payu`);
        if (payuResponse.data.success) {
          const config = payuResponse.data.config;

          setPayuData({
            id: config?._id || "",
            status: config?.status || "inactive",
            merchantKey: config?.merchantKey || "",
            salt: config?.salt || "",
            mode: config?.mode || "test",
            backendUrl: config?.backendUrl || "",
          });
        }

        // Fetch Razorpay gateway data
        const razorpayResponse = await axiosInstance.get(`/api/razorpay/get`);
        if (razorpayResponse.data && razorpayResponse.data.data) {
          const razorpay = razorpayResponse.data.data;
          setRazorpayData({
            id: razorpay._id || "",
            key_id: razorpay.key_id || "",
            key_secret: razorpay.key_secret || "",
            status: razorpay.status || "inactive",
          });
        }

      } catch (error) {
        console.error("Error fetching settings data:", error);
        // Don't show error for Razorpay if it's just not found
        if (!error.response || error.response.status !== 404) {
          setAlert({ message: "Failed to fetch settings data", type: "error" });
        }
      } finally {
        setFetchingData(false);
      }
    };

    fetchSettingsData();
  }, []);

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

  // Handle Razorpay input change
  const handleRazorpayChange = (e) => {
    const { name, value } = e.target;
    setRazorpayData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle UPI form submission
  const handleUpiUpdate = async () => {
    // Basic validation
    if (!upiData.upiName.trim() || !upiData.upiPaymentId.trim()) {
      setAlert({ message: "UPI Name and UPI Payment ID cannot be empty.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        upi_name: upiData.upiName.trim(),
        upi_paymentid: upiData.upiPaymentId.trim(),
        upi_paytm_id: upiData.upiPaytmId.trim(),
        upi_phonepay_id: upiData.upiPhonePeId.trim(),
        upi_googlepay_id: upiData.upiGooglePayId.trim(),
        status: upiData.status.toLowerCase(),
      };

      // Check if an existing record exists to decide between POST and PUT
      if (upiData.id) {
        await axiosInstance.put(`/api/settings/upipayment/${upiData.id}`, payload);
      } else {
        await axiosInstance.post(`/api/settings/upipayment`, payload);
      }

      setAlert({ message: "UPI Settings Updated Successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating UPI data:", error);
      setAlert({ message: "Failed to update UPI data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle FBM form submission
  const handleFbmUpdate = async () => {
    const { usertoken, minAmount, maxAmount } = fbmData;

    if (!usertoken.trim()) {
      setAlert({ message: "User Token cannot be empty.", type: "error" });
      return;
    }

    if (isNaN(minAmount) || isNaN(maxAmount) || parseInt(minAmount) <= 0 || parseInt(maxAmount) <= 0 || parseInt(minAmount) >= parseInt(maxAmount)) {
      setAlert({ message: "Please enter valid amount limits. Minimum amount must be less than maximum amount.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        usertoken: fbmData.usertoken.trim(),
        min_amount: parseInt(fbmData.minAmount),
        max_amount: parseInt(fbmData.maxAmount),
        status: fbmData.status.toLowerCase(),
      };

      // Fetch the latest data to check for an existing ID
      const res = await axiosInstance.get('/api/settings/fbmgateway');
      const fbmGateway = res.data.data[0];

      // If we have an ID, update existing. Otherwise create new.
      if (fbmGateway?._id) {
        await axiosInstance.put(`/api/settings/fbmgateway/${fbmGateway._id}`, payload);
      } else {
        await axiosInstance.post(`/api/settings/fbmgateway`, payload);
      }

      setAlert({ message: "FBM Gateway Settings Updated Successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating FBM gateway data:", error);
      setAlert({ message: "Failed to update FBM gateway data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle PayU status update
  const handlePayuUpdate = async () => {
    try {
      setPayuLoading(true);

      const payload = {
        name: "payu",
        status: payuData.status,
        merchantKey: payuData.merchantKey.trim(),
        salt: payuData.salt.trim(),
        mode: payuData.mode,
        backendUrl: payuData.backendUrl.trim(),
      };

      const response = await axiosInstance.post("/api/settings/payu/update", payload);

      if (response.data.success) {
        setAlert({
          message: `PayU Gateway ${payuData.status === 'active' ? 'Activated' : 'Deactivated'} Successfully!`,
          type: "success"
        });
      } else {
        setAlert({ message: "Failed to update PayU status", type: "error" });
      }
    } catch (error) {
      console.error("Error updating PayU status:", error);
      setAlert({ message: "Failed to update PayU status", type: "error" });
    } finally {
      setPayuLoading(false);
    }
  };

  // Handle Razorpay update
  const handleRazorpayUpdate = async () => {
    const { key_id, key_secret, status } = razorpayData;

    if (!key_id.trim() || !key_secret.trim()) {
      setAlert({ message: "Key ID and Key Secret cannot be empty.", type: "error" });
      return;
    }

    try {
      setRazorpayLoading(true);

      const payload = {
        key_id: key_id.trim(),
        key_secret: key_secret.trim(),
        status: status,
      };

      let response;

      response = await axiosInstance.post("/api/razorpay/create", payload);

      if (response.data.success || response.data.message) {
        // Update the ID if we got one back
        if (response.data.data?._id) {
          setRazorpayData(prev => ({ ...prev, id: response.data.data._id }));
        }

        setAlert({
          message: `Razorpay Gateway ${status === 'active' ? 'Activated' : 'Deactivated'} Successfully!`,
          type: "success"
        });
      } else {
        setAlert({ message: "Failed to update Razorpay settings", type: "error" });
      }
    } catch (error) {
      console.error("Error updating Razorpay settings:", error);
      setAlert({
        message: error.response?.data?.message || "Failed to update Razorpay settings",
        type: "error"
      });
    } finally {
      setRazorpayLoading(false);
    }
  };

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen font-sans">
      <AlertMessage message={alert.message} type={alert.type} onClose={handleAlertClose} />

      {/* Loading overlay */}
      {(loading || fetchingData || payuLoading || razorpayLoading) && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b mb-6 overflow-x-auto">
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out whitespace-nowrap ${activeTab === 'upi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upi')}
            disabled={loading}
          >
            UPI Settings
          </button>
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out whitespace-nowrap ${activeTab === 'fbm' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('fbm')}
            disabled={loading}
          >
            IMB Gateway
          </button>
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out whitespace-nowrap ${activeTab === 'payu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('payu')}
            disabled={loading}
          >
            PayU Gateway
          </button>
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out whitespace-nowrap ${activeTab === 'razorpay' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('razorpay')}
            disabled={loading}
          >
            Razorpay Gateway
          </button>
        </div>

        {/* UPI Settings Tab */}
        {activeTab === 'upi' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">UPI Payment Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* UPI Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI Name</label>
                <input
                  type="text"
                  name="upiName"
                  value={upiData.upiName}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI Payment ID</label>
                <input
                  type="text"
                  name="upiPaymentId"
                  value={upiData.upiPaymentId}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI Paytm ID</label>
                <input
                  type="text"
                  name="upiPaytmId"
                  value={upiData.upiPaytmId}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI PhonePe ID</label>
                <input
                  type="text"
                  name="upiPhonePeId"
                  value={upiData.upiPhonePeId}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">UPI Google Pay ID</label>
                <input
                  type="text"
                  name="upiGooglePayId"
                  value={upiData.upiGooglePayId}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={upiData.status}
                  onChange={handleUpiChange}
                  className="w-full border border-gray-300 p-3 rounded-md bg-white focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpiUpdate}
                className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update UPI"}
              </button>
            </div>
          </div>
        )}

        {/* FBM Gateway Tab */}
        {activeTab === 'fbm' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">IMB Gateway Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User Token</label>
                <input
                  type="text"
                  name="usertoken"
                  value={fbmData.usertoken}
                  onChange={handleFbmChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Amount (₹)</label>
                <input
                  type="number"
                  name="minAmount"
                  value={fbmData.minAmount}
                  onChange={handleFbmChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Maximum Amount (₹)</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={fbmData.maxAmount}
                  onChange={handleFbmChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={fbmData.status}
                  onChange={handleFbmChange}
                  className="w-full border border-gray-300 p-3 rounded-md bg-white focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleFbmUpdate}
                className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update FBM"}
              </button>
            </div>
          </div>
        )}

        {/* PayU Gateway Tab */}
        {activeTab === 'payu' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">PayU Gateway Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold mb-1">Merchant Key</label>
                <input
                  type="text"
                  value={payuData.merchantKey}
                  onChange={(e) => setPayuData({ ...payuData, merchantKey: e.target.value })}
                  className="w-full border p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Salt</label>
                <input
                  type="text"
                  value={payuData.salt}
                  onChange={(e) => setPayuData({ ...payuData, salt: e.target.value })}
                  className="w-full border p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Mode</label>
                <select
                  value={payuData.mode}
                  onChange={(e) => setPayuData({ ...payuData, mode: e.target.value })}
                  className="w-full border p-3 rounded-md bg-white focus:ring focus:ring-blue-200 focus:border-blue-500"
                >
                  <option value="test">Test</option>
                  <option value="live">Live</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Backend URL</label>
                <input
                  type="text"
                  value={payuData.backendUrl}
                  onChange={(e) => setPayuData({ ...payuData, backendUrl: e.target.value })}
                  className="w-full border p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  value={payuData.status}
                  onChange={(e) => setPayuData({ ...payuData, status: e.target.value })}
                  className="w-full border p-3 rounded-md bg-white focus:ring focus:ring-blue-200 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handlePayuUpdate}
                className="w-40 bg-purple-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-purple-700 transition-colors duration-200 ease-in-out disabled:bg-purple-300"
                disabled={payuLoading}
              >
                {payuLoading ? "Updating..." : "Update PayU"}
              </button>
            </div>
          </div>
        )}

        {/* Razorpay Gateway Tab */}
        {activeTab === 'razorpay' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Razorpay Gateway Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Key ID</label>
                <input
                  type="text"
                  name="key_id"
                  value={razorpayData.key_id}
                  onChange={handleRazorpayChange}
                  placeholder="rzp_live_xxxxxxxxxxxx"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={razorpayLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Your Razorpay API Key ID</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Key Secret</label>
                <input
                  type="text"
                  name="key_secret"
                  value={razorpayData.key_secret}
                  onChange={handleRazorpayChange}
                  placeholder="xxxxxxxxxxxxxxxx"
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={razorpayLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Your Razorpay API Key Secret</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={razorpayData.status}
                  onChange={handleRazorpayChange}
                  className="w-full border border-gray-300 p-3 rounded-md bg-white focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                  disabled={razorpayLoading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleRazorpayUpdate}
                className="w-48 bg-green-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-green-700 transition-colors duration-200 ease-in-out disabled:bg-green-300 flex items-center justify-center"
                disabled={razorpayLoading}
              >
                {razorpayLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Razorpay"
                )}
              </button>
            </div>

            {/* Current Configuration Display */}
            {razorpayData.id && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Configuration:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Key ID:</span>
                    <span className="ml-2 font-mono">{razorpayData.key_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 font-semibold ${razorpayData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {razorpayData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UPISettings;