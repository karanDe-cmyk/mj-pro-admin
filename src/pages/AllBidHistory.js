import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Pagination } from "antd";

// Custom Alert component
const AlertMessage = ({ message, type, onClose }) => {
  if (!message) return null;

  let bgColor, borderColor, textColor;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      borderColor = 'border-green-400';
      textColor = 'text-green-700';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-400';
      textColor = 'text-red-700';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-100';
      borderColor = 'border-blue-400';
      textColor = 'text-blue-700';
      break;
  }

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md border-l-4 shadow-lg z-50 ${bgColor} ${borderColor} ${textColor}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <p className="font-bold">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</p>
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} opacity-50 hover:opacity-100`}
        >
          <svg className="h-4 w-4" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 0 1 1.697 1.697L11.697 10l2.652 2.651a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
};

// Custom Confirmation Modal component
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


const AllBidHistory = () => {
  const [search, setSearch] = useState("");
  const [gameTypeSearch, setGameTypeSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidStatusFilter, setBidStatusFilter] = useState("all");

  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, onCancel: null });

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [gameNameList, setGameNameList] = useState([]);
  const [selectedGameName, setSelectedGameName] = useState("");
  const [selectedGameType, setSelectedGameType] = useState("");

  const gameTypeList = [
    "singleDigits", "jodi", "halfSangamA", "singlePana", "singlePanaBulk",
    "doublePanaBulk", "fullSangam", "digitBasedJodi", "redBracket", "groupJodi",
    "spMotor", "dpBoss", "twoDigitsPane", "spDpTp", "panelGroup", "oddEven",
    "twoDigitsPanel", "triplePana"
  ];

  const gameTypeDisplayNames = {
    "singleDigits": "Single Digit",
    "jodi": "Jodi",
    "halfSangamA": "Half Sangam A",
    "singlePana": "Single Pana",
    "singlePanaBulk": "Single Pana Bulk",
    "doublePanaBulk": "Double Pana Bulk",
    "fullSangam": "Full Sangam",
    "digitBasedJodi": "Digit Based Jodi",
    "redBracket": "Red Bracket",
    "groupJodi": "Group Jodi",
    "spMotor": "SP Motor",
    "dpBoss": "DP Boss",
    "twoDigitsPane": "Two Digits Pane",
    "spDpTp": "SP DP TP",
    "panelGroup": "Panel Group",
    "oddEven": "Odd Even",
    "twoDigitsPanel": "Two Digits Panel",
    "triplePana": "Triple Pana"
  };

  const handleAlertClose = () => setAlert({ message: '', type: '' });

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
      setAlert({ message: "Failed to load game names.", type: "error" });
    }
  };

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
          ...(selectedGameType && { gameType: selectedGameType }),
        });
        filteredData = response.data?.bids || [];
      } else {
        let queryParams = `/api/starlinebid/getallbid?`;
        if (selectedDate) queryParams += `date=${encodeURIComponent(selectedDate)}&`;
        if (selectedMarket) queryParams += `market=${encodeURIComponent(selectedMarket)}&`;
        if (selectedGameName) queryParams += `gamename=${encodeURIComponent(selectedGameName)}&`;
        if (selectedGameType) queryParams += `gameType=${encodeURIComponent(selectedGameType)}&`;
        queryParams = queryParams.replace(/[?&]$/, "");

        response = await axiosInstance.get(queryParams);
        filteredData = response.data || [];
      }
      setBidHistoryData(filteredData);
    } catch (err) {
      setAlert({ message: "Failed to load bid history.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedMarket) {
      fetchBidHistory();
    }
  }, [selectedDate, selectedMarket, selectedGameName, selectedGameType]);

  const handleDeleteBid = (bidId, market, bidObject) => {
    setModal({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this bid?",
      onConfirm: async () => {
        setModal({ ...modal, isOpen: false });
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
          setAlert({ message: "Bid deleted successfully.", type: "success" });
        } catch (err) {
          setAlert({ message: "Failed to delete bid.", type: "error" });
        }
      },
      onCancel: () => setModal({ ...modal, isOpen: false }),
    });
  };

  // Helper function to get the correct game type for grouping in WhatsApp message
  const getWhatsAppGameType = (bid) => {
    // Group all jodi-related types under a single "jodi" category
    if (['jodi', 'digitBasedJodi', 'groupJodi'].includes(bid.gameType)) {
      return 'jodi';
    }
    // Group SP Motor with Single Pana
    if (bid.gameType === 'spMotor') {
      return 'singlePana';
    }
    // Group DP Motor and DP Boss with Double Pana
    if (bid.gameType === 'dpMotor' || bid.gameType === 'dpBoss') {
      return 'doublePana';
    }
    // Group SP DP TP based on digit length
    if (bid.gameType === 'spDpTp') {
      const digitLength = bid.digit.toString().length;
      if (digitLength === 3) return 'singlePana';
      if (digitLength === 4) return 'doublePana';
      if (digitLength === 5) return 'triplePana';
    }
    return bid.gameType;
  };

  const handleShareOnWhatsApp = () => {
    // Filter by search, game type search, and status
    const dataToShare = bidHistoryData.filter((bid) =>
      !bid.reverted &&
      Object.values(bid).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      ) &&
      (!gameTypeSearch || bid.gameType?.toLowerCase().includes(gameTypeSearch.toLowerCase())) &&
      (bidStatusFilter === "all" ||
       (bidStatusFilter === "open" && bid.open === true) ||
       (bidStatusFilter === "close" && bid.close === true))
    );

    const validBids = dataToShare.filter((bid) =>
      bid?.gameType && bid?.digit && !isNaN(Number(bid?.points))
    );

    if (validBids.length === 0) {
      setAlert({ message: "No valid betting data to share!", type: "info" });
      return;
    }

    // Group bids by the custom game type
    const groupedBids = validBids.reduce((acc, bid) => {
      const type = getWhatsAppGameType(bid);
      if (!acc[type]) acc[type] = [];
      acc[type].push({
        digit: bid.digit.toString().trim(),
        points: parseInt(bid.points) || 0,
        status: bid.open ? 'OPEN' : bid.close ? 'CLOSE' : 'UNKNOWN'
      });
      return acc;
    }, {});

    // Calculate total amount for each group
    const gameTypeTotals = {};
    for (const gameType in groupedBids) {
      gameTypeTotals[gameType] = groupedBids[gameType].reduce((sum, bid) => sum + bid.points, 0);
    }
    
    // Sort and format the message
    const displayOrder = gameTypeList.filter((type) => groupedBids[type]);
    const marketGameName = selectedGameName || selectedMarket || "Market";
    const statusText = bidStatusFilter === "all" ? "" : `(${bidStatusFilter.toUpperCase()})`;

    let message = `*${marketGameName} ${statusText}*\n`;
    message += `Date and Time: ${new Date().toLocaleString()}\n`;
    message += `${"_".repeat(35)}\n\n`;

    let grandTotal = 0;
    displayOrder.forEach((gameType) => {
      grandTotal += gameTypeTotals[gameType];
      message += `*${gameTypeDisplayNames[gameType] || gameType}*\n`;
      message += `Total Amount: ${gameTypeTotals[gameType]}Rs\n`;

      groupedBids[gameType].forEach((bid) => {
        message += `${bid.digit} - ${bid.points}\n`;
      });
      message += `\n`;
    });
    
    message += `${"_".repeat(35)}\n`;
    message += `*Total Amount: ${grandTotal}Rs*\n`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filteredData = bidHistoryData.filter((bid) =>
    !bid.reverted &&
    Object.values(bid).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    ) &&
    (!gameTypeSearch || bid.gameType?.toLowerCase().includes(gameTypeSearch.toLowerCase())) &&
    (bidStatusFilter === "all" ||
      (bidStatusFilter === "open" && bid.open === true) ||
      (bidStatusFilter === "close" && bid.close === true))
  );

  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const totalBettingAmount = filteredData.reduce((sum, bid) => sum + Number(bid.points || 0), 0);

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen font-sans flex flex-col items-center">
      <AlertMessage message={alert.message} type={alert.type} onClose={handleAlertClose} />
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />

      {loading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="mt-6 bg-white p-6 shadow-md rounded-lg mx-auto max-w-6xl w-full">
        <h3 className="text-2xl font-bold text-center mb-5 text-gray-800">Bid History List</h3>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="">Select Market</option>
            <option value="Main Market">Main Market</option>
            <option value="Starline">Starline</option>
          </select>

          <select
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
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

          <select
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
          >
            <option value="">Select Game Type</option>
            {gameTypeList.map((type, index) => (
              <option key={index} value={type}>
                {gameTypeDisplayNames[type] || type}
              </option>
            ))}
          </select>

          <div className="col-span-1 md:col-span-4 flex justify-center">
            <button
              className="bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
              onClick={fetchBidHistory}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Search Game Type..."
            value={gameTypeSearch}
            onChange={(e) => setGameTypeSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500 transition"
            value={bidStatusFilter}
            onChange={(e) => setBidStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open Only</option>
            <option value="close">Close Only</option>
          </select>

          <select
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/4 focus:ring-blue-500 focus:border-blue-500 transition"
            value={entries}
            onChange={(e) => {
              setEntries(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page on change
            }}
          >
            {[1000, 1500, 2000, 3000, 4000, 5000].map(option => (
              <option key={option} value={option}>{option} Entries</option>
            ))}
          </select>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-50 border-b">
            <div className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">
              Total Betting Amount: <span className="text-blue-600">{totalBettingAmount}</span>
            </div>
            {filteredData.length > 0 && (
              <button
                className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition flex items-center"
                onClick={handleShareOnWhatsApp}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.63c.545 1.486 1.66 2.975 1.855 3.175.193.198 2.744 2.69 6.735 3.63.198.05.396.05.545.05.149 0 .347 0 .545-.05.198-.05.347-.248.248-.545-.05-.198-.396-1.139-1.436-2.329-.396-.446-.842-.843-1.04-.992-.198-.15-.347-.124-.446-.075-.099.05-.421.248-.991.545-.396.198-.843.298-1.29.15-1.387-.446-2.873-1.735-3.963-3.222-1.09-1.486-1.635-2.976-1.784-3.42-.15-.446-.05-.843.173-1.091.223-.248.595-.347.842-.347.149 0 .298 0 .446.05.149.05.298.1.347.248.446-.05.347-.545 1.637-.05 3.123" />
                </svg>
                Share as List
              </button>
            )}
          </div>

          <table className="min-w-full bg-white border text-center text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-xs">
                <th className="py-3 px-4 border">Sr No</th>
                <th className="py-3 px-4 border">Member Name</th>
                <th className="py-3 px-4 border">Market</th>
                <th className="py-3 px-4 border">Game Name</th>
                <th className="py-3 px-4 border">Game Type</th>
                <th className="py-3 px-4 border">Betting Amount</th>
                <th className="py-3 px-4 border">Digit/Pana</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Betting Time</th>
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((bid, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-4 py-2">{(currentPage - 1) * entries + index + 1}</td>
                    <td className="border px-4 py-2">{bid.userName}</td>
                    <td className="border px-4 py-2">{bid.market}</td>
                    <td className="border px-4 py-2">
                      {bid.gamename || bid.gameName}
                    </td>
                    <td className="border px-4 py-2">{gameTypeDisplayNames[bid.gameType] || bid.gameType}</td>
                    <td className="border px-4 py-2">{bid.points}</td>
                    <td className="border px-4 py-2">{bid.digit}</td>
                    <td className="border px-4 py-2">
                      {bid.open ? (
                        <span className="text-green-600 font-semibold">Open</span>
                      ) : bid.close ? (
                        <span className="text-red-600 font-semibold">Close</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-4 py-2">{bid.time}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 transition"
                        onClick={() => handleDeleteBid(bid.bidId, bid.market, bid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
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
    </div>
  );
};

export default AllBidHistory;