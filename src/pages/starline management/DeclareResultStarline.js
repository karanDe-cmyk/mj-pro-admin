import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Import the axios instance
import { appiD } from "../../utils/config"; // Use your API ID if needed

const DeclareResult = () => {
  const [date, setDate] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [digit, setDigit] = useState(""); // For storing the "digit" value
  const [search, setSearch] = useState("");
  const [gameOptions, setGameOptions] = useState([]); // For storing game options
  const [bidHistoryData, setBidHistoryData] = useState([]); // To store bid history data
  const [loading, setLoading] = useState(false); // Loading for fetching winner list
  const [deletingBid, setDeletingBid] = useState(null); // Loading state for each delete button (store bidId)
  const [declaring, setDeclaring] = useState(false); // Loading for declare result button
  const [gameResultHistory, setGameResultHistory] = useState([]); // Game result history data
  const [loadingGameResult, setLoadingGameResult] = useState(false); // Loading state for fetching game result history

  // Fetching game list using axios instance
  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await axiosInstance.get(`/api/starline/getGameList/${appiD}`); // API call to get game list
        const uniqueGameNames = new Set(); // To avoid duplicates
        if (Array.isArray(response.data.data)) {
          response.data.data.forEach((game) => {
            uniqueGameNames.add(game.game_name); // Add the game name to the set
          });
        } else {
          console.error("Expected an array at response.data.data");
        }
        setGameOptions([...uniqueGameNames]);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };

    fetchGameList();
  }, []);

  // Fetch game result history from API
  useEffect(() => {
    const fetchGameResultHistory = async () => {
      setLoadingGameResult(true);
      try {
        const response = await axiosInstance.get(`/api/starline/game-result-history/${appiD}`);
        setGameResultHistory(response.data.data || []);
      } catch (error) {
        console.error("Error fetching game result history:", error);
      } finally {
        setLoadingGameResult(false);
      }
    };

    fetchGameResultHistory();
  }, []);

  // Format date in "DD-MM-YYYY" format
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Function to fetch bid history after declaring result
  const handleDeclareResult = async () => {
    setLoading(true);
    try {
      const payload = { date: formatDate(date), market: selectedGame, digit };
      const response = await axiosInstance.post(`/api/starlinebid/showWinnerList/${appiD}`, payload);
      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a specific bid by bidId
  const handleDeleteBid = async (bidId) => {
    setDeletingBid(bidId);
    try {
      const response = await axiosInstance.delete(`/api/starlinebid/deletebid/${appiD}/${bidId}`);
      alert("Bid deleted successfully");
      handleDeclareResult(); // Refresh the bid history
    } catch (error) {
      console.error("Error deleting bid:", error);
    } finally {
      setDeletingBid(null);
    }
  };

  // Function to handle declaring the result
  const handleSubmitResult = async () => {
    if (!date || !selectedGame || !digit) {
      alert("Please fill all fields before declaring the result.");
      return;
    }

    setDeclaring(true); // Start loading state for declaring result
    try {
      const formattedDate = formatDate(date); // Format the date here

      // API call to declare the winner
      const response = await axiosInstance.post(
        `/api/starlinebid/declare-winners/${appiD}`,
        {
          date: formattedDate, // Send formatted date
          market: selectedGame,
          digit,
        }
      );

      if (response.data.success) {
        alert("Result declared successfully");
      } else {
        alert("Failed to declare result");
      }
    } catch (error) {
      console.error("Error declaring result:", error);
      alert("Error occurred while declaring result");
    } finally {
      setDeclaring(false); // End loading state after the API call
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Declare Result</h2>

      <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Result Date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Game Name</label>
          <select
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <option value="">- Please Select Game -</option>
            {gameOptions.map((game, index) => (
              <option key={index} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Digit</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full sm:w-auto"
            placeholder="Enter Digit"
            value={digit}
            onChange={(e) => setDigit(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleDeclareResult}
            className="bg-blue-500 mt-4 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Show Winner List"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmitResult}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {declaring ? "Declaring..." : "Declare Result"}
        </button>
      </div>

      {/* Bid History Section */}
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
            {bidHistoryData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data available in table
                </td>
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
                      onClick={() => handleDeleteBid(bid.bidId)}
                      className={`bg-red-500 text-white px-3 py-1 rounded ${deletingBid === bid.bidId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={deletingBid === bid.bidId}
                    >
                      {deletingBid === bid.bidId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Game Result History Section */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Game Result History</h3>
        {loadingGameResult ? (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        ) : gameResultHistory.length === 0 ? (
          <p className="text-center text-gray-600">No data available</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">S.No</th>
                <th className="py-2 px-4 border">Market</th>
                <th className="py-2 px-4 border">Panna</th>
                <th className="py-2 px-4 border">Total Winners</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {gameResultHistory.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{result.market}</td>
                  <td className="py-2 px-4 border">{result.panna || "N/A"}</td>
                  <td className="py-2 px-4 border">{result.totalWinners}</td>
                  <td className="py-2 px-4 border">{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeclareResult;
