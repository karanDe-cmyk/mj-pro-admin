import React, { useState } from "react";

const AutoDepositHistory = () => {
  const [data, setData] = useState([
    {
      id: 1,
      username: "John Doe",
      mobile: "9876543210",
      amount: 5000,
      txnId: "TXN12345",
      txnDate: "27-01-2025",
    },
    {
      id: 2,
      username: "Jane Smith",
      mobile: "9876500000",
      amount: 3500,
      txnId: "TXN54321",
      txnDate: "27-01-2025",
    },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        {/* Auto Deposit Form */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4">Auto Deposit</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-5">
              Submit
            </button>
          </div>
        </div>

        {/* Auto Deposit History Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Auto Deposit History</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2">
                Show
              </label>
              <select className="border border-gray-300 rounded-md p-2">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm font-medium text-gray-700 ml-2">
                entries
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Search:
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    User Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Mobile
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Txn ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Txn Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.username}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.mobile}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.amount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.txnId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.txnDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {data.length > 0 ? `1 to ${data.length}` : "0"} of{" "}
              {data.length} entries
            </p>
            <div className="flex gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDepositHistory;
