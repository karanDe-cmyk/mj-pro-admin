import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [autoDepositHistory, setAutoDepositHistory] = useState([]);
  const [totalUsers, setTotalUsers] = useState({ totalUsers: 0 });
  const [approvedUsers, setApprovedUsers] = useState({ approvedUsers: 0 });
  const [unapprovedUsers, setUnApprovedUsers] = useState({
    unapprovedUsers: 0,
  });
  const [totalGames, setTotalGames] = useState({ totalGameCount: 0 });
  const [mainMarketGamesList, setMainMarketGamesList] = useState([]);
  const [mainMarketGamesListLeft, setMainMarketGamesListLeft] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [error, setError] = useState(null);
  const [dashboardData2, setDashboardData2] = useState({
    totalBidAmount: 0,
    totalWinAmount: 0,
    totalProfitAmount: 0,
  });
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const [selectedGame2, setSelectedGame2] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);
  const [betRates, setBetRates] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("");
  const [todayBidPlayer, setTodayBidPlayer] = useState(0)
  const [totalNotBidPlayer, setTodayNotBidPlayer] = useState(0);
  const [userStats, setUserStats] = useState({
    todayRegistrations: 0,
    todayRegisteredUsersWhoPlayedBid: 0,
    todayUsersWhoPlayedBid: 0,
    totalUsersWhoPlayedBid: 0
  });

  const [amountStats, setAmountStats] = useState({
    totalWalletBalance: 0,
    WithdrawalRequest: 0,
    approvedWithdrawalAmount: 0,
    manualWithdrawalAmount: 0,
    autoPaymentAmount: 0,
    manualdepositAmount: 0
  });

  const todayFormatted = dayjs().format("DD-MM-YYYY");
  const navigate = useNavigate();

  // Fix 1: Update function names and API endpoints
  const fetchTodayBidPlayer = async () => {
    try {
      const response = await instance.get('/api/auth/today-bid-player', {
        params: { date: selectedDate }
      })
      const count = response.data?.count
      setTodayBidPlayer(count)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTodayNotBidPlayer = async () => {
    try {
      const response = await instance.get('/api/auth/total-not-player', {
        params: { date: selectedDate }
      })
      const count = response.data?.count
      setTodayNotBidPlayer(count)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTodayBidPlayer();
    fetchTodayNotBidPlayer();
  }, [selectedDate]);

  // Handler for DatePicker changes
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
  };

  const fetchFinancerStats = async () => {
    try {
      const response = await instance.get(`/api/auth/dashboardStats?date=${selectedDate}`);
      const data = response.data?.data;
      if (data) {
        setAmountStats({
          totalWalletBalance: data.totalWalletBalance || 0,
          WithdrawalRequest: data.WithdrawalRequest || 0,
          approvedWithdrawalAmount: data.approvedWithdrawalAmount || 0,
          manualWithdrawalAmount: data.manualWithdrawalAmount || 0,
          autoPaymentAmount: data.autoPaymentAmount || 0,
          manualdepositAmount: data.manualdepositAmount || 0
        });

      } else {
        console.error("Error fetching financer stats:", data);
      }
    } catch (error) {
      console.error("Error fetching financer stats:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await instance.get(`/api/auth/getUserStats`, {
        params: { date: selectedDate }
      });
      const data = response.data;
      if (data.success) {
        setUserStats({
          todayRegistrations: data.todayRegistrations || 0,
          todayRegisteredUsersWhoPlayedBid: data.todayRegisteredUsersWhoPlayedBid || 0,
          todayUsersWhoPlayedBid: data.todayUsersWhoPlayedBid || 0,
          totalUsersWhoPlayedBid: data.totalUsersWhoPlayedBid || 0
        });
      } else {
        console.error("Error fetching user stats:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await instance.get(`/api/app/users`, {
        params: { date: selectedDate }
      });
      const data = response.data;
      if (data.totalUsers !== undefined) {
        setTotalUsers({ totalUsers: data.totalUsers });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Starline Bid Amount:", error);
    }
  };

  const fetchApprovedUsers = async () => {
    try {
      const response = await instance.get(`/api/app/users`, {
        params: { date: selectedDate }
      });
      const data = response.data;
      if (data.approvedUsers !== undefined) {
        setApprovedUsers({ approvedUsers: data.approvedUsers });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Starline Bid Amount:", error);
    }
  };

  const fetchUnApprovedUsers = async () => {
    try {
      const response = await instance.get(`/api/app/users`, {
        params: { date: selectedDate }
      });
      const data = response.data;
      if (data.unapprovedUsers !== undefined) {
        setUnApprovedUsers({ unapprovedUsers: data.unapprovedUsers });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Starline Bid Amount:", error);
    }
  };

  const fetchDepositHistory = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/api/userPayment/getpaymentResponse`,
        { params: { date: selectedDate } }
      );
      const data = response.data?.data.filter((data) => {
        return data.method === 'Auto Deposit'
      })
      setAutoDepositHistory(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching deposit history:", err);
      setError("Failed to fetch deposit history. Please try again.");
      setLoading(false);
    }
  };

  const fetchTotalGames = async () => {
    try {
      const response = await instance.get(
        `/api/marketManagement/games/totalCount`,
        { params: { date: selectedDate } }
      );
      const data = response.data;
      if (data.totalGameCount !== undefined) {
        setTotalGames({ totalGameCount: data.totalGameCount });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching MainMarketData Bid Amount:", error);
    }
  };

  const fetchProfitLossData = async () => {
    try {
      setError(null);
      const response = await instance.get(`/api/users/total-profit-loss`, {
        params: { date: selectedDate }
      });

      if (response.data && response.data.success) {
        const totalDeposit = response.data.totalDeposit || 0;
        const totalWithdraw = response.data.totalWithdraw || 0;
        const total = totalDeposit - totalWithdraw;
      } else {
        setError("Error: Could not fetch profit/loss data.");
      }
    } catch (err) {
      console.error("Error fetching profit/loss data:", err);
      setError("Error fetching profit/loss data");
    }
  };

  // Refresh all data when date changes
  useEffect(() => {
    fetchAllData();
  }, [selectedDate]);

  const fetchAllData = () => {
    fetchUserStats();
    fetchFinancerStats();
    fetchTotalUsers();
    fetchApprovedUsers();
    fetchUnApprovedUsers();
    fetchDepositHistory();
    fetchTotalGames();
    fetchProfitLossData();
  };

  // Handler for game selection in Market Bid Details
  const handleGameChange2 = (e) => {
    setSelectedGame2(e.target.value);
  };

  // Submit handler that calls the API directly for Market Bid Details
  useEffect(() => {
    if (!selectedDate) return;

    const fetchTotalWinnings = async () => {
      try {
        setLoadingButton(true);

        const response = await instance.get(
          `/api/mainmarketdeclareResult/get-total-winnings`,
          {
            params: { date: selectedDate }
          }
        );

        const {
          totalBidAmount,
          totalWinningAmount,
          totalProfitAmount
        } = response.data;

        setDashboardData2({
          totalBidAmount,
          totalWinAmount: totalWinningAmount,
          totalProfitAmount
        });

      } catch (error) {
        console.error("Error fetching total winnings:", error);
        // alert("Error fetching total winnings");
      } finally {
        setLoadingButton(false);
      }
    };

    fetchTotalWinnings();
  }, [selectedDate]);


  const handleGameChange = (e) => {
    setSelectedGame(e.target.value);
  };

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
  };

  const handleGameTypeChange = (e) => {
    setSelectedGameType(e.target.value);
  };

  const handleGetClick = async () => {
    if (!selectedGame || !selectedSession) {
      alert("Please select a game name and session");
      return;
    }

    let openFlag = false;
    let closeFlag = false;
    if (selectedSession === "open") {
      openFlag = true;
      closeFlag = false;
    } else if (selectedSession === "close") {
      openFlag = false;
      closeFlag = true;
    }

    const body = {
      gameName: selectedGame,
      open: openFlag,
      close: closeFlag,
      date: selectedDate, // Add date parameter
      ...(selectedGameType && { gameType: selectedGameType }),
    };

    try {
      setLoadingButton2(true);
      const response = await instance.post(`/api/bid/todayDigitSummary`, body);

      if (response.data && response.data.data) {
        setDashboardData(response.data.data);
      } else {
        alert("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching bid summary:", error);
      alert("Error fetching bid summary");
    } finally {
      setLoadingButton2(false);
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoadingButton2(true);
        const response = await instance.get(
          `/api/marketManagement/getMarketGames`,
          { params: { date: selectedDate } }
        );
        if (Array.isArray(response.data)) {
          const filteredGames = response.data.filter(
            (game) => game.marketName === "Main Market"
          );
          setMainMarketGamesList(filteredGames);
          setMainMarketGamesListLeft(filteredGames);
        } else {
          console.error("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching market games:", error);
      } finally {
        setLoadingButton2(false);
      }
    };

    fetchGames();
  }, [selectedDate]);

  useEffect(() => {
    const fetchBetRates = async () => {
      try {
        setLoading(true);
        const response = await instance.get("api/rates/getBetRates", {
          params: { date: selectedDate }
        });

        if (response.data && typeof response.data === "object") {
          const { _id, createdAt, updatedAt, __v, ...filteredData } = response.data;

          const cleanedData = Object.keys(filteredData)
            .filter(key => !key.includes('Value'))
            .reduce((acc, key) => {
              acc[key] = filteredData[key];
              return acc;
            }, {});

          setBetRates(['All', ...Object.keys(cleanedData)]);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching bet rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBetRates();
  }, [selectedDate]);

  const mainMarketGames = mainMarketGamesList.filter(
    (game) => game.marketName === "Main Market"
  );

  const mainMarketGamesLeft = mainMarketGamesListLeft.filter(
    (game) => game.marketName === "Main Market"
  );


  const fundRequestColumns = [
    {
      header: "#",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      header: "Username",
      key: "username",
      render: (text, record) => (
        <span
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
          onClick={() => navigate(`/admin/user-management/user-details/${record.userId}`)}
        >
          {record.username}
        </span>
      ),
    },
    {
      header: "Mobile",
      key: "number",
    },
    {
      header: "Amount",
      key: "amount",
      render: (amount) => `₹ ${amount}`,
    },
    {
      header: "Txn ID",
      key: "txnId",
    },
    {
      header: "Payment Method",
      key: "method",
    },
    {
      header: "Status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm ${status === "Success" ? "bg-green-600" : "bg-red-600"
            }`}
        >
          {status}
        </span>
      ),
    },
    {
      header: "Payment Date & Time",
      key: "createdAt",
      render: (createdAt) =>
        moment(createdAt).format("DD-MM-YYYY hh:mm A"),
    },
  ];

  const renderTable = (columns, data) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Date Selector Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="font-bold text-gray-700">Select Date:</span>
          </div>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={dayjs(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD")}
            onChange={handleDateChange}
          />
          <button
            onClick={fetchAllData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
          <span className="text-sm text-gray-500">
            Selected: {selectedDate || "Today"}
          </span>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between bg-blue-300 py-3 px-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Back !
              </h2>
              <p className="text-gray-600">Admin Dashboard</p>
              <p className="text-sm text-gray-700 mt-1">
                Data for: {selectedDate || "Today"}
              </p>
            </div>
            <div>
              <img
                src="https://img.freepik.com/premium-vector/person-working-office-girl-typing-laptop-employee-prepares-documents-freelancer-carries-out_1002658-4158.jpg?ga=GA1.1.373082081.1766324369&semt=ais_hybrid&w=740&q=80"
                alt="Admin"
                className="h-48 w-96 rounded-full mx-auto"
              />
            </div>
          </div>

          <div className="flex flex-row mb-6">
            <div>
              <img
                src="https://img.icons8.com/?size=256w&id=110479&format=png"
                alt="Admin"
                className="w-24 h-24 rounded-full relative -top-12 left-6 border-4 border-white bg-white"
              />
              <h3 className="text-2xl ms-8 mt-0">Admin</h3>
            </div>

            <div className="flex flex-row mx-auto justify-around space-x-8 mt-4">
              <div
                className="cursor-pointer"
                onClick={() => navigate("/admin/user-management/approved")}
              >
                <p className="text-gray-700 text-xl">
                  Approved Users: {approvedUsers.approvedUsers ?? "Failed to fetch"}
                </p>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => navigate("/admin/user-management/unapproved")}
              >
                <p className="text-gray-700 text-xl">
                  Unapproved Users: {unapprovedUsers.unapprovedUsers ?? "Failed to fetch"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-4">
        {/* Users Card */}
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/user-management/approved")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Users</p>
              <p className="text-2xl font-bold mt-1">
                {totalUsers.totalUsers ?? "Failed to fetch"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        {/* Main Market Bid Card */}
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/today-register")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Today Registration</p>
              <p className="text-2xl font-bold mt-1">
                {userStats.todayRegistrations ?? "0"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 10a2 2 0 002-2v-4a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2h12z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Games Card */}
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/game-management/game-name")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Games</p>
              <p className="text-2xl font-bold mt-1">
                {totalGames.totalGameCount ?? "Failed to fetch"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Starline Bid Card */}
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/admin/today-bid-player?date=${selectedDate}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Players(Today)</p>
              <p className="text-2xl font-bold mt-1">
                {todayBidPlayer ?? "0"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.99a.995.995 0 01-1.022 0l-1.735-.99a1 1 0 01-.372-1.364z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/total-bet-player")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Total Bet Players</p>
              <p className="text-2xl font-bold mt-1">
                {userStats.totalUsersWhoPlayedBid ?? "0"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/today-register-player")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Today Registration Player</p>
              <p className="text-2xl font-bold mt-1">
                {userStats.todayRegisteredUsersWhoPlayedBid ?? "0"}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/admin/total-notbid-player?date=${selectedDate}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Total Not Bid Player</p>
              <p className="text-2xl font-bold mt-1">
                {totalNotBidPlayer}
              </p>
            </div>
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">
            Total Bids on Single Ank for Date {selectedDate || "Today"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleGameChange}
                value={selectedGame}
              >
                <option value="">Select Game Name</option>
                {mainMarketGames.map((game) => (
                  <option key={game._id} value={game.gameName}>
                    {game.gameName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleSessionChange}
                value={selectedSession}
              >
                <option value="">Select Session</option>
                <option value="open">Open</option>
                <option value="close">Close</option>
              </select>
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleGameTypeChange}
                value={selectedGameType}
              >
                <option value="">All</option>
                {betRates.map((gameType, index) => (
                  <option key={index} value={gameType}>
                    {gameType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={handleGetClick}
                disabled={loadingButton2}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingButton2 ? "Loading..." : "Get"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ank) => {
              const hue = 36 * ank;
              const color = `hsl(${hue}, 60%, 50%)`;
              const digitData = dashboardData[ank] || {
                totalUsers: 0,
                totalAmount: 0,
              };

              return (
                <div
                  key={ank}
                  className="border rounded-lg p-4 text-center shadow-sm"
                  style={{ borderColor: color }}
                >
                  <p className="text-sm text-gray-600">
                    Total Bids {digitData.totalUsers}
                  </p>
                  <h4 className="text-xl font-bold my-2">
                    {digitData.totalAmount}
                  </h4>
                  <p className="font-bold text-sm">Total Bid Amount</p>
                  <button
                    className="mt-3 text-white px-3 py-1 rounded text-sm w-full"
                    style={{ backgroundColor: color }}
                  >
                    Ank {ank}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Market Bid Details</h3>
          <div className="space-y-4">
            <div>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={dayjs(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD")}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleGameChange2}
                value={selectedGame2}
              >
                <option value="">Select Game Name</option>
                {mainMarketGamesLeft.map((game) => (
                  <option key={game._id} value={game.gameName}>
                    {game.gameName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                // onClick={handleSubmit}
                disabled={loadingButton}
                className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-3"
              >
                {loadingButton ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT COLUMN */}
            <div className="space-y-4">

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Bid Amount</span>
                  <span className="font-bold ml-auto">Rs {dashboardData2.totalBidAmount || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm" onClick={() => navigate('/admin/game-management/bit-history')}>
                    View
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Winning Amount</span>
                  <span className="font-bold ml-auto">Rs {dashboardData2.totalWinAmount || 0}</span>
                  <button
                    onClick={() => navigate("/admin/totalwinning-amount")}
                    className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border h-[72px] flex items-center
    ${dashboardData2.totalProfitAmount < 0
                    ? "bg-red-500 border-red-300"
                    : "bg-purple-50 border-purple-200"
                  }`}
              >
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Profit Amount</span>

                  <span
                    className={`font-bold ml-auto ${dashboardData2.totalProfitAmount < 0
                      ? "text-white"
                      : "text-green-600"
                      }`}
                  >
                    Rs {dashboardData2.totalProfitAmount || 0}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Wallet Balance</span>
                  <span className="font-bold ml-auto">
                    Rs {amountStats.totalWalletBalance || 0}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Withdraw Request</span>
                  <span className="font-bold ml-auto">Rs {amountStats.WithdrawalRequest || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm" onClick={() => navigate(`/admin/wallet-management/withdraw-request?date=${selectedDate}`)}>
                    View
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Deposit (Approved)</span>
                  <span className="font-bold ml-auto">Rs {(amountStats.autoPaymentAmount) || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm" onClick={() => navigate('/admin/auto-deposit-history')}>
                    View
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Add Fund (Manually)</span>
                  <span className="font-bold ml-auto">
                    Rs {amountStats.manualdepositAmount || 0}
                  </span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm" onClick={() => navigate(`/admin/wallet-management/all-deposit-by-admin?date=${selectedDate}`)}>
                    View
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Withdrawal</span>
                  <span className="font-bold ml-auto">
                    Rs {amountStats.approvedWithdrawalAmount || 0}
                  </span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm" onClick={() => navigate(`/admin/wallet-management/total-withdraw?date=${selectedDate}`)}>
                    View
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fund Request History */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">
          Fund Request History {selectedDate || todayFormatted}
        </h3>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : autoDepositHistory.length > 0 ? (
          renderTable(fundRequestColumns, autoDepositHistory)
        ) : (
          <p className="text-gray-500 text-center py-4">
            No records found for {selectedDate || "today"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;