import React, { useState, useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import axios from '../../utils/axiosInstance';
import WithdrawalDetailsModal from './WithdrawalDetailsModal'; // Import the modal component

const WithDrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected request details

  // Fetch withdrawal requests from the backend
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`/api/users/withdrawals`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(); // Fetch requests when the component mounts
  }, []);

  // Open modal with details of the selected request
  const handleView = (request) => {
    setSelectedRequest(request); // Set selected request data
    setModalOpen(true); // Open modal
  };

  // Approve a withdrawal request
  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this request?");
    if (confirmApprove) {
      try {
        const response = await axios.patch(`/api/users/withdrawals/status/${id}`, { status: 'approved' });
        if (response.data) {
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
  const handleReject = async (id) => {
    const confirmReject = window.confirm("Are you sure you want to reject this request?");
    if (confirmReject) {
      try {
        const response = await axios.patch(`/api/users/withdrawals/status/${id}`, { status: 'rejected' });
        if (response.data) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Withdraw Request List</h2>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">Loading...</p>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          </div>
        ) : (
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
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-blue-500 hover:underline">
                      <a
                        href={`/admin/user-management/user-details/${req.user_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {req.username}
                      </a>
                    </td>
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
                        onClick={() => handleView(req)}
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
                            onClick={() => handleApprove(req._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
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

      {/* Modal */}
      <WithdrawalDetailsModal
        isOpen={modalOpen}
        data={selectedRequest}
        onClose={() => setModalOpen(false)} // Close modal
      />
    </div>
  );
};

export default WithDrawRequest;
