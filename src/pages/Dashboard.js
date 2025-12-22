import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fundRequests, setFundRequests] = useState([]);
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
  const [loadingButton3, setLoadingButton3] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [betRates, setBetRates] = useState([]);
  const [selectedGameType, setSelectedGameType] = useState("");

  const [userStats, setUserStats] = useState({
    todayRegistrations: 0,
    todayRegisteredUsersWhoPlayedBid: 0,
    todayUsersWhoPlayedBid: 0,
    totalUsersWhoPlayedBid: 0
  });

  const [amountStats, setAmountStats] = useState({
    totalWalletBalance: 0,
    WithdrawalRequests: 0,
    approvedWithdrawalAmount: 0,
    manualWithdrawalAmount: 0,
    autoPaymentAmount: 0,
    manualdepositAmount: 0
  });

  const today = dayjs().format("YYYY-MM-DD");
  const todayFormatted = dayjs().format("DD-MM-YYYY");
  const navigate = useNavigate();

  const fetchFinancerStats = async () => {
    try {
      const response = await instance.get(`/api/auth/dashboardStats`);
      const data = response.data?.data;
      if (data) {
        setAmountStats({
          totalWalletBalance: data.totalWalletBalance || 0,
          withdrawalRequests: data.WithdrawalRequest || 0,
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
      const response = await instance.get(`/api/auth/getUserStats`);
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

  useEffect(() => {
    fetchUserStats();
    fetchFinancerStats();
  }, []);

  // Handler for DatePicker changes.
  const handleDateChange2 = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
  };

  // Handler for game selection.
  const handleGameChange2 = (e) => {
    setSelectedGame2(e.target.value);
  };

  // Submit handler that calls the API directly.
  const handleSubmit = async () => {
    if (!selectedDate || !selectedGame2) {
      alert("Please select both a date and a game name.");
      return;
    }
    try {
      setLoadingButton(true);
      const requestBody = {
        gameName: selectedGame2,
        date: selectedDate,
      };

      const response = await instance.post(
        `/api/mainmarketdeclareResult/get-total-winnings`,
        requestBody
      );

      const { totalPoints, totalWinningPoints } = response.data;
      const totalProfitAmount = totalPoints - totalWinningPoints;

      setDashboardData2({
        totalBidAmount: totalPoints,
        totalWinAmount: totalWinningPoints,
        totalProfitAmount,
      });
    } catch (error) {
      console.error("Error fetching total winnings:", error);
      alert("Error fetching total winnings");
    } finally {
      setLoadingButton(false);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await instance.get(`/api/app/users`);
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
      const response = await instance.get(`/api/app/users`);
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
      const response = await instance.get(`/api/app/users`);
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

  useEffect(() => {
    fetchTotalUsers();
    fetchApprovedUsers();
    fetchUnApprovedUsers();
  }, []);

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/api/userPayment/getpaymentResponse`
        );
        setAutoDepositHistory(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching deposit history:", err);
        setError("Failed to fetch deposit history. Please try again.");
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, []);

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
    if (!selectedGame || !selectedSession || !selectedGameType) {
      alert("Please select a game name, session, and game type");
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
      gameType: selectedGameType,
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
          `/api/marketManagement/getMarketGames`
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
  }, []);

  useEffect(() => {
    const fetchBetRates = async () => {
      try {
        setLoading(true);
        const response = await instance.get("api/rates/getBetRates");

        if (response.data && typeof response.data === "object") {
          const { _id, createdAt, updatedAt, __v, ...filteredData } = response.data;

          const cleanedData = Object.keys(filteredData)
            .filter(key => !key.includes('Value'))
            .reduce((acc, key) => {
              acc[key] = filteredData[key];
              return acc;
            }, {});

          setBetRates(Object.keys(cleanedData));
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
  }, []);


  const mainMarketGames = mainMarketGamesList.filter(
    (game) => game.marketName === "Main Market"
  );

  const mainMarketGamesLeft = mainMarketGamesListLeft.filter(
    (game) => game.marketName === "Main Market"
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get(`/api/admin/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      setLoading(false);
    };

    const fetchFundRequests = async () => {
      try {
        const response = await instance.get(`/api/admin/fundRequests`);
        setFundRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching fund requests:", error);
      }
    };

    fetchDashboardData();
    fetchFundRequests();
  }, []);

  const fetchTotalGames = async () => {
    try {
      const response = await instance.get(
        `/api/marketManagement/games/totalCount`
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

  useEffect(() => {
    fetchTotalGames();
  }, []);

  useEffect(() => {
    const fetchProfitLossData = async () => {
      try {
        setLoadingButton3(true);
        setError(null);
        const response = await instance.get(`/api/users/total-profit-loss`);

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
      } finally {
        setLoadingButton3(false);
      }
    };

    fetchProfitLossData();
  }, []);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      try {
        const response = await instance.get("/api/users/todaywithdrawals");
        const pendingWithdrawals = response.data.filter(
          (withdrawal) => withdrawal.status === "pending"
        );
        setWithdrawalHistory(pendingWithdrawals);
      } catch (err) {
        console.error("Error fetching withdrawal requests:", err);
        setError("Failed to fetch withdrawal requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await instance.patch(`api/users/withdrawals/status/${id}`, { status });
      setWithdrawalHistory(withdrawalHistory.filter((item) => item._id !== id));
      alert(`Withdrawal ${status} successfully!`);
    } catch (error) {
      console.error(`Error updating withdrawal status to ${status}:`, error);
      alert(`Failed to ${status} withdrawal.`);
    }
  };

  const withdrawalColumns = [
    {
      header: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      header: "Username",
      key: "username",
    },
    {
      header: "Amount",
      key: "amount",
    },
    {
      header: "Payment Method",
      key: "payment_method",
    },
    {
      header: "Status",
      key: "status",
      render: (status) =>
        status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      header: "Time",
      key: "time",
    },
    {
      header: "Action",
      key: "action",
      render: (text, record) => {
        if (record.status === "approved" || record.status === "rejected") {
          return <span className="font-bold">Action Taken</span>;
        }
        return (
          <>
            <button
              onClick={() => handleStatusChange(record._id, "approved")}
              className="mr-2 bg-blue-600 text-white border-none px-3 py-2 rounded cursor-pointer hover:bg-blue-700"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(record._id, "rejected")}
              className="bg-red-600 text-white border-none px-3 py-2 rounded cursor-pointer hover:bg-red-700"
            >
              Reject
            </button>
          </>
        );
      },
    },
  ];

  const fundRequestColumns = [
    {
      header: "#",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      header: "User Name",
      key: "username",
    },
    {
      header: "Amount",
      key: "amount",
    },
    {
      header: "Txn ID",
      key: "txnId",
    },
    {
      header: "Date",
      key: "date",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      header: "Type",
      key: "type",
      render: (_, record) => (
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          {record.status}
        </button>
      ),
    },
  ];

  const profitLossColumns = [
    {
      header: "Deposit",
      key: "deposit",
    },
    {
      header: "Withdraw",
      key: "withdraw",
    },
    {
      header: "Total",
      key: "total",
    },
    {
      header: "Result",
      key: "result",
      render: (result) => {
        const isProfit = result > 0;
        const isLoss = result < 0;
        const bgColor = isProfit ? "#7f56c7" : isLoss ? "#ed583e" : "#f3f4f6";
        const textColor = isLoss ? "white" : "black";

        return (
          <div
            className="p-2 rounded text-center"
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {isProfit
              ? `Profit: ${result}`
              : isLoss
                ? `Loss: ${Math.abs(result)}`
                : "No Profit/Loss"}
          </div>
        );
      },
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
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between bg-blue-300 py-3 px-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Back !
              </h2>
              <p className="text-gray-600">Admin Dashboard</p>
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
          onClick={() => navigate("/admin/all-bid-history")}
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
        // onClick={() => navigate("/admin/all-bid-history")}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-700">Players(Today)</p>
              <p className="text-2xl font-bold mt-1">
                {userStats.todayUsersWhoPlayedBid ?? "0"}
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
        // onClick={() => navigate("/admin/game-management/game-name")}
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
        // onClick={() => navigate("/admin/game-management/game-name")}
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
      </div>
      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">
            Total Bids on Single Ank of Date {new Date().toISOString().split("T")[0]}
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
                <option value="">Game Type</option>
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
                onChange={handleDateChange2}
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
                onClick={handleSubmit}
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
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Winning Amount</span>
                  <span className="font-bold ml-auto">Rs {dashboardData2.totalWinAmount || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Profit Amount</span>
                  <span className="font-bold ml-auto">
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
                  <span className="font-bold ml-auto">Rs {amountStats.withdrawalRequests || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg h-[72px] flex items-center">
                <div className="flex w-full items-center">
                  <span className="font-medium">Total Deposit (Approved)</span>
                  <span className="font-bold ml-auto">Rs {(amountStats.autoPaymentAmount + amountStats.manualdepositAmount) || 0}</span>
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
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
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
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
                  <button className="bg-blue-600 ml-4 text-white px-3 py-1 rounded text-sm">
                    View
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">
            Profit/Loss Report On Date {new Date().toISOString().split("T")[0]}
          </h3>
          {loadingButton3 ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            renderTable(profitLossColumns, profitLossData)
          )}
        </div> */}
      </div>

      {/* Fund Request History */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">
          Fund Request Auto Deposit History {todayFormatted}
        </h3>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : autoDepositHistory.filter((record) =>
          moment(record.createdAt).format("DD-MM-YYYY") === todayFormatted
        ).length > 0 ? (
          renderTable(
            fundRequestColumns,
            autoDepositHistory.filter((record) =>
              moment(record.createdAt).format("DD-MM-YYYY") === todayFormatted
            )
          )
        ) : (
          <p className="text-gray-500 text-center py-4">No records found for today</p>
        )}
      </div>

      {/* Withdrawal Request History */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">
          Withdraw Request History {today}
        </h3>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : withdrawalHistory.length > 0 ? (
          renderTable(withdrawalColumns, withdrawalHistory)
        ) : (
          <p className="text-gray-500 text-center py-4">No pending withdrawal requests</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;