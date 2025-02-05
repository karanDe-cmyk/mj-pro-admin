import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Import the axios instance
import { appiD } from "../../utils/config";

const BidHistory = () => {
  const [date, setDate] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [search, setSearch] = useState("");
  const [gameOptions, setGameOptions] = useState([]);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetching game list using axios instance
  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await axiosInstance.get(`/api/starline/getGameList/${appiD}`); // Using axios instance
        // console.log("Full Response Data:", response.data); // Log the full data to inspect
  
        const uniqueGameNames = new Set(); // To avoid duplicates
  
        // Loop through the 'data' array, not 'week_selection'
        if (Array.isArray(response.data.data)) {
          response.data.data.forEach((game) => {
            uniqueGameNames.add(game.game_name); // Add the main game_name to the set
          });
        } else {
          console.error("Expected an array at response.data.data");
        }
  
        // Convert the Set to an array and set it to state
        setGameOptions([...uniqueGameNames]);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };
  
    fetchGameList();
  }, []);

  // Handling the filter submit action
  const handleFilterSubmit = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      // Convert the date to the format "dd-MM-yyyy"
      const formattedDate = new Date(date);
      const formattedDateString = `${String(formattedDate.getDate()).padStart(2, "0")}-${String(formattedDate.getMonth() + 1).padStart(2, "0")}-${formattedDate.getFullYear()}`;
  
      const payload = { date: formattedDateString, market: selectedGame };
      const response = await axiosInstance.post(`api/starlinebid/showBidlistOfSingleMarket/${appiD}`, payload); // Using axios instance
      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Handling the delete bid functionality
  const handleDeleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;

    try {
      await axiosInstance.delete(`/api/starlinebid/deletbid/${appiD}/${bidId}`);

      // Update state to remove the deleted bid
      setBidHistoryData((prevBids) =>
        prevBids.filter((bid) => bid.bidId !== bidId)
      );
      alert("Bid deleted and amount refunded to user wallet");
    } catch (err) {
      alert("Failed to delete bid. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Bid History Report</h2>

      <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <input 
          type="date" 
          className="border px-3 py-2 rounded" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
        <select 
          className="border px-3 py-2 rounded" 
          value={selectedGame} 
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">- Please Select Game -</option>
          {gameOptions.map((game, index) => (
            <option key={index} value={game}>{game}</option>
          ))}
        </select>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          onClick={handleFilterSubmit}
        >
          Submit
        </button>
      </div>

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
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    <p className="text-xl text-gray-600">Loading...</p>
                  </div>
                </td>
              </tr>
            ) : bidHistoryData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No data available in table</td>
              </tr>
            ) : (
              bidHistoryData.map((bid, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{bid.userName}</td>
                  <td className="py-2 px-4 border">{bid.points}</td>
                  <td className="py-2 px-4 border">{bid.digit || bid.panna}</td>
                  <td className="py-2 px-4 border">{bid.time}</td>
                  <td className="py-2 px-4 border">
                    <button 
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteBid(bid.bidId)} // Pass bidId dynamically
                    >
                      Delete
                    </button>
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
    </div>
  );
};

export default BidHistory;
