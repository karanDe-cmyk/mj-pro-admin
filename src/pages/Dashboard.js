import React, { useEffect, useState } from "react";
import "../styles/styles.css";

import {
  Card,
  Typography,
  Avatar,
  Statistic,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Table,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FundOutlined,
} from "@ant-design/icons";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";
import moment from "moment";
import { Navigate, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fundRequests, setFundRequests] = useState([]);
  const [gamesList, setGamesList] = useState([]);
  const [starlineData, setStarlineData] = useState({ totalAmount: 0 });
  const [mainMarketData, setMainMarketData] = useState({ totalAmount: 0 });
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
  const [profitLossData, setProfitLossData] = useState([]);
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
  const today = dayjs().format("YYYY-MM-DD");
  const todayFormatted = dayjs().format("DD-MM-YYYY"); // For title and filtering today's records
  const navigate = useNavigate();

  // Handler for DatePicker changes.
  const handleDateChange2 = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
  };

  // Handler for game selection.
  const handleGameChange2 = (value) => {
    setSelectedGame2(value);
  };

  // Submit handler that calls the API directly.
  const handleSubmit = async () => {
    if (!selectedDate || !selectedGame2) {
      message.error("Please select both a date and a game name.");
      return;
    }
    try {
      setLoadingButton(true);
      const requestBody = {
        gameName: selectedGame2,
        date: selectedDate, // Expected in "DD-MM-YYYY" format.
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
      message.error("Error fetching total winnings");
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

  const handleGameChange = (value) => {
    setSelectedGame(value);
  };

  const handleSessionChange = (value) => {
    setSelectedSession(value);
  };

  const handleGetClick = async () => {
    if (!selectedGame || !selectedSession || !selectedGameType) {
      message.error("Please select a game name, session, and game type");
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
        message.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching bid summary:", error);
      message.error("Error fetching bid summary");
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

    const fetchGamesList = async () => {
      try {
        const response = await instance.get(`/api/gameRoutes/getGameList`);
        if (Array.isArray(response.data)) {
          setGamesList(response.data);
        } else {
          setGamesList([]);
          console.error("Error: Expected an array but received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching games list:", error);
        setGamesList([]);
      }
    };

    fetchDashboardData();
    fetchFundRequests();
    fetchGamesList();
  }, []);

  const fetchStarlineData = async () => {
    try {
      const response = await instance.get(
        `/api/starlinebid/starline-total-bid-amount`
      );
      const data = response.data;
      if (data.totalAmount !== undefined) {
        setStarlineData({ totalAmount: data.totalAmount });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Starline Bid Amount:", error);
    }
  };

  const fetchMainMarketData = async () => {
    try {
      const response = await instance.get(`/api/bid/todayBids`);
      const data = response.data;
      if (data.totalAmount !== undefined) {
        setMainMarketData({ totalAmount: data.totalAmount });
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      console.error("Error fetching MainMarketData Bid Amount:", error);
    }
  };

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
    fetchMainMarketData();
    fetchStarlineData();
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
          setProfitLossData([
            {
              key: 1,
              deposit: totalDeposit,
              withdraw: totalWithdraw,
              total: total,
              result: total,
            },
          ]);
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
      message.success(`Withdrawal ${status} successfully!`);
    } catch (error) {
      console.error(`Error updating withdrawal status to ${status}:`, error);
      message.error(`Failed to ${status} withdrawal.`);
    }
  };

  const withdrawalColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        if (record.status === "approved" || record.status === "rejected") {
          return <span style={{ fontWeight: "bold" }}>Action Taken</span>;
        }
        return (
          <>
            <button
              onClick={() => handleStatusChange(record._id, "approved")}
              style={{
                marginRight: "8px",
                backgroundColor: "#1677FF",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(record._id, "rejected")}
              style={{
                backgroundColor: "#F14646",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
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
      title: "#",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Txn ID",
      dataIndex: "txnId",
      key: "txnId",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: 8 }}>
            {record.status}
          </Button>
        </>
      ),
    },
  ];

  const profitLossColumns = [
    {
      title: "Deposit",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Withdraw",
      dataIndex: "withdraw",
      key: "withdraw",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (result) => {
        const isProfit = result > 0;
        const isLoss = result < 0;
        const bgColor = isProfit ? "#7f56c7" : isLoss ? "#ed583e" : "inherit";
        const textColor = isLoss ? "white" : "black";

        return (
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "5px",
              borderRadius: "4px",
              textAlign: "center",
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

  return (
    <div style={{ padding: 5 }}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="small" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Left Side */}
          <Col xs={24} md={8}>
            <div className="admin-dashboard-card">
              <div className="welcome-card">
                <Title level={3} className="admin-dashboard-title">
                  Welcome Back !
                </Title>
                <p className="admin-dashboard-subtitle">Admin Dashboard</p>
              </div>

              <div className="admin-dashboard-avatar-section">
                <div className="avtr-admin">
                  <Avatar
                    className="admin-dashboard-avatar"
                    src="https://img.icons8.com/?size=256w&id=110479&format=png"
                  />
                  <Title level={3} className="admin-dashboard-name">
                    Admin
                  </Title>
                </div>

                <div className="admin-dashboard-stats">
                  <Text
                    className="admin-dashboard-stats-text"
                    onClick={() =>
                      navigate("/admin/user-management/unapproved")
                    }
                  >
                    Unapproved Users:{" "}
                    {unapprovedUsers.unapprovedUsers ?? "Failed to fetch"}
                  </Text>
                </div>
                <div className="admin-dashboard-stats">
                  <Text
                    className="admin-dashboard-stats-text"
                    onClick={() => navigate("/admin/user-management/approved")}
                  >
                    Approved Users:{" "}
                    {approvedUsers.approvedUsers ?? "Failed to fetch"}
                  </Text>
                </div>
              </div>
            </div>
            <Card style={{ marginTop: 20 }}>
              <Title level={5}>Market Bid Details</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Date"
                    value={dayjs(selectedDate, "DD-MM-YYYY")}
                    onChange={handleDateChange2}
                    format="DD-MM-YYYY"
                  />
                </Col>
                <Col span={24} style={{ marginTop: 10 }}>
                  <Select
                    placeholder="Select Game Name"
                    style={{ width: "100%" }}
                    onChange={handleGameChange2}
                  >
                    {mainMarketGamesLeft.map((game) => (
                      <Option key={game._id} value={game.gameName}>
                        {game.gameName}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col
                  span={24}
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loadingButton}
                    style={{
                      backgroundColor: "#349163",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col style={{ marginTop: "55px" }} span={24}>
                  <div className="dashboard-card-inner">
                    <Row className="dashboard-card-row">
                      <Col className="dashboard-card-col">Total Bid Amount</Col>
                      <Col>
                        <span className="dashboard-card-value">
                          Rs {dashboardData2.totalBidAmount || 0}
                        </span>
                      </Col>
                      <Col>
                        <Button type="primary">View</Button>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col span={24}>
                  <div className="dashboard-card-inner">
                    <Row className="dashboard-card-row">
                      <Col className="dashboard-card-col">Total Win Amount</Col>
                      <Col>
                        <span className="dashboard-card-value">
                          Rs {dashboardData2.totalWinAmount || 0}
                        </span>
                      </Col>
                      <Col>
                        <Button type="primary">View</Button>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col span={24}>
                  <div className="dashboard-card-inner profit-card">
                    <Row className="dashboard-card-row">
                      <Col className="dashboard-card-col">
                        Total Profit Amount
                      </Col>
                      <Col>
                        <span className="dashboard-card-value">
                          Rs {dashboardData2.totalProfitAmount || 0}
                        </span>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Side */}
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/user-management/approved")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Users</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {totalUsers.totalUsers ?? "Failed to fetch"}
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#1890ff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <UserOutlined
                        style={{ color: "#fff", fontSize: "24px" }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/game-management/game-name")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Games</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {totalGames.totalGameCount ?? "Failed to fetch"}
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#1890ff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AppstoreOutlined
                        style={{ color: "#fff", fontSize: "24px" }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/all-bid-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Main Market Bid Amount
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {mainMarketData.totalAmount ?? "Failed to fetch"}
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#1890ff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DollarOutlined
                        style={{ color: "#fff", fontSize: "24px" }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/all-bid-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Starline Bid Amount
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {starlineData.totalAmount ?? "Failed to fetch"}
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#1890ff",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FundOutlined
                        style={{ color: "#fff", fontSize: "24px" }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Card style={{ marginTop: 20 }}>
              <Title level={5}>
                Total Bids on Single Ank of Date{" "}
                {new Date().toISOString().split("T")[0]}
              </Title>
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Select
                    placeholder="Select Game Name"
                    style={{ width: "100%" }}
                    onChange={handleGameChange}
                  >
                    {mainMarketGames.map((game) => (
                      <Option key={game._id} value={game.gameName}>
                        {game.gameName}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    placeholder="Select Session"
                    style={{ width: "100%" }}
                    onChange={handleSessionChange}
                  >
                    <Option value="open">Open</Option>
                    <Option value="close">Close</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    placeholder="Game Type"
                    style={{ width: "100%" }}
                    onChange={(value) => setSelectedGameType(value)}
                  >
                    {betRates.map((gameType, index) => (
                      <Option key={index} value={gameType}>
                        {gameType}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={4}>
                  <Button
                    className="min-w-full"
                    type="primary"
                    onClick={handleGetClick}
                    loading={loadingButton2}
                  >
                    Get
                  </Button>
                </Col>
              </Row>
            </Card>

            <div className="card-container">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ank) => {
                const hue = 36 * ank;
                const color = `hsl(${hue}, 60%, 50%)`;

                const digitData = dashboardData[ank] || {
                  totalUsers: 0,
                  totalAmount: 0,
                };

                return (
                  <div
                    className="card"
                    key={ank}
                    style={{ borderColor: color }}
                  >
                    <p className="card-text mt-2">
                      Total Bids {digitData.totalUsers}
                    </p>

                    <h4 className="card-title">{digitData.totalAmount}</h4>
                    <span className="font-bold">Total Bid Amount</span>

                    <button
                      className="card-btn"
                      style={{ backgroundColor: color }}
                    >
                      Ank {ank}
                    </button>
                  </div>
                );
              })}
            </div>

            <Card style={{ marginTop: 20, width: "100%" }}>
              <Title level={5}>
                Profit/Loss Report On Date{" "}
                {new Date().toISOString().split("T")[0]}
              </Title>
              {loadingButton3 ? (
                <Spin />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <Table
                  columns={profitLossColumns}
                  dataSource={profitLossData}
                  pagination={false}
                  rowKey="key"
                  scroll={{ x: 800 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}

      <Card style={{ marginTop: 20, width: "100%" }}>
        <Title level={5}>
          Fund Request Auto Deposite History {todayFormatted}
        </Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Table
            columns={fundRequestColumns}
            dataSource={autoDepositHistory.filter((record) =>
              moment(record.createdAt).format("DD-MM-YYYY") === todayFormatted
            )}
            rowKey="_id"
            scroll={{ x: true }}
          />
        )}
      </Card>

      <Card style={{ marginTop: 20, width: "100%" }}>
        <Title level={5}>Withdraw Request History {today}</Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Table
            columns={withdrawalColumns}
            dataSource={withdrawalHistory}
            rowKey="_id"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
