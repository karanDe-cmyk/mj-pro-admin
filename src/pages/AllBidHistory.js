import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Pagination } from "antd";

const AllBidHistory = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10); // Entries per page
  const [currentPage, setCurrentPage] = useState(1); // Pagination state

  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default selectedDate to current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedMarket, setSelectedMarket] = useState("");
  const [gameNameList, setGameNameList] = useState([]);
  const [selectedGameName, setSelectedGameName] = useState("");

  // Fetch game names whenever selectedMarket changes
  useEffect(() => {
    if (selectedMarket) {
      fetchGameNames();
    }
  }, [selectedMarket]);

  const fetchGameNames = async () => {
    setGameNameList([]);
    setSelectedGameName("");
    if (!selectedMarket) return;
    try {
      let response;
      if (selectedMarket === "Starline") {
        response = await axiosInstance.get(`/api/starline/getGameList`);
        setGameNameList(response.data?.data?.map((game) => game.game_name) || []);
      } else if (selectedMarket === "Main Market") {
        response = await axiosInstance.get(`/api/marketManagement/getMarketGames`);
        const games = response.data
          .filter((item) => item.marketName === selectedMarket)
          .map((item) => item.gameName);
        setGameNameList(games);
      }
    } catch (error) {
      setError("Failed to load game names.");
    }
  };

  // Fetch bid history; this function is also called when the selected date changes.
  const fetchBidHistory = async () => {
    setLoading(true);
    setError("");
    setBidHistoryData([]);
    try {
      let response;
      let filteredData = [];
      if (selectedMarket === "Main Market" && selectedGameName) {
        response = await axiosInstance.post(`/api/bid/filterBids`, {
          ...(selectedDate && { date: selectedDate }),
          market: "Main Market",
          gameName: selectedGameName,
        });
        filteredData = response.data?.bids || [];
      } else {
        let queryParams = `/api/starlinebid/getallbid?`;
        if (selectedDate) queryParams += `date=${encodeURIComponent(selectedDate)}&`;
        if (selectedMarket) queryParams += `market=${encodeURIComponent(selectedMarket)}&`;
        if (selectedGameName) queryParams += `gamename=${encodeURIComponent(selectedGameName)}&`;
        queryParams = queryParams.replace(/[?&]$/, "");

        response = await axiosInstance.get(queryParams);
        filteredData =
          response.data?.filter((item) => {
            const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
            return (
              (!selectedDate || itemDate === selectedDate) &&
              (!selectedMarket || item.market === selectedMarket) &&
              (!selectedGameName || item.gamename === selectedGameName)
            );
          }) || [];
      }
      setBidHistoryData(filteredData);
    } catch (err) {
      setError("Failed to load bid history.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch bid history whenever the selected date changes.
  useEffect(() => {
    if (selectedDate) {
      fetchBidHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDeleteBid = async (bidId, market, bidObject) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;
    try {
      let deleteUrl = "";
      if (market === "Main Market") {
        deleteUrl = `/api/bid/deleteBid/${bidObject._id}`;
        await axiosInstance.delete(deleteUrl, {
          data: { bidId: bidObject.bidId, id: bidObject._id },
        });
      } else {
        deleteUrl = `/api/starlinebid/deletebid/${bidId}`;
        await axiosInstance.delete(deleteUrl);
      }
      setBidHistoryData((prevBids) => prevBids.filter((bid) => bid.bidId !== bidId));
      alert("Bid deleted successfully.");
    } catch (err) {
      alert("Failed to delete bid.");
    }
  };

  // **Search & Pagination Logic**
  const filteredData = bidHistoryData.filter((bid) =>
    Object.values(bid).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice((currentPage - 1) * entries, currentPage * entries);

  return (
    <div className="mt-6 bg-white p-6 shadow-md rounded-lg mx-auto max-w-6xl">
      <h3 className="text-2xl font-bold text-center mb-5">Bid History List</h3>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 justify-center">
        <input
          type="date"
          className="border px-3 py-2 rounded w-full"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          <option value="">Select Market</option>
          <option value="Main Market">Main Market</option>
          <option value="Starline">Starline</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedGameName}
          onChange={(e) => setSelectedGameName(e.target.value)}
          disabled={!selectedMarket}
        >
          <option value="">
            Select {selectedMarket === "Main Market" ? "Market" : "Game Name"}
          </option>
          {gameNameList.map((game, index) => (
            <option key={index} value={game}>
              {game}
            </option>
          ))}
        </select>

        {/* Button Centered */}
        <div className="col-span-1 md:col-span-3 flex justify-center">
          <button
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
            onClick={fetchBidHistory}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={entries}
          onChange={(e) => setEntries(parseInt(e.target.value))}
        >
          <option value={5}>5 Entries</option>
          <option value={10}>10 Entries</option>
          <option value={20}>20 Entries</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Sr No</th>
              <th className="py-3 px-4 border">Member Name</th>
              <th className="py-3 px-4 border">Market</th>
              <th className="py-3 px-4 border">Game Name</th>
              <th className="py-3 px-4 border">Betting Amount</th>
              <th className="py-3 px-4 border">Digit/Pana</th>
              <th className="py-3 px-4 border">Betting Time</th>
              <th className="py-3 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((bid, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{bid.userName}</td>
                  <td className="border px-4 py-2">{bid.market}</td>
                  <td className="border px-4 py-2">
                    {bid.gamename || bid.gameName}
                  </td>
                  <td className="border px-4 py-2">{bid.points}</td>
                  <td className="border px-4 py-2">{bid.digit}</td>
                  <td className="border px-4 py-2">{bid.time}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleDeleteBid(bid.bidId, bid.market, bid)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-4 overflow-hidden">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={entries}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllBidHistory;
