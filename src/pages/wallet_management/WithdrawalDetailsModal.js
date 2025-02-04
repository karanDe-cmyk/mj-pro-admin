import React from "react";

const WithdrawalDetailsModal = ({ isOpen, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>

        {/* Modal Header */}
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
          Withdrawal Request Details
        </h3>

        {/* Details Table */}
        <div className="overflow-auto">
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="border px-4 py-2 font-medium">User Name</td>
                <td className="border px-4 py-2">{data?.userName || "N/A"}</td>
                <td className="border px-4 py-2 font-medium">Request Amount</td>
                <td className="border px-4 py-2">{data?.amount || "N/A"}</td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="border px-4 py-2 font-medium">Request Number</td>
                <td className="border px-4 py-2">{data?.requestNumber || "N/A"}</td>
                <td className="border px-4 py-2 font-medium">Payment Method</td>
                <td className="border px-4 py-2">{data?.paymentMethod || "N/A"}</td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="border px-4 py-2 font-medium">Request Date</td>
                <td className="border px-4 py-2">{data?.requestDate || "N/A"}</td>
                <td className="border px-4 py-2 font-medium">Payment Accept Date</td>
                <td className="border px-4 py-2">{data?.acceptDate || "N/A"}</td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td className="border px-4 py-2 font-medium">Payment Receipt</td>
                <td className="border px-4 py-2">
                  {data?.receipt ? (
                    <img
                      src={data.receipt}
                      alt="Payment Receipt"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border px-4 py-2 font-medium">Remark</td>
                <td className="border px-4 py-2">{data?.remark || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetailsModal;
