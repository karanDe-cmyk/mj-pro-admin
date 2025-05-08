import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggles for showing/hiding passwords
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axiosInstance.post("/api/settings/changepassword", {
        oldPassword,
        newPassword,
      });
      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const errMsg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Error updating password";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 overflow-x-hidden">
      <div className="w-full max-w-md px-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
          
          <form>
            {/* Old Password Field */}
            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700 font-medium mb-2">
                Old Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border-0 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="px-3 text-gray-600 focus:outline-none"
                >
                  {showOldPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19
                        c-4.477 0-8.268-2.943-9.542-7
                        a10.05 10.05 0 012.197-3.405
                        M9.88 9.88a3 3 0 104.242 4.242
                        M15 12a3 3 0 01-3 3
                        m0-3a3 3 0 00-3-3
                        m0 0L9.88 9.88
                        M12 12l1.121 1.121
                        M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0
                        3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5
                        12 5c4.477 0 8.268 2.943 9.542 7
                        -1.274 4.057-5.065 7-9.542 7
                        -4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 text-gray-700 focus:outline-none border-0 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="px-3 text-gray-600 focus:outline-none"
                >
                  {showNewPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19
                        c-4.477 0-8.268-2.943-9.542-7
                        a10.05 10.05 0 012.197-3.405
                        M9.88 9.88a3 3 0 104.242 4.242
                        M15 12a3 3 0 01-3 3
                        m0-3a3 3 0 00-3-3
                        m0 0L9.88 9.88
                        M12 12l1.121 1.121
                        M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0
                        3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5
                        12 5c4.477 0 8.268 2.943 9.542 7
                        -1.274 4.057-5.065 7-9.542 7
                        -4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md disabled:bg-gray-400"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>

          {/* Success / Error Messages */}
          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
