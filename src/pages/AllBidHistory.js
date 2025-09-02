import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Pagination } from "antd";

// --- Helper functions to categorize panna ---
const isSinglePana = (digit) => {
  const s = digit.toString().split('').sort();
  return new Set(s).size === 3;
};

const isDoublePana = (digit) => {
  const s = digit.toString().split('').sort();
  // Check if exactly two digits are the same.
  return (s[0] === s[1] && s[1] !== s[2]) || (s[1] === s[2] && s[1] !== s[0]);
};

const isTriplePana = (digit) => {
  const s = digit.toString().split('');
  // Check if all three digits are the same.
  return new Set(s).size === 1;
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

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedMarket, setSelectedMarket] = useState("");
  const [gameNameList, setGameNameList] = useState([]);
  const [selectedGameName, setSelectedGameName] = useState("");
  const [selectedGameType, setSelectedGameType] = useState("");

  const gameTypeList = [
    "singleDigits",
    "singleDigitsBulk",
    "jodi",
    "jodiBulk",
    "halfSangamA",
    "halfSangamB",
    "singlePana",
    "singlePanaBulk",
    "doublePanaBulk",
    "fullSangam",
    "digitBasedJodi",
    "redBracket",
    "groupJodi",
    "spMotor",
    "dpMotor",
    "dpBoss",
    "twoDigitsPanel",
    "spDpTp",
    "panelGroup",
    "oddEven",
    "twoDigitsPanel",
  ];

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
        filteredData =
          response.data?.filter((item) => {
            const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
            return (
              (!selectedDate || itemDate === selectedDate) &&
              (!selectedMarket || item.market === selectedMarket) &&
              (!selectedGameName || item.gamename === selectedGameName) &&
              (!selectedGameType || item.gameType === selectedGameType)
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

  useEffect(() => {
    if (selectedDate) {
      fetchBidHistory();
    }
  }, [selectedDate, selectedGameType]);

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

  const handleShareOnWhatsApp = () => {
    // filteredData variable mein pehle se hi sahi data hai.
    // Ab hamein bas is data ko aage process karna hai.
    const validBids = filteredData.filter((bid) =>
      bid?.gameType && bid?.digit && !isNaN(Number(bid?.points))
    );

    if (validBids.length === 0) {
      alert("No valid betting data to share!");
      return;
    }

    // Group bids by their game type, with special handling for spDpTp
    const groupedBids = validBids.reduce((acc, bid) => {
      let type = bid.gameType.trim();

      // Special logic for spDpTp to categorize it
      if (type === "spDpTp") {
        if (isSinglePana(bid.digit)) {
          type = "Single Pana";
        } else if (isDoublePana(bid.digit)) {
          type = "Double Pana";
        } else if (isTriplePana(bid.digit)) {
          type = "Triple Pana";
        } else {
          type = "Other";
        }
      }

      if (!acc[type]) acc[type] = [];
      acc[type].push({
        digit: bid.digit.toString().trim(),
        points: parseInt(bid.points) || 0,
      });
      return acc;
    }, {});

    // Categorize game types
    const categories = {
      "Single Ank": ["singleDigits", "oddEven", "singleDigitsBulk"],
      "Jodi": ["jodi", "digitBasedJodi", "groupJodi", "redBracket", "jodiBulk"],
      "Single Pana": ["singlePana", "singlePanaBulk", "spMotor", "Single Pana"],
      "Double Pana": ["doublePanaBulk", "dpMotor", "doublePana", "Double Pana"],
      "Triple Pana": ["Triple Pana"],
      "Sangam": ["halfSangamA", "halfSangamB", "fullSangam"],
      "Panel Group": ["panelGroup", "twoDigitsPanel", "twoDigitsPanel"],
      "Other": ["Other"]
    };

    // Calculate totals for each category
    const categoryTotals = {};
    Object.keys(categories).forEach(category => {
      categoryTotals[category] = 0;
      categories[category].forEach(gameType => {
        if (groupedBids[gameType]) {
          categoryTotals[category] += groupedBids[gameType].reduce(
            (sum, bid) => sum + bid.points, 0
          );
        }
      });
    });

    // Dynamic market/game name and status
    const marketGameName = selectedGameName || selectedMarket || "Market";
    const statusText = bidStatusFilter === "all" ? "" : ` ${bidStatusFilter.toUpperCase()}`;
    const dateText = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let message = `*${marketGameName}${statusText} ${dateText}*\n`;
    message += `Total Amount : ${validBids.reduce((sum, bid) => sum + (parseInt(bid.points) || 0), 0)}\n\n`;

    // Generate message for each category
    Object.keys(categories).forEach(category => {
      const categoryBids = {};
      let categoryTotal = 0;

      // Collect all bids for this category
      categories[category].forEach(gameType => {
        if (groupedBids[gameType]) {
          groupedBids[gameType].forEach(bid => {
            if (!categoryBids[bid.digit]) {
              categoryBids[bid.digit] = 0;
            }
            categoryBids[bid.digit] += bid.points;
            categoryTotal += bid.points;
          });
        }
      });

      // Only add category to message if it has bids
      if (categoryTotal > 0) {
        message += `*${category}*\n`;
        message += `Total Amount: ${categoryTotal}\n`;

        // For Single Ank, sort digits 0-9
        if (category === "Single Ank") {
          for (let i = 0; i <= 9; i++) {
            const digit = i.toString();
            if (categoryBids[digit]) {
              message += `${digit} - ${categoryBids[digit]}\n`;
            }
          }
        }
        // For Jodi, sort numerically
        else if (category === "Jodi") {
          Object.keys(categoryBids)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(digit => {
              message += `${digit} - ${categoryBids[digit]}\n`;
            });
        }
        // For other categories, just list all
        else {
          Object.keys(categoryBids).forEach(digit => {
            message += `${digit} - ${categoryBids[digit]}\n`;
          });
        }

        message += "\n";
      }
    });

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const jodiGameTypes = ["jodi", "digitBasedJodi", "groupJodi", "redBracket", "jodiBulk"];
  const filteredData = bidHistoryData.filter((bid) => {
    // Basic filtering conditions
    const matchesSearch = Object.values(bid).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    );
    const matchesGameTypeSearch = !gameTypeSearch || bid.gameType?.toLowerCase().includes(gameTypeSearch.toLowerCase());
    const matchesSelectedGameType = !selectedGameType || bid.gameType === selectedGameType;
    const isJodi = jodiGameTypes.includes(bid.gameType);

    // Status filter ke liye naya logic
    const matchesStatus =
      bidStatusFilter === "all" ||
      (bidStatusFilter === "open" && (bid.open || isJodi)) ||
      (bidStatusFilter === "close" && bid.close);

    return !bid.reverted && matchesSearch && matchesGameTypeSearch && matchesSelectedGameType && matchesStatus;
  });


  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  return (
    <div className="mt-6 bg-white p-6 shadow-md rounded-lg mx-auto max-w-6xl">
      <h3 className="text-2xl font-bold text-center mb-5">Bid History List</h3>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 justify-center">
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

        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedGameType}
          onChange={(e) => setSelectedGameType(e.target.value)}
        >
          <option value="">Select Game Type</option>
          {gameTypeList.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Button Centered */}
        <div className="col-span-1 md:col-span-4 flex justify-center">
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
          className="border px-3 py-2 rounded w-1/4"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          className="border px-3 py-2 rounded w-1/4"
          placeholder="Search Game Type..."
          value={gameTypeSearch}
          onChange={(e) => setGameTypeSearch(e.target.value)}
        />

        {/* New Status Filter */}
        <select
          className="border px-3 py-2 rounded w-1/4"
          value={bidStatusFilter}
          onChange={(e) => setBidStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open Only</option>
          <option value="close">Close Only</option>
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
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
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">
            Total Betting Amount:{" "}
            {filteredData.reduce((sum, bid) => sum + Number(bid.points || 0), 0)}
          </div>
          {filteredData.length > 0 && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
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

        <table className="min-w-full bg-white border text-center">
          <thead>
            <tr className="bg-gray-200">
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
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{bid.userName}</td>
                  <td className="border px-4 py-2">{bid.market}</td>
                  <td className="border px-4 py-2">
                    {bid.gamename || bid.gameName}
                  </td>
                  <td className="border px-4 py-2">{bid.gameType}</td>
                  <td className="border px-4 py-2">{bid.points}</td>
                  <td className="border px-4 py-2">{bid.digit}</td>
                  <td className="border px-4 py-2">
                    {bid.open ? (
                      <span className="text-green-600">Open</span>
                    ) : bid.close ? (
                      <span className="text-red-600">Close</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-4 py-2">{bid.time}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
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
  );
};

export default AllBidHistory;