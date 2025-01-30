import React, { useState } from 'react'

const AllFundRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [requests, setRequests] = useState([
    { id: 1, name: "Bar", mobile: "1231231234", transactionId: "ORD4552", amount: 100, dateTime: "2025-01-21 18:38", status: "Accepted" },
    { id: 2, name: "Bar", mobile: "1231231234", transactionId: "ORD4033", amount: -1, dateTime: "2025-01-15 22:24", status: "Accepted" },
    { id: 3, name: "Bar", mobile: "1231231234", transactionId: "ORD736", amount: 1, dateTime: "2025-01-15 22:23", status: "Accepted" },
    { id: 4, name: "King", mobile: "9785575373", transactionId: "ORD1583", amount: 100, dateTime: "2025-01-02 21:06", status: "Accepted" },
    { id: 5, name: "King", mobile: "9785575373", transactionId: "67757e095369e", amount: 1000, dateTime: "2025-01-01 11:10", status: "Pending" },
    { id: 6, name: "King", mobile: "9785575373", transactionId: "677520fe0acf5", amount: 1000, dateTime: "2025-01-01 04:33", status: "Pending" },
  ]);

  const filteredRequests = requests.filter((req) =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.mobile.includes(searchTerm) ||
    req.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: "Cancelled" } : req
        )
      );
    }
  };

  const handleAccept = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: "Accepted" } : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-7xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">All Fund Request List</h2>

        {/* Search Input */}
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="search" className="text-gray-700 font-medium">Search:</label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-2">Id</th>
                <th className="border p-2">Member Name</th>
                <th className="border p-2">Member Mobile</th>
                <th className="border p-2">Transaction Id</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date Time</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="text-gray-800 hover:bg-gray-100">
                  <td className="border p-2 text-center">{req.id}</td>
                  <td className="border p-2 text-blue-500 hover:underline">{req.name}</td>
                  <td className="border p-2 text-center">{req.mobile}</td>
                  <td className="border p-2 text-center">{req.transactionId}</td>
                  <td className="border p-2 text-right">{req.amount}</td>
                  <td className="border p-2 text-center">{req.dateTime}</td>
                  <td className="border p-2 text-center">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleCancel(req.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-md text-white ${
                          req.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AllFundRequest