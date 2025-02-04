import React, { useState, useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import axios from '../../utils/axiosInstance';  // import your custom Axios instance
import { appiD } from "../../utils/config";

const WithDrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state

  // Fetch withdrawal requests from the backend
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`/api/users/withdrawals/${appiD}`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    } finally {
      setLoading(false);  // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchRequests(); // Fetch requests when the component mounts
  }, []);

  // Approve a withdrawal request
  const handleApprove = async (id, userId) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this request?");
    if (confirmApprove) {
      try {
        const response = await axios.patch(`/api/users/withdrawals/status/3d88dae8-5904-40e9-b314-4906bc064bed/${id}`, { status: 'approved' });
        if (response.data) {
          // Update the request's status locally after approval
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === id ? { ...req, status: 'approved' } : req
            )
          );
        }
      } catch (error) {
        console.error("Error approving withdrawal:", error);
      }
    }
  };

  // Reject a withdrawal request
  const handleReject = async (id, userId) => {
    const confirmReject = window.confirm("Are you sure you want to reject this request?");
    if (confirmReject) {
      try {
        const response = await axios.patch(`/api/users/withdrawals/status/3d88dae8-5904-40e9-b314-4906bc064bed/${id}`, { status: 'rejected' });
        if (response.data) {
          // Update the request's status locally after rejection
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === id ? { ...req, status: 'rejected' } : req
            )
          );
        }
      } catch (error) {
        console.error("Error rejecting withdrawal:", error);
      }
    }
  };

  const handleView = (id) => {
    alert(`Viewing details for request ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Withdraw Request List</h2>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">Loading...</p>
            {/* You can also add a spinner here if you prefer */}
            <div className="mt-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
            </div>
          </div>
        ) : (
          // Table
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Member Name</th>
                  <th className="border p-2">Withdrawal Amount</th>
                  <th className="border p-2">Payment Method</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Time</th>
                  <th className="border p-2">View</th>
                  <th className="border p-2">Option</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={req._id} className="text-gray-800 hover:bg-gray-100">
                    {/* Sequence number */}
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-blue-500 hover:underline">{req.username}</td>
                    <td className="border p-2 text-center">{req.amount}</td>
                    <td className="border p-2 text-center">{req.payment_method}</td>
                    <td
                      className={`border p-2 text-center font-semibold ${
                        req.status === "approved"
                          ? "text-green-500"
                          : req.status === "rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </td>
                    <td className="border p-2 text-center">{req.time}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleView(req._id)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td className="border p-2 text-center">
                      {req.status === "approved" || req.status === "rejected" ? (
                        <span className="italic text-gray-500">Action Taken</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(req._id, req.userId)} 
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id, req.userId)} 
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithDrawRequest;