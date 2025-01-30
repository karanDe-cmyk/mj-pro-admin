import React, { useState, useEffect } from "react";
const FundRequest = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [fundRequests, setFundRequests] = useState([]);
    const rowsPerPage = 5;
  
    useEffect(() => {
      // Using dummy data for now
      const dummyData = [
        { id: 1, memberName: "King", memberMobile: "9785575373", transactionId: "67757e095369e", amount: 1000, dateTime: "2025-01-01 11:10" },
        { id: 2, memberName: "King", memberMobile: "9785575373", transactionId: "677520fe0acf5", amount: 1000, dateTime: "2025-01-01 04:33" },
        { id: 3, memberName: "King", memberMobile: "9785575373", transactionId: "67725f18f2bbb", amount: 1000, dateTime: "2024-12-30 02:21" },
        { id: 4, memberName: "King", memberMobile: "9785575373", transactionId: "67725f0e50af0", amount: 1000, dateTime: "2024-12-30 02:21" },
        { id: 5, memberName: "King", memberMobile: "9785575373", transactionId: "67725f050be61", amount: 1000, dateTime: "2024-12-30 02:21" },
        { id: 6, memberName: "John", memberMobile: "9876543210", transactionId: "12345abcd6789", amount: 1500, dateTime: "2025-01-02 10:00" },
      ];
  
      setFundRequests(dummyData);
    }, []);
  
    const filteredRequests = fundRequests.filter(
      (request) =>
        request.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.memberMobile?.includes(searchTerm) ||
        request.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const paginatedRequests = filteredRequests.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  
    const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  
    return (
      <div className="flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">Fund Request List</h2>
  
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Id</th>
                <th className="border border-gray-300 px-4 py-2">Member Name</th>
                <th className="border border-gray-300 px-4 py-2">Member Mobile</th>
                <th className="border border-gray-300 px-4 py-2">Transaction Id</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Date Time</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{request.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.memberName}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.memberMobile}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.transactionId}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.dateTime}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2">
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
  
          <span>
            Page {currentPage} of {totalPages}
          </span>
  
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  

export default FundRequest