import React from 'react'

const OfflinePaymentRecords = () => {
  const tableHeaders = [
    "Id",
    "Member Name",
    "Member Mobile",
    "Transaction Id",
    "Amount",
    "Date Time",
    "Status",
  ];

  const offlineRequests = []; // Empty data for now.

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl  mb-4 ">
          Offline Fund Records
        </h2>

        <div className="overflow-x-auto">
          {/* First Table */}
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offlineRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="border border-gray-300 p-4 text-center text-gray-500"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                offlineRequests.map((req, index) => (
                  <tr key={req.id}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{req.name}</td>
                    <td className="border border-gray-300 p-2">
                      {req.mobile}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {req.transactionId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {req.amount}
                    </td>
                    <td className="border border-gray-300 p-2">{req.time}</td>
                    <td className="border border-gray-300 p-2">{req.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Second Table */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offlineRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="border border-gray-300 p-4 text-center text-gray-500"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                offlineRequests.map((req, index) => (
                  <tr key={req.id}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{req.name}</td>
                    <td className="border border-gray-300 p-2">
                      {req.mobile}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {req.transactionId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {req.amount}
                    </td>
                    <td className="border border-gray-300 p-2">{req.time}</td>
                    <td className="border border-gray-300 p-2">{req.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-500">
            Showing 0 to 0 of 0 entries
          </span>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 text-gray-500 rounded-md bg-gray-100"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 text-gray-500 rounded-md bg-gray-100"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePaymentRecords