
import React, { useState } from 'react';
const WinningHistory = () => {
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const entriesPerPage = 10;

  // Dummy data for the winning history table
  const data = [
    { id: 1, txId: 'TX123', memberName: 'John Doe', memberNumber: '12345', gameName: 'Game 1', betNumber: '5', gameType: 'Type A', amount: '500' },
    { id: 2, txId: 'TX124', memberName: 'Jane Smith', memberNumber: '67890', gameName: 'Game 2', betNumber: '10', gameType: 'Type B', amount: '1000' },
    // Add more rows as needed...
  ];

  // Filtered and paginated data
  const filteredData = data.filter((item) =>
    item.memberName.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedData = filteredData.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected Date: ${date}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Winning History Report</h2>

      {/* Date Selection Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>


      <div className="bg-white shadow-md rounded-md p-4">
        <h3 className="text-lg font-semibold mb-4">Winning History List</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <label>Show</label>
            <select
              className="border border-gray-300 rounded-md p-2 ml-2"
              value={entriesPerPage}
              onChange={(e) => {
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">Id</th>
              <th className="border border-gray-300 p-2">Tx Id</th>
              <th className="border border-gray-300 p-2">Member Name</th>
              <th className="border border-gray-300 p-2">Member Number</th>
              <th className="border border-gray-300 p-2">Game Name</th>
              <th className="border border-gray-300 p-2">Bet Number</th>
              <th className="border border-gray-300 p-2">Game Type</th>
              <th className="border border-gray-300 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">{item.txId}</td>
                  <td className="border border-gray-300 p-2">{item.memberName}</td>
                  <td className="border border-gray-300 p-2">{item.memberNumber}</td>
                  <td className="border border-gray-300 p-2">{item.gameName}</td>
                  <td className="border border-gray-300 p-2">{item.betNumber}</td>
                  <td className="border border-gray-300 p-2">{item.gameType}</td>
                  <td className="border border-gray-300 p-2">{item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-300 p-2 text-center" colSpan="8">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(filteredData.length / entriesPerPage)}
          </span>
          <button
            className="bg-gray-300 px-4 py-2 rounded-md"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / entriesPerPage)))
            }
            disabled={page === Math.ceil(filteredData.length / entriesPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default WinningHistory