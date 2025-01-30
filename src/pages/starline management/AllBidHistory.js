import React, { useState } from "react";
const AllBidHistory = () => {

      const [search, setSearch] = useState("");
    
   
      const bidHistoryData = [];
    
  return (
     
    <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
    <h3 className="text-lg font-semibold mb-3">Bid History List</h3>
    <div className="flex justify-between mb-2">
      <div>
        Show 
        <select className="border px-2 py-1 mx-2 rounded">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select> 
        entries
      </div>
      <input 
        type="text" 
        className="border px-3 py-2 rounded" 
        placeholder="Search..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border">Sr No</th>
          <th className="py-2 px-4 border">Member Name</th>
          <th className="py-2 px-4 border">Betting Amount</th>
          <th className="py-2 px-4 border">Betting Number</th>
          <th className="py-2 px-4 border">Betting Time</th>
          <th className="py-2 px-4 border">Starline Bet Time</th>
        </tr>
      </thead>
      <tbody>
        {bidHistoryData.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center py-4">No data available in table</td>
          </tr>
        ) : (
          bidHistoryData.map((bid, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 border">{index + 1}</td>
              <td className="py-2 px-4 border">{bid.memberName}</td>
              <td className="py-2 px-4 border">{bid.bettingAmount}</td>
              <td className="py-2 px-4 border">{bid.bettingNumber}</td>
              <td className="py-2 px-4 border">{bid.bettingTime}</td>
              <td className="py-2 px-4 border">
                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    <div className="flex justify-between mt-4">
      <span>Showing 0 to 0 of 0 entries</span>
      <div>
        <button className="px-3 py-1 border rounded-l bg-gray-300">Previous</button>
        <button className="px-3 py-1 border rounded-r bg-gray-300">Next</button>
      </div>
    </div>
  </div>
  )
}

export default AllBidHistory