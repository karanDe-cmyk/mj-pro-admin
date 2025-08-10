import React, { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';

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

const XtreemGateway = () => {

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });

    // Handle alert closure
    const handleAlertClose = () => {
        setAlert({ message: '', type: '' });
    };

    // Xtreem Gateway Data State
    const [xtreemData, setXtreemData] = useState({
        id: "",
        username: "",
        password: "",
        minAmount: "",
        maxAmount: "",
        status: "Inactive",
        showPassword: false,
    });

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                setFetchingData(true);

                // Fetch Xtreem gateway data
                const xtreemResponse = await axiosInstance.get(`/api/settings/xtreem/xtreemgateway`);
                const xtreemDataResponse = xtreemResponse.data.data[0];

                if (xtreemDataResponse) {
                    setXtreemData({
                        id: xtreemDataResponse._id || "",
                        username: xtreemDataResponse.username || "",
                        password: xtreemDataResponse.password || "",
                        minAmount: xtreemDataResponse.min_amount || "",
                        maxAmount: xtreemDataResponse.max_amount || "",
                        status: xtreemDataResponse.status || "Inactive",
                    });
                }
            } catch (error) {
                console.error("Error fetching settings data:", error);
                setAlert({ message: "Failed to fetch settings data", type: "error" });
            } finally {
                setFetchingData(false);
            }
        }
        fetchSettingsData();
    }, [])

    // Handle input change for Xtreem
    const handleXtreemChange = (e) => {
        const { name, value } = e.target;
        setXtreemData((prev) => ({ ...prev, [name]: value }));
    };


    // Handle Xtreem form submission
    const handleXtreemUpdate = async () => {
        const { username, password, minAmount, maxAmount } = xtreemData;

        if (!username || !password) {
            setAlert({ message: "Username, Password cannot be empty.", type: "error" });
            return;
        }

        if (isNaN(minAmount) || isNaN(maxAmount) || parseInt(minAmount) <= 0 || parseInt(maxAmount) <= 0 || parseInt(minAmount) >= parseInt(maxAmount)) {
            setAlert({ message: "Please enter valid amount limits. Minimum amount must be less than maximum amount.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                username: xtreemData.username,
                password: xtreemData.password,
                min_amount: parseInt(xtreemData.minAmount),
                max_amount: parseInt(xtreemData.maxAmount),
                status: xtreemData.status.toLowerCase(),
            };

            // Fetch the latest data to check for an existing ID
            const res = await axiosInstance.get('/api/settings/xtreem/xtreemgateway');
            const xtreemGateway = res.data.data[0];

            // If we have an ID, update existing. Otherwise create new.
            if (xtreemGateway?._id) {
                await axiosInstance.put(`/api/settings/xtreem/xtreemgateway/${xtreemGateway._id}`, payload);
            } else {
                await axiosInstance.post(`/api/settings/xtreem/xtreemgateway`, payload);
            }

            setAlert({ message: "Xtreem Gateway Settings Updated Successfully!", type: "success" });
        } catch (error) {
            console.error("Error updating Xtreem gateway data:", error);
            setAlert({ message: "Failed to update Xtreem gateway data", type: "error" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div>
                <AlertMessage message={alert.message} type={alert.type} onClose={handleAlertClose} />
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Xtreem Payment Gateway Settings</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={xtreemData.username}
                            onChange={handleXtreemChange}
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={xtreemData.showPassword ? "text" : "password"}
                                name="password"
                                value={xtreemData.password}
                                onChange={handleXtreemChange}
                                className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors pr-10"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setXtreemData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                disabled={loading}
                            >
                                {xtreemData.showPassword ? (
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Amount (₹)</label>
                        <input
                            type="number"
                            name="minAmount"
                            value={xtreemData.minAmount}
                            onChange={handleXtreemChange}
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Maximum Amount (₹)</label>
                        <input
                            type="number"
                            name="maxAmount"
                            value={xtreemData.maxAmount}
                            onChange={handleXtreemChange}
                            className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={xtreemData.status}
                            onChange={handleXtreemChange}
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
                        onClick={handleXtreemUpdate}
                        className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Xtreem"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default XtreemGateway;