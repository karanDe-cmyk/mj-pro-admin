import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaWhatsapp, FaPhoneAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TodayRegisterUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchTodayUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/api/auth/today_register?status=true"
      );
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching today registered users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Today Registered Users
      </h2>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users registered today
          </div>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  Wallet Balance
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border font-medium">
                    {user.userName}
                  </td>
                  <td className="px-4 py-2 border">{user.phone}</td>
                  <td className="px-4 py-2 border">
                    ₹ {user.walletBalance}
                  </td>
                  <td className="px-4 py-2 border">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center gap-3">
                      {/* VIEW → USER DETAILS PAGE */}
                      <button
                        onClick={() =>
                          navigate(`/admin/user-management/user-details/${user._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="View Profile"
                      >
                        <FaEye size={18} />
                      </button>

                      {/* WHATSAPP */}
                      <a
                        href={`https://wa.me/91${user.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:text-green-800"
                        title="WhatsApp"
                      >
                        <FaWhatsapp size={18} />
                      </a>

                      {/* CALL */}
                      <a
                        href={`tel:${user.phone}`}
                        className="text-gray-700 hover:text-black"
                        title="Call"
                      >
                        <FaPhoneAlt size={16} />
                      </a>
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h3 className="text-lg font-bold mb-4">
              User Payment Details
            </h3>

            {/* UPI DETAILS */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">UPI Details</h4>
              <p className="text-sm">
                <b>Paytm:</b>{" "}
                {selectedUser.upi_id?.paytmUpi || "N/A"}
              </p>
              <p className="text-sm">
                <b>PhonePe:</b>{" "}
                {selectedUser.upi_id?.phonepeUpi || "N/A"}
              </p>
              <p className="text-sm">
                <b>GPay:</b>{" "}
                {selectedUser.upi_id?.gpayUpi || "N/A"}
              </p>
            </div>

            {/* BANK DETAILS */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Bank Details</h4>
              <p className="text-sm">
                <b>Account Holder:</b>{" "}
                {selectedUser.bank_details?.account_holder_name || "N/A"}
              </p>
              <p className="text-sm">
                <b>Account No:</b>{" "}
                {selectedUser.bank_details?.account_number || "N/A"}
              </p>
              <p className="text-sm">
                <b>IFSC:</b>{" "}
                {selectedUser.bank_details?.ifsc_code || "N/A"}
              </p>
              <p className="text-sm">
                <b>Bank:</b>{" "}
                {selectedUser.bank_details?.bank_name || "N/A"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayRegisterUsers;
