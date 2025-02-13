import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Import the axios instance
import { } from "../../utils/config"; // Use your API ID if needed

const DeclareResult = () => {
  const [date, setDate] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [panna, setPanna] = useState(""); // Panna field
  const [digit, setDigit] = useState(""); // Auto-calculated digit
  const [search, setSearch] = useState("");
  const [gameOptions, setGameOptions] = useState([]); // Game options
  const [bidHistoryData, setBidHistoryData] = useState([]); // Bid history
  const [loading, setLoading] = useState(false); // Loading for fetching winner list
  const [deletingBid, setDeletingBid] = useState(null); // Loading for deleting bid
  const [declaring, setDeclaring] = useState(false); // Loading for declaring result
  const [gameResultHistory, setGameResultHistory] = useState([]); // Game result history
  const [loadingGameResult, setLoadingGameResult] = useState(false); // Loading state for fetching game result history
  const [searchGameResult, setSearchGameResult] = useState(""); // Search state
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Entries per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  
  // Fetch game list
  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await axiosInstance.get(`/api/starline/getGameList`);
        const uniqueGameNames = new Set();
        if (Array.isArray(response.data.data)) {
          response.data.data.forEach((game) => {
            uniqueGameNames.add(game.game_name);
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

  // Fetch game result history
  useEffect(() => {
    const fetchGameResultHistory = async () => {
      setLoadingGameResult(true);
      try {
        const response = await axiosInstance.get(`/api/starline/game-result-history`);
        setGameResultHistory(response.data.data || []);
      } catch (error) {
        console.error("Error fetching game result history:", error);
      } finally {
        setLoadingGameResult(false);
      }
    };

    fetchGameResultHistory();
  }, []);


  // Fetch game result history
  useEffect(() => {
    const fetchGameResultHistory = async () => {
      setLoadingGameResult(true);
      try {
        const response = await axiosInstance.get(`/api/starline/game-result-history`);
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

  // Handle panna selection and auto-calculate digit
  const handlePannaChange = (e) => {
    const selectedPanna = e.target.value;
    setPanna(selectedPanna);

    if (selectedPanna.length === 3) {
      const sum = selectedPanna.split("").reduce((acc, num) => acc + parseInt(num, 10), 0);
      setDigit(sum % 10); // Get last digit
    } else {
      setDigit(""); // Reset digit if panna is invalid
    }
  };

  // Fetch bid history
  const handleDeclareResult = async () => {
    setLoading(true);
    try {
      const payload = { date: formatDate(date), gamename: selectedGame, panna, digit };
      const response = await axiosInstance.post(`/api/starlinebid/showWinnerList`, payload);
      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Declare result
  const handleSubmitResult = async () => {
    if (!date || !selectedGame || !panna || !digit) {
      alert("Please fill all fields before declaring the result.");
      return;
    }

    setDeclaring(true);
    try {
      const formattedDate = formatDate(date);

      // API call to declare the winner
      const response = await axiosInstance.post(
        `/api/starlinebid/declare-winners`,
        { date: formattedDate, gamename: selectedGame, panna, digit }
      );

      if (response.data.success) {
        alert("Result declared successfully");
      } else {
        // Check if the message indicates that the result is already declared
        if (response.data.message.includes("already declared")) {
          alert(response.data.message); // Show the exact error message
        } else {
          alert("Failed to declare result");
        }
      }
    } catch (error) {
      console.error("Error declaring result:", error);

      // Handle API error responses
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Error occurred while declaring result");
      }
    } finally {
      setDeclaring(false);
    }
  };


  const handleDeleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;

    setDeletingBid(bidId);
    try {
      const response = await axiosInstance.delete(`/api/starlinebid/deletebid/${bidId}`);

      if (response.data.status === "success") {
        setBidHistoryData((prevBids) => prevBids.filter((bid) => bid.bidId !== bidId));
        alert("Bid deleted successfully!");
      } else {
        alert("Failed to delete bid");
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      alert("Error occurred while deleting bid");
    } finally {
      setDeletingBid(null);
    }
  };
  const filteredGameResults = gameResultHistory.filter((result) =>
    result.market.toLowerCase().includes(searchGameResult.toLowerCase()) ||
    (result.panna && result.panna.toLowerCase().includes(searchGameResult.toLowerCase())) ||
    result.digit.toString().includes(searchGameResult) ||
    result.date.includes(searchGameResult)
  );

  const paginatedResults = filteredGameResults.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Declare Result</h2>

      <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Result Date</label>
          <input type="date" className="border px-3 py-2 rounded w-full sm:w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Game Name</label>
          <select className="border px-3 py-2 rounded w-full sm:w-auto" value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
            <option value="">- Please Select Game -</option>
            {gameOptions.map((game, index) => (
              <option key={index} value={game}>{game}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Panna</label>
          <select className="border px-3 py-2 rounded w-full sm:w-auto" value={panna} onChange={handlePannaChange}>
            <option value="">- Select Panna -</option>
            <option value="000">000</option>
            {Array.from({ length: 900 }, (_, i) => i + 100).map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Digit</label>
          <input type="text" className="border px-3 py-2 rounded w-full sm:w-auto bg-gray-100" value={digit} readOnly />
        </div>
      </div>

      {/* Show Winners & Declare Result Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button onClick={handleDeclareResult} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Loading..." : "Show Winners"}
        </button>
        <button onClick={handleSubmitResult} className="bg-green-500 text-white px-4 py-2 rounded">
          {declaring ? "Declaring..." : "Declare Result"}
        </button>
      </div>

      {/* Bid History Section */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">All Bid History</h3>
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
        <div className="overflow-x-auto">

          <table scroll={{ x: 1000 }} className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Sr No</th>
                <th className="py-2 px-4 border">Member Name</th>
                <th className="py-2 px-4 border">Game Type</th>
                <th className="py-2 px-4 border">Betting Amount</th>
                <th className="py-2 px-4 border">Betting Number</th>
                <th className="py-2 px-4 border">Winning Amount</th>
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
                    <td className="py-2 px-4 border">{bid.gametype}</td>
                    <td className="py-2 px-4 border">{bid.points}</td>
                    <td className="py-2 px-4 border">{bid.digit || bid.panna}</td>
                    <td className="py-2 px-4 border">{bid.winningAmount}</td>
                    <td className="py-2 px-4 border">{bid.time}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteBid(bid.bidId)}
                        className={`bg-red-500 text-white px-3 py-1 rounded ${deletingBid === bid.bidId ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={deletingBid === bid.bidId}
                      >
                        {deletingBid === bid.bidId ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Game Result History Section */}
      <div className="mt-6 overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Game Result History</h3>

        {/* Search and Entries Filter */}
        <div className="flex justify-between mb-4">
          <div>
            Show
            <select
              className="border px-2 py-1 mx-2 rounded"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing entries
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <input
            type="text"
            className="border px-3 py-2 rounded"
            placeholder="Search..."
            value={searchGameResult}
            onChange={(e) => setSearchGameResult(e.target.value)}
          />
        </div>

        {/* Table */}
        {loadingGameResult ? (
          <p className="text-center">Loading game results...</p>
        ) : (
          <>
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">S.No</th>
                  <th className="py-2 px-4 border">Game Name</th>
                  <th className="py-2 px-4 border">Panna</th>
                  <th className="py-2 px-4 border">Digit</th>
                  <th className="py-2 px-4 border">Total Winners</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No game results found.</td>
                  </tr>
                ) : (
                  paginatedResults.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4 border">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                      <td className="py-2 px-4 border">{result.market}</td>
                      <td className="py-2 px-4 border">{result.panna || "N/A"}</td>
                      <td className="py-2 px-4 border">{result.digit}</td>
                      <td className="py-2 px-4 border">{result.totalWinners}</td>
                      <td className="py-2 px-4 border">{result.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredGameResults.length > entriesPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(filteredGameResults.length / entriesPerPage)}</span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={currentPage === Math.ceil(filteredGameResults.length / entriesPerPage)}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredGameResults.length / entriesPerPage)))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>

  );
};

export default DeclareResult;
