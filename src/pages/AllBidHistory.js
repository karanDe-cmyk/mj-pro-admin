import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Import your Axios instance


const AllBidHistory = () => {
  const [search, setSearch] = useState("");
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [gameNameList, setGameNameList] = useState([]);
  const [selectedGameName, setSelectedGameName] = useState("");



  
  useEffect(() => {
    if (selectedMarket) {
      fetchGameNames();
    }
  }, [selectedMarket]); // Fetch game names when market changes

  // ✅ Fetch Game Names Based on Market Selection
  const fetchGameNames = async () => {
    setGameNameList([]); // Clear previous game list
    setSelectedGameName(""); // Reset selected game

    if (!selectedMarket) return; // If no market is selected, do nothing

    try {
      let response;
      if (selectedMarket === "Starline") {
        response = await axiosInstance.get(`/api/starline/getGameList`);
        if (response.data && Array.isArray(response.data.data)) {
          setGameNameList(response.data.data.map((game) => game.game_name)); // Extract game names
        }
      } else if (selectedMarket === "Main Market") {
        response = await axiosInstance.get(
          `/api/marketManagement/getMarketGames`
        );
        if (response.data && Array.isArray(response.data)) {
          // Get only games related to the selected market
          const games = response.data
            .filter((item) => item.marketName === selectedMarket) // Filter by market name
            .map((item) => item.gameName); // Extract game names

          setGameNameList(games);
        }
      }
    } catch (error) {
      console.error("Failed to fetch game names:", error);
      setError("Failed to load game names.");
    }
  };

  // ✅ Fetch All Bid History (With Filters)
  // ✅ Fetch All Bid History (With Filters)
  const fetchBidHistory = async () => {
    setLoading(true);
    setError("");
    setBidHistoryData([]); // Reset previous data

    try {
      let response;
      let filteredData = [];

      if (selectedMarket === "Main Market" && selectedGameName) {
        // ✅ Prepare the request body for the POST API
        const requestBody = {
          ...(selectedDate && { date: selectedDate }),
          market: "Main Market",
          gameName: selectedGameName,
        };

        // ✅ Fetch Main Market Bids with filters
        response = await axiosInstance.post(`/api/bid/filterBids`, requestBody);

        // ✅ Check if data exists
        if (response.data.bids && response.data.bids.length > 0) {
          filteredData = response.data.bids;
        } else {
          setError("No data found for the selected filters.");
          return; // Stop execution, no need to set empty data
        }
      } else {
        // ✅ Fetch Starline Bids
        let queryParams = `/api/starlinebid/getallbid?`;
        if (selectedDate) queryParams += `date=${selectedDate}&`;
        if (selectedMarket) queryParams += `market=${selectedMarket}&`;
        if (selectedGameName) queryParams += `gamename=${selectedGameName}`;

        queryParams = queryParams.replace(/[?&]$/, ""); // Remove trailing "&" or "?"

        response = await axiosInstance.get(queryParams);

        // ✅ Check if data exists
        if (response.data && response.data.length > 0) {
          filteredData = response.data;
        } else {
          setError("No data found for the selected filters.");
          return; // Stop execution, no need to set empty data
        }
      }

      // ✅ Update state with filtered bid history
      setBidHistoryData(filteredData);
    } catch (err) {
      console.error("Error fetching bid history:", err);
      setError("Failed to load bid history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete Bid for Both "Main Market" & "Starline"
  const handleDeleteBid = async (bidId, market, bidObject) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;

    try {
        let deleteUrl = "";
        let requestConfig = {};

        if (market === "Main Market") {
            // ✅ Main Market requires a DELETE request with JSON body
            deleteUrl = `/api/bid/deleteBid/${bidObject._id}`;

            requestConfig = {
                data: { // ✅ Sending data in DELETE request
                    bidId: bidObject.bidId, // Get bidId from API response
                    id: bidObject._id, // Get _id from API response
                },
            };

            // console.log("Deleting Main Market Bid:", requestConfig.data);
            await axiosInstance.delete(deleteUrl, requestConfig);

        } else {
            // ✅ Starline requires a DELETE request with bidId in URL
            deleteUrl = `/api/starlinebid/deletebid/${bidId}`;
            // console.log("Deleting Starline Bid:", deleteUrl);
            await axiosInstance.delete(deleteUrl);
        }

        // ✅ Remove the deleted bid from state
        setBidHistoryData((prevBids) =>
            prevBids.filter((bid) => bid.bidId !== bidId)
        );

        alert("Bid deleted and amount refunded to user wallet");
    } catch (err) {
        console.error("Error deleting bid:", err);
        alert("Failed to delete bid. Please try again.");
    }
};

  return (
    <div className="mt-6 bg-white p-6 shadow-md rounded-lg mx-auto max-w-6xl">
      {/* Title Centered & Bigger */}
      <h3 className="text-2xl font-bold text-center mb-5">Bid History List</h3>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Select Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Date
          </label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Select Market */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Market
          </label>
          <select
            className="border px-3 py-2 rounded w-full"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="">Select Market</option>
            <option value="Main Market">Main Market</option>
            <option value="Starline">Starline</option>
          </select>
        </div>

        {/* Game Name (Dropdown) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            {selectedMarket === "Main Market" ? "Market Name" : "Game Name"}
          </label>
          <select
            className="border px-3 py-2 rounded w-full"
            value={selectedGameName}
            onChange={(e) => setSelectedGameName(e.target.value)}
            disabled={!selectedMarket} // Disable if no market selected
          >
            <option value="">
              Select {selectedMarket === "Main Market" ? "Market" : "Game Name"}
            </option>
            {gameNameList.length > 0 &&
              gameNameList.map((game, index) => (
                <option key={index} value={game}>
                  {game}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mb-6">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded"
          onClick={fetchBidHistory} // ✅ Calls the updated function
        >
          Submit
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Loading...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border">Sr No</th>
                <th className="py-3 px-4 border">Member Name</th>
                <th className="py-3 px-4 border">Market</th>{" "}
                {/* Added Market */}
                <th className="py-3 px-4 border">Game Name</th>{" "}
                {/* Added Game Name */}
                <th className="py-3 px-4 border">Betting Amount</th>
                <th className="py-3 px-4 border">Digit/Pana</th>
                <th className="py-3 px-4 border">Betting Time</th>
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {bidHistoryData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-600">
                    No data available in table
                  </td>
                </tr>
              ) : (
                bidHistoryData.map((bid, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 border">{index + 1}</td>
                    <td className="py-3 px-4 border">{bid.userName}</td>
                    <td className="py-3 px-4 border">{bid.market}</td>{" "}
                    {/* Display Market */}
                    <td className="py-3 px-4 border">
                      {bid.gamename || bid.gameName}
                    </td>{" "}
                    {/* Display Game Name */}
                    <td className="py-3 px-4 border">{bid.points}</td>
                    <td className="py-3 px-4 border">{bid.digit}</td>
                    <td className="py-3 px-4 border">{bid.time}</td>
                    <td className="py-3 px-4 border">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() =>
                          handleDeleteBid(bid.bidId, bid.market, bid)
                        } // ✅ Pass bid object dynamically
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBidHistory;
