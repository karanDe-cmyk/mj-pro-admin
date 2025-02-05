import React, { useState, useEffect } from "react";
import { FaUser, FaGamepad, FaCoins } from "react-icons/fa";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";
import { Spin } from "antd";
const Dashboard = () => {
  const [totalBidAmount, setTotalBidAmount] = useState(0);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [totalProfitAmount, setTotalProfitAmount] = useState(0);
  // const [countDash, setCountDash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState(
    Array(10).fill({ totalBids: 0, bidAmount: 0 })
  );

  // Generate random colors
  const generateRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Simulate fetching dynamic bid data
    setBids(
      bids.map((_, i) => ({
        totalBids: Math.floor(Math.random() * 100),
        bidAmount: Math.floor(Math.random() * 1000),
      }))
    );
  }, []);
  useEffect(() => {
    const fetchData = () => {
      setTotalBidAmount(15000);
      setTotalWinAmount(50000);
      setTotalProfitAmount(5000);
    };

    fetchData();
  }, []);

  const [dashboardData, setDashboardData] = useState({
    users: 7,
    games: 17,
    unapprovedUsers: 2,
    approvedUsers: 5,
    mainMarketBidAmount: 0,
    starlineBidAmount: 0,
  });
  const [date, setDate] = useState("");
  const [gameName, setGameName] = useState();
  console.log(gameName, "gameName");
  const [marketTime, setMarketTime] = useState("");
  const [fundRequests, setFundRequests] = useState([
    {
      id: 1,
      username: "Bar - 1231231234",
      amount: 1000,
      txnId: "679a4cc9740dd",
      date: "2025-01-29 09:14",
      status: "Active",
    },
    {
      id: 2,
      username: "Bar - 1231231234",
      amount: 1000,
      txnId: "679a4cad243bc",
      date: "2025-01-29 09:13",
      status: "Active",
    },
    {
      id: 3,
      username: "Bar - 1231231234",
      amount: 1000,
      txnId: "679a4ca0dfe52",
      date: "2025-01-29 09:13",
      status: "Active",
    },
    {
      id: 4,
      username: "King - 9785575373",
      amount: 1000,
      txnId: "67757e095369e",
      date: "2025-01-01 11:10",
      status: "Active",
    },
  ]);

  useEffect(() => {
    // Simulating API call
    const fetchData = () => {
      const data = {
        users: 7,
        games: 17,
        unapprovedUsers: 2,
        approvedUsers: 5,
        mainMarketBidAmount: 0,
        starlineBidAmount: 0,
      };
      setDashboardData(data);
    };
    fetchData();
  }, []);
  const [count, setCount] = useState(null);
  //   console.log("count", count?.data);
  const fetchCount = async () => {
    try {
      const response = await instance.get(
        `${apiUrl}/api/count/ankCount/3d88dae8-5904-40e9-b314-4906bc064bed?gameName=${gameName}&market=${marketTime}`
      );
      if (response) {
        console.log("goodVibees", response?.data);
        setCount(response.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchCount();
  }, []);
  const [countDash, setCountDash] = useState(null);
  console.log("countDash.......", countDash?.data);
  const fetchCountDash = async () => {
    try {
      const response = await instance.get(
        `${apiUrl}/api/count/dashboardCounts/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response) {
        console.log("goodVibes", response);
        setCountDash(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    fetchCountDash();
  }, []);
  const [gameList, setGameList] = useState(null);
  console.log("gooVibesaaaaaaa", gameList?.data);
  const fetchGameList = async () => {
    try {
      const response = await instance.get(
        `${apiUrl}/api/gameRoutes/getGameList/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response) {
        console.log("goodVibeedsdsdds", response);
        setGameList(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchGameList();
  }, []);
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Left Sidebar */}
        <div className="w-1/2 md:w-1/3 lg:w-1/4 p-6 bg-white shadow h-screen">
          {/* Welcome Section */}
          <div className="bg-blue-100 p-7  rounded shadow h-fit">
            <h2 className="text-lg font-bold">Welcome Back!</h2>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
            <div className="mt-1 flex items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="Admin"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-bold">Admin</p>
                <p className="text-sm text-gray-600">
                  {countDash?.data.unapprovedUserCount} Unapproved Users
                </p>
                <p className="text-sm text-gray-600">
                  {countDash?.data.approvedUserCount} Approved Users
                </p>
              </div>
            </div>
          </div>

          {/* Market Bid Details */}
          {/* Below Market Bid Details */}

          <div className="mt-2 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Market Bid Details</h2>
            <form>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Game Name
              </label>
              <select
                value={count?.data?.gameCount}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select Games</option>
                {gameList?.data?.map((game, index) => (
                  <option key={index} value={game.name}>
                    {game.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>

            {/* New UI Section for Total Bid Amount and Total Profit Amount */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Total Bid Amount Box */}
              <div className="bg-white p-4 border border-gray-300 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bid Amount</p>
                  <h2 className="text-lg font-bold text-center">
                    Rs {totalBidAmount}
                  </h2>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  View
                </button>
              </div>

              {/* Total Profit Amount Box */}
              <div className="bg-white-100 p-4 border border-gray-300 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Win Amount</p>
                  <h2 className="text-lg font-bold text-center">
                    Rs {totalWinAmount}
                  </h2>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  View
                </button>
              </div>

              <div className="bg-green-100 p-4 border border-gray-300  text-center rounded shadow  ">
                <p className="text-sm  text-gray-600">
                  Total Profit Amount Rs.{totalProfitAmount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-3">
            <div className="p-6 bg-white shadow rounded flex items-center">
              <FaUser className="text-blue-500 text-2xl mr-4" />
              {loading ? (
                <Spin size="large" />
              ) : (
                <div>
                  <h4 className="font-bold text-sm">Users</h4>
                  <p>{countDash?.data?.totalUserCount}</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white shadow rounded flex items-center">
              <FaGamepad className="text-green-500 text-2xl mr-4" />
              {loading ? (
                <Spin size="large" />
              ) : (
                <div>
                  <h4 className="font-bold text-sm">Games</h4>
                  <p>{countDash?.data?.gameCount}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white shadow rounded flex items-center">
              <FaCoins className="text-yellow-500 text-2xl mr-4" />
              {loading ? (
                <Spin size="large" />
              ) : (
                <div>
                  <h4 className="font-bold text-sm">Main Market Bid Amount</h4>
                  <p>{countDash?.data?.totalBidRevenue}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white shadow rounded flex items-center">
              <FaCoins className="text-purple-500 text-2xl mr-4" />
              {loading ? (
                <Spin size="large" />
              ) : (
                <div>
                  <h4 className="font-bold text-sm">Starline Bid Amount</h4>
                  <p>{dashboardData.starlineBidAmount}</p>
                </div>
              )}
            </div>
          </div>
          <div className="grid  grid-cols-1 sm:grid-cols-1 gap-4 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">
              Total Bids on Single Ank of Date {date || "YYYY-MM-DD"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Game Name
                </label>
                <select
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                >
                  <option value="">Select Games</option>
                  {gameList?.data?.map((game, index) => (
                    <option key={index} value={game?.gameName}>
                      {game?.gameName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Market Time
                </label>
                <select
                  value={marketTime}
                  onChange={(e) => setMarketTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select Market Time</option>
                  <option value="open">Open</option>
                  <option value="close">Close</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
                  onClick={() => fetchCount()}
                >
                  Get
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {count?.data.map((bid, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-300 rounded shadow text-center flex flex-col justify-between h-full"
                >
                  {/* Total Bids */}
                  <div className=" font-semibold text-gray-900 mb-2 mt-2">
                    Total Bids: {bid.count}
                  </div>

                  {/* Bid Amount */}
                  <div className="text-2xl font-bold text-gray-900 my-2 md:text-4xl">
                    {bid.panna}
                  </div>

                  {/* Ank with Random Background Color - Full Width at Bottom */}
                  <div
                    className={`text-white  mt-4 w-full ${generateRandomColor()}`}
                  >
                    Ank {bid.digit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fund Request Auto Deposit History */}
        </div>
      </div>
      <div className="mt-2 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">
          Fund Request Auto Deposit History
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  User Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Txn ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {fundRequests.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.txnId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.date}
                  </td>
                  <td className="border flex grid-cols-1 border-gray-300 px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                      {request.status}
                    </button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;