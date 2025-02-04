import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

const WithdrawalDetailsModal = ({ isOpen, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">Withdrawal Request Details</h3>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Name</td>
              <td className="border px-4 py-2">{data?.name || "N/A"}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Amount</td>
              <td className="border px-4 py-2">{data?.amount || "N/A"}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Payment Method</td>
              <td className="border px-4 py-2">{data?.paymentMethod || "N/A"}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Status</td>
              <td className="border px-4 py-2">{data?.status || "N/A"}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Time</td>
              <td className="border px-4 py-2">{data?.time || "N/A"}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const WithDrawRequest = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Bar",
      amount: 100,
      paymentMethod: "Bank Transfer",
      status: "approved",
      time: "2025-01-21 06:38:23 PM",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this request?");
    if (confirmApprove) {
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
      );
    }
  };

  const handleReject = (id) => {
    const confirmReject = window.confirm("Are you sure you want to reject this request?");
    if (confirmReject) {
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
      );
    }
  };

  const handleView = (id) => {
    const request = requests.find((req) => req.id === id);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Withdraw Request List</h2>

        {/* Table */}
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
              {requests.map((req) => (
                <tr key={req.id} className="text-gray-800 hover:bg-gray-100">
                  <td className="border p-2 text-center">{req.id}</td>
                  <td className="border p-2 text-blue-500 hover:underline">{req.name}</td>
                  <td className="border p-2 text-center">{req.amount}</td>
                  <td className="border p-2 text-center">{req.paymentMethod}</td>
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
                      onClick={() => handleView(req.id)}
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
                          onClick={() => handleApprove(req.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
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
      </div>

      {/* Modal */}
      <WithdrawalDetailsModal
        isOpen={isModalOpen}
        data={selectedRequest}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default WithDrawRequest;
