import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from 'antd'; // Ant Design DatePicker
import 'antd/dist/reset.css'; // Ant Design CSS
import moment from 'moment'; // Required for DatePicker state and formatting

const DeclareResult = () => {
  // States for Declare Result section
  const [date, setDate] = useState(() => moment()); // Using moment object for state
  const [selectedGame, setSelectedGame] = useState("");
  const [panna, setPanna] = useState("");
  const [digit, setDigit] = useState("");
  const [search, setSearch] = useState("");
  const [gameOptions, setGameOptions] = useState([]);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingBid, setDeletingBid] = useState(null);
  const [declaring, setDeclaring] = useState(false);

  // States for Game Result History section
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [loadingGameResult, setLoadingGameResult] = useState(false);
  const [searchGameResult, setSearchGameResult] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [gameResultDate, setGameResultDate] = useState(() => moment()); // Using moment object for state
  const [deletingResultId, setDeletingResultId] = useState(null);


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
        }
        setGameOptions([...uniqueGameNames]);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };
    fetchGameList();
  }, []);

  // Fetch game result history with proper ID mapping
  const fetchGameResultHistory = async () => {
    setLoadingGameResult(true);
    try {
      const response = await axiosInstance.get(`/api/starline/game-result-history`);
      const formattedData = response.data.data.map(item => ({
        ...item,
        id: item._id || item.id
      }));
      setGameResultHistory(formattedData || []);
    } catch (error) {
      console.error("Error fetching game result history:", error);
    } finally {
      setLoadingGameResult(false);
    }
  };

  useEffect(() => {
    fetchGameResultHistory();
  }, []);

  // Format date using moment.js
  const formatDate = (momentObject) => {
    if (!momentObject || !moment.isMoment(momentObject)) return '';
    return momentObject.format("DD-MM-YYYY");
  };

  // Handle panna change
  const handlePannaChange = (e) => {
    const selectedPanna = e.target.value;
    setPanna(selectedPanna);
    if (selectedPanna.length === 3) {
      const sum = selectedPanna
        .split("")
        .reduce((acc, num) => acc + parseInt(num, 10), 0);
      setDigit(String(sum % 10));
    } else {
      setDigit("");
    }
  };

  // Show winners
  const handleDeclareResult = async () => {
    if (!date || !selectedGame || !panna) {
      toast.error("Please fill all required fields before showing winners.");
      return;
    }
    setLoading(true);
    try {
      const payload = { date: formatDate(date), gamename: selectedGame, panna, digit };
      const response = await axiosInstance.post(`/api/starlinebid/showWinnerList`, payload);
      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
      toast.error("Error fetching bid history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Declare result
  const handleSubmitResult = async () => {
    if (!date || !selectedGame || !panna || !digit) {
      toast.error("Please fill all fields before declaring the result.");
      return;
    }
    setDeclaring(true);
    try {
      const formattedDate = formatDate(date);
      const response = await axiosInstance.post(
        `/api/starlinebid/declare-winners`,
        { date: formattedDate, gamename: selectedGame, panna, digit: parseInt(digit) }
      );
      if (response.data.success) {
        toast.success("Result declared successfully");
        fetchGameResultHistory();
        setPanna("");
        setDigit("");
        setBidHistoryData([]);
      } else {
        if (response.data.message.includes("already declared")) {
          toast.error(response.data.message);
        } else {
          toast.error("Failed to declare result");
        }
      }
    } catch (error) {
      console.error("Error declaring result:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error occurred while declaring result");
      }
    } finally {
      setDeclaring(false);
    }
  };

  // Delete bid
  const handleDeleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;
    setDeletingBid(bidId);
    try {
      const response = await axiosInstance.delete(`/api/starlinebid/deletebid/${bidId}`);
      if (response.data.status === "success") {
        toast.success("Bid deleted successfully!");
        setBidHistoryData(prevData => prevData.filter(bid => bid.bidId !== bidId));
      } else {
        toast.error("Failed to delete bid");
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      toast.error("Error occurred while deleting bid");
    } finally {
      setDeletingBid(null);
    }
  };

  const handleDeleteGameResult = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this game result?")) return;
    setDeletingResultId(resultId);
    try {
      const response = await axiosInstance.delete(`/api/starline/delete-game-result/${resultId}`);
      if (response.data.success) {
        toast.success("Game result deleted successfully!");
        setGameResultHistory(prevResults =>
          prevResults.filter(result => result.id !== resultId)
        );
      } else {
        toast.error("Failed to delete game result");
      }
    } catch (error) {
      console.error("Error deleting game result:", error);
      toast.error("Error occurred while deleting game result");
    } finally {
      setDeletingResultId(null);
    }
  };


  // Filter game result history
  const formattedGameResultDate = formatDate(gameResultDate);
  const filteredGameResults = gameResultHistory.filter((result) =>
    result.date === formattedGameResultDate &&
    (
      result.market.toLowerCase().includes(searchGameResult.toLowerCase()) ||
      (result.panna && result.panna.toLowerCase().includes(searchGameResult.toLowerCase())) ||
      result.digit.toString().includes(searchGameResult) ||
      result.date.includes(searchGameResult)
    )
  );

  const paginatedResults = filteredGameResults.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="p-4 w-full min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">Declare Result</h2>
      <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Result Date</label>
          <DatePicker
            className="w-full sm:w-auto"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            format="YYYY-MM-DD"
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
              <option key={index} value={game}>{game}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Panna</label>
          <select
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={panna}
            onChange={handlePannaChange}
          >
            <option value="">- Select or Type Panna -</option>
            <option value="000">000</option>
            {Object.entries({
              0: ["127", "136", "145", "190", "235", "280", "370", "389", "460", "479", "569", "578", "118", "226", "244", "299", "334", "488", "668", "677", "550"],
              1: ["137", "128", "146", "236", "245", "290", "380", "470", "489", "560", "678", "579", "119", "155", "227", "335", "344", "399", "588", "669", "777", "100"],
              2: ["129", "138", "147", "156", "237", "246", "345", "390", "480", "570", "589", "679", "110", "228", "255", "336", "499", "660", "688", "778", "200", "444"],
              3: ["120", "139", "148", "157", "238", "247", "256", "346", "490", "580", "670", "689", "166", "229", "337", "355", "445", "599", "779", "788", "300", "111"],
              4: ["130", "149", "158", "167", "239", "248", "257", "347", "356", "590", "680", "789", "112", "220", "266", "338", "446", "455", "699", "770", "400", "888"],
              5: ["140", "159", "168", "230", "249", "258", "267", "348", "357", "456", "690", "780", "113", "122", "177", "339", "366", "447", "799", "889", "500", "555"],
              6: ["123", "150", "169", "178", "240", "259", "268", "349", "358", "367", "457", "790", "114", "277", "330", "448", "466", "556", "880", "899", "600", "222"],
              7: ["124", "160", "179", "250", "269", "278", "340", "359", "368", "458", "467", "890", "115", "133", "188", "223", "377", "449", "557", "566", "700", "999"],
              8: ["125", "134", "170", "189", "260", "279", "350", "369", "378", "459", "468", "567", "116", "224", "233", "288", "440", "477", "558", "990", "800", "666"],
              9: ["126", "135", "180", "234", "270", "289", "360", "379", "450", "469", "478", "568", "117", "144", "199", "225", "388", "559", "577", "667", "900", "333"],
            }).map(([digit, pannas]) => (
              <optgroup key={digit} label={`Digit ${digit}`}>
                {pannas.map(panna => (
                  <option key={panna} value={panna}>{panna}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="font-semibold block">Digit</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full sm:w-auto bg-gray-100"
            value={digit}
            readOnly
          />
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleDeclareResult}
          className="bg-[#EEA529] text-white px-6 py-2 w-1/2 rounded text-center"
          disabled={loading}
        >
          {loading ? "Loading..." : "Show Winners"}
        </button>
        <button
          onClick={handleSubmitResult}
          className="bg-[#556EE6] text-white px-6 py-2 w-1/2 rounded text-center"
          disabled={declaring || !date || !selectedGame || !panna || !digit}
        >
          {declaring ? "Declaring..." : "Declare Result"}
        </button>
      </div>
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Winning History</h3>
        <div className="flex justify-between mb-2">
          <div>
            Show
            <select
              className="border px-2 py-1 mx-2 rounded"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
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
                  <td colSpan="8" className="text-center py-4">No data available in table</td>
                </tr>
              ) : (
                bidHistoryData.map((bid, index) => (
                  <tr key={bid.bidId || index} className="border-b">
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
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Game Result History</h3>
        <div className="mb-4">
          <label className="font-semibold block mb-2">Select Game Result Date</label>
          <DatePicker
            className="w-full sm:w-auto"
            value={gameResultDate}
            onChange={(newDate) => {
              setGameResultDate(newDate);
              setCurrentPage(1);
            }}
            format="YYYY-MM-DD"
          />
        </div>
        <div className="flex justify-between mb-4">
          <div>
            Show
            <select
              className="border px-2 py-1 mx-2 rounded"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
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
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No game results found.</td>
                  </tr>
                ) : (
                  paginatedResults.map((result, index) => (
                    <tr key={result.id || index} className="border-b">
                      <td className="py-2 px-4 border">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="py-2 px-4 border">{result.market}</td>
                      <td className="py-2 px-4 border">{result.panna || "N/A"}</td>
                      <td className="py-2 px-4 border">{result.digit}</td>
                      <td className="py-2 px-4 border">{result.totalWinners}</td>
                      <td className="py-2 px-4 border">{result.date}</td>
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => handleDeleteGameResult(result.id)}
                          className={`bg-red-500 text-white px-3 py-1 rounded ${deletingResultId === result.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={deletingResultId === result.id}
                        >
                          {deletingResultId === result.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredGameResults.length > entriesPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredGameResults.length / entriesPerPage)}
                </span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={currentPage === Math.ceil(filteredGameResults.length / entriesPerPage)}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(filteredGameResults.length / entriesPerPage))
                    )
                  }
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