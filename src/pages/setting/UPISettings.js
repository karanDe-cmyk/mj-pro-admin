import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance';
// import XtreemGateway from '../../components/XtreemGateway';

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
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 3.152a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 6.848a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-3.152a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 3.152a1.2 1.2 0 0 1 0 1.698z" />
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
    status: "Inactive",
    discountAmounts: [
      { percentage: 5, amount: "" },
      { percentage: 10, amount: "" },
      { percentage: 15, amount: "" },
      { percentage: 20, amount: "" },
      { percentage: 25, amount: "" }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' or 'fbm'
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Handle alert closure
  const handleAlertClose = () => {
    setAlert({ message: '', type: '' });
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
            status: upiDataResponse.status || "Active",
          });
        }

        // Fetch FBM gateway data
        const fbmResponse = await axiosInstance.get(`/api/settings/fbmgateway`);
        const fbmDataResponse = fbmResponse.data.data[0];

        if (fbmDataResponse) {
          // Ensure discountAmounts array has all 5 percentages
          let discountAmounts = fbmDataResponse.discountAmounts || [];

          // Agar koi percentage missing hai toh add karein
          const requiredPercentages = [5, 10, 15, 20, 25];
          requiredPercentages.forEach(percentage => {
            if (!discountAmounts.find(item => item.percentage === percentage)) {
              discountAmounts.push({ percentage, amount: 0 });
            }
          });

          // Sort by percentage
          discountAmounts.sort((a, b) => a.percentage - b.percentage);

          setFbmData({
            id: fbmDataResponse._id || "",
            usertoken: fbmDataResponse.usertoken || "",
            minAmount: fbmDataResponse.min_amount || "",
            maxAmount: fbmDataResponse.max_amount || "",
            status: fbmDataResponse.status || "Inactive",
            discountAmounts: discountAmounts
          });
        }


      } catch (error) {
        console.error("Error fetching settings data:", error);
        // setAlert({ message: "Failed to fetch settings data", type: "error" });
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

  // Handle discount amount change
  const handleDiscountAmountChange = (index, value) => {
    setFbmData(prev => ({
      ...prev,
      discountAmounts: prev.discountAmounts.map((item, i) =>
        i === index ? { ...item, amount: value } : item
      )
    }));
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
    const { usertoken, minAmount, maxAmount, discountAmounts } = fbmData;

    if (!usertoken.trim()) {
      setAlert({ message: "User Token cannot be empty.", type: "error" });
      return;
    }

    if (isNaN(minAmount) || isNaN(maxAmount) || parseInt(minAmount) <= 0 || parseInt(maxAmount) <= 0 || parseInt(minAmount) >= parseInt(maxAmount)) {
      setAlert({ message: "Please enter valid amount limits. Minimum amount must be less than maximum amount.", type: "error" });
      return;
    }

    // Validate discount amounts
    const invalidDiscount = discountAmounts.find(item =>
      item.amount && (isNaN(item.amount) || parseFloat(item.amount) < 0)
    );

    if (invalidDiscount) {
      setAlert({ message: `Please enter valid amount for ${invalidDiscount.percentage}% discount`, type: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        usertoken: fbmData.usertoken.trim(),
        min_amount: parseInt(fbmData.minAmount),
        max_amount: parseInt(fbmData.maxAmount),
        status: fbmData.status.toLowerCase(),
        discountAmounts: fbmData.discountAmounts.map(item => ({
          percentage: item.percentage,
          amount: item.amount ? parseFloat(item.amount) : 0
        }))
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

      setAlert({ message: "IMB Gateway Settings Updated Successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating IMB gateway data:", error);
      setAlert({ message: "Failed to update IMB gateway data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen font-sans">
      <AlertMessage message={alert.message} type={alert.type} onClose={handleAlertClose} />

      {/* Loading overlay */}
      {(loading || fetchingData) && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${activeTab === 'upi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upi')}
            disabled={loading}
          >
            UPI Settings
          </button>
          <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${activeTab === 'fbm' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('fbm')}
            disabled={loading}
          >
            IMB Gateway
          </button>
          {/* <button
            className={`px-6 py-3 -mb-px font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${activeTab === 'xtreem' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('xtreem')}
            disabled={loading}
          >
            Xtreem Gateway
          </button> */}
        </div>

        {/* UPI Settings Tab */}
        {activeTab === 'upi' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">UPI Payment Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* UPI Fields - same as before */}
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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

            <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Discount Amount Settings</h3>
              <p className="text-gray-600 mb-4">Set discount amounts for different percentage values:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {fbmData.discountAmounts.map((discount, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {discount.percentage}% Discount Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={discount.amount}
                      onChange={(e) => handleDiscountAmountChange(index, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount for {discount.percentage}% discount
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleFbmUpdate}
                className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update IMB"}
              </button>
            </div>
          </div>
        )}

        {/* {activeTab === 'xtreem' && (
          <XtreemGateway />
        )} */}

      </div>
    </div>
  );
};

export default UPISettings;