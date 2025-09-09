import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import {
  Card,
  Typography,
  Avatar,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Table,
  Spin,
  message,
  TimePicker,
} from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FundOutlined,
  WalletOutlined,
  DollarCircleOutlined,
  TrophyOutlined,
  LineChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [selectedFilterDate, setSelectedFilterDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState({ totalUsers: 0 });
  const [approvedUsers, setApprovedUsers] = useState({ approvedUsers: 0 });
  const [unapprovedUsers, setUnApprovedUsers] = useState({ unapprovedUsers: 0 });
  const [totalGames, setTotalGames] = useState({ totalGameCount: 0 });
  const [mainMarketGamesList, setMainMarketGamesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);
  const [loadingButton3, setLoadingButton3] = useState(false);
  const [betRates, setBetRates] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [error, setError] = useState(null);
  const [profitLossData, setProfitLossData] = useState([]);
  const [dashboardData2, setDashboardData2] = useState({
    totalBidAmount: 0,
    totalWinAmount: 0,
    totalProfitAmount: 0,
  });
  const [loginStats, setLoginStats] = useState({
    todayLoginCount: 0,
  });
  const [registrationStats, setRegistrationStats] = useState({
    todayRegistrations: 0,
  });
  const [marketRefreshTime, setMarketRefreshTime] = useState(null);
  const [updatingRefreshTime, setUpdatingRefreshTime] = useState(false);
  const [totalAutoDeposit, setTotalAutoDeposit] = useState(0);
  const [totalManualDeposit, setTotalManualDeposit] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalFundRequests, setTotalFundRequests] = useState(0);
  const [selectedGameType, setSelectedGameType] = useState("");
  const [loadingButton4, setLoadingButton4] = useState(false);
  const [totalWalletBalance, setTotalWalletBalance] = useState(0);
  const [totalAdminDeposits, setTotalAdminDeposits] = useState(0); // New state for admin deposits
  const [totalXtreemGateway, setTotalXtreemGateway] = useState(0);

  const navigate = useNavigate();

  const handleViewBids = () => {
    navigate(`/admin/bids-list?date=${selectedDate}`);
  };

  // New function to handle navigation for wins
  const handleViewWins = () => {
    navigate(`/admin/wins-list?date=${selectedDate}`);
  };

  const fetchLoginStats = async () => {
    try {
      const response = await instance.get("/api/session/admin/login-stats");
      if (response.data.success) {
        setLoginStats({ todayLoginCount: response.data.todayLoginCount });
      }
    } catch (error) {
      console.error("Error fetching login stats:", error);
    }
  };

  const fetchRegistrationStats = async () => {
    try {
      const response = await instance.get(
        "/api/session/admin/registration-stats"
      );
      if (response.data.success) {
        setRegistrationStats({
          todayRegistrations: response.data.todayRegistrations,
        });
      }
    } catch (error) {
      console.error("Error fetching registration stats:", error);
    }
  };

  const handleFilterDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("DD-MM-YYYY") : null;
    setSelectedFilterDate(formattedDate);
  };

  const handleDateChange2 = (date) => {
    const formattedDate = date ? dayjs(date).format("DD-MM-YYYY") : null;
    setSelectedDate(formattedDate);
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      message.error("Please select a date.");
      return;
    }
    try {
      setLoadingButton(true);
      const requestBody = { date: selectedDate };
      const response = await instance.post(
        `/api/mainmarketdeclareResult/get-total-winnings`,
        requestBody
      );
      console.log("Total Winnings Response:", response.data);
      const { totalPoints, totalWinningPoints } = response.data;
      setDashboardData2({
        totalBidAmount: totalPoints,
        totalWinAmount: totalWinningPoints,
        totalProfitAmount: totalPoints - totalWinningPoints,
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
      const [approvedResponse, unapprovedResponse] = await Promise.all([
        instance.get(`/api/auth/userStatus?status=true`),
        instance.get(`/api/auth/userStatus?status=false`),
      ]);

      const approvedUsersList = approvedResponse.data || [];
      const unapprovedUsersList = unapprovedResponse.data || [];

      const allUsers = [...approvedUsersList, ...unapprovedUsersList];

      const totalBalance = allUsers.reduce(
        (sum, user) => sum + (user.walletBalance || 0),
        0
      );
      setTotalWalletBalance(totalBalance);

      setTotalUsers({ totalUsers: allUsers.length });
      setApprovedUsers({ approvedUsers: approvedUsersList.length });
      setUnApprovedUsers({ unapprovedUsers: unapprovedUsersList.length });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setTotalUsers({ totalUsers: 0 });
      setApprovedUsers({ approvedUsers: 0 });
      setUnApprovedUsers({ unapprovedUsers: 0 });
      setTotalWalletBalance(0);
    }
  };

  const fetchTotalGames = async () => {
    try {
      const response = await instance.get(
        `/api/marketManagement/games/totalCount`
      );
      setTotalGames({ totalGameCount: response.data.totalGameCount || 0 });
    } catch (error) {
      console.error("Error fetching total games:", error);
    }
  };

  const handleGameChange = (value) => setSelectedGame(value);
  const handleSessionChange = (value) => setSelectedSession(value);

  const handleGetClick = async () => {
    if (!selectedGame || !selectedSession || !selectedGameType) {
      message.error("Please select a game name, session, and game type");
      return;
    }
    const body = {
      gameName: selectedGame,
      open: selectedSession === "open",
      close: selectedSession === "close",
      gameType: selectedGameType,
      date: selectedFilterDate || dayjs().format("DD-MM-YYYY"),
    };
    try {
      setLoadingButton2(true);
      const response = await instance.post(`/api/bid/todayDigitSummary`, body);
      if (response.data?.data) {
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

  const fetchMainMarketGames = async () => {
    try {
      const response = await instance.get(
        `/api/marketManagement/getMarketGames`
      );
      if (Array.isArray(response.data)) {
        setMainMarketGamesList(
          response.data.filter((game) => game.marketName === "Main Market")
        );
      }
    } catch (error) {
      console.error("Error fetching market games:", error);
    }
  };

  const fetchBetRates = async () => {
    try {
      const response = await instance.get("api/rates/getBetRates");
      if (response.data && typeof response.data === "object") {
        const { _id, createdAt, updatedAt, __v, ...filteredData } =
          response.data;
        const cleanedData = Object.keys(filteredData)
          .filter((key) => !key.includes("Value"))
          .reduce((acc, key) => ({ ...acc, [key]: filteredData[key] }), {});
        setBetRates(Object.keys(cleanedData));
      }
    } catch (error) {
      console.error("Error fetching bet rates:", error);
    }
  };

  const fetchCounts = async (date) => {
    setLoading(true);

    try {
      // Convert date from DD-MM-YYYY to YYYY-MM-DD format for API
      const apiDate = date ? dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");

      const [
        autoDepositRes,
        manualDepositRes,
        withdrawalRes,
        adminDepositsRes,
        fundRequestsRes,
      ] = await Promise.allSettled([
        instance.get(`/api/userPayment/transactions?date=${date}`),
        instance.get(`/api/manualDeposit/bydate?date=${date}`),
        instance.get(`/api/users/todaywithdrawals?date=${date}`),
        instance.get(`/api/deposit/all-deposite/bydate?date=${date}`),
        instance.get(`/api/admin/fundRequests?date=${date}`),
      ]);

      // Handle auto deposits response
      if (autoDepositRes.status === "fulfilled") {
        // Check the actual structure of the response
        console.log("Auto deposit response:", autoDepositRes.value.data);

        // Handle different possible response structures
        let autoDepositData = [];
        if (autoDepositRes.value.data && Array.isArray(autoDepositRes.value.data)) {
          autoDepositData = autoDepositRes.value.data;
        } else if (autoDepositRes.value.data && autoDepositRes.value.data.data) {
          autoDepositData = autoDepositRes.value.data.data;
        }

        const xtreemGatewayTotal = autoDepositData
          .filter(item =>
            item.status === "Success" &&
            item.comments &&
            item.comments.includes("Xtreem Gateway")
          )
          .reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );

        setTotalXtreemGateway(xtreemGatewayTotal);

        const autoDepositTotalAmount = autoDepositData
          .filter(item => item.status === "Success")
          .reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );
        setTotalAutoDeposit(autoDepositTotalAmount);
      } else {
        console.error("Failed to fetch auto deposits:", autoDepositRes.reason);
        setTotalAutoDeposit(0);
      }

      // Handle other responses...
      if (manualDepositRes.status === "fulfilled") {
        const manualDepositData = manualDepositRes.value.data.data || [];
        const manualDepositTotalAmount = manualDepositData.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );
        setTotalManualDeposit(manualDepositTotalAmount);
      } else {
        console.error("Failed to fetch manual deposits:", manualDepositRes.reason);
        setTotalManualDeposit(0);
      }

      if (withdrawalRes.status === "fulfilled") {
        const withdrawalData = withdrawalRes.value.data || [];
        const withdrawalTotalAmount = withdrawalData.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );
        setTotalWithdrawals(withdrawalTotalAmount);
      } else {
        console.error("Failed to fetch withdrawals:", withdrawalRes.reason);
        setTotalWithdrawals(0);
      }

      if (adminDepositsRes.status === "fulfilled") {
        const adminDepositsData = adminDepositsRes.value.data.data || [];
        const adminDepositsTotalAmount = adminDepositsData.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );
        setTotalAdminDeposits(adminDepositsTotalAmount);
      } else {
        console.error("Failed to fetch admin deposits:", adminDepositsRes.reason);
        setTotalAdminDeposits(0);
      }

      if (fundRequestsRes.status === "fulfilled") {
        setTotalFundRequests(fundRequestsRes.value.data.length || 0);
      } else {
        console.error("Failed to fetch fund requests:", fundRequestsRes.reason);
        setTotalFundRequests(0);
      }

      setLoading(false);
    } catch (err) {
      console.error("An unexpected error occurred during API calls:", err);
      setLoading(false);
    }
  };

  const fetchProfitLossData = async () => {
    try {
      setLoadingButton3(true);
      setError(null);
      const url = selectedFilterDate
        ? `/api/users/total-profit-loss?date=${selectedFilterDate}`
        : `/api/users/total-profit-loss`;
      const response = await instance.get(url);
      if (response.data?.success) {
        const { totalDeposit = 0, totalWithdraw = 0 } = response.data;
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

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalGames();
    fetchMainMarketGames();
    fetchBetRates();
    fetchLoginStats();
    fetchRegistrationStats();
  }, []);

  useEffect(() => {
    const today = dayjs().format("DD-MM-YYYY");
    setSelectedDate(today);
    fetchCounts(today);
  }, []);

  // Use a separate useEffect to handle date-specific data fetching
  useEffect(() => {
    if (selectedDate) {
      fetchCounts(selectedDate);
      handleSubmit(); // Call the function to update bid/win/profit amounts as well
    }
  }, [selectedDate]);

  const handleUpdateMarketRefreshTime = async () => {
    if (!marketRefreshTime) {
      message.error("Please select a time first.");
      return;
    }
    setUpdatingRefreshTime(true);
    try {
      const timeString = dayjs(marketRefreshTime).format("HH:mm");
      const response = await instance.post(
        "/api/admin/settings/updateMarketRefreshTime",
        {
          refreshTime: timeString,
        }
      );
      if (response.data.success) {
        message.success(
          `Market refresh time updated to ${timeString} successfully!`
        );
      } else {
        message.error(response.data.message || "Failed to update refresh time.");
      }
    } catch (error) {
      console.error("Error updating refresh time:", error);
      message.error("An error occurred while updating the refresh time.");
    } finally {
      setUpdatingRefreshTime(false);
    }
  };

  const profitLossColumns = [
    { title: "Deposit", dataIndex: "deposit", key: "deposit" },
    { title: "Withdraw", dataIndex: "withdraw", key: "withdraw" },
    { title: "Total", dataIndex: "total", key: "total" },
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
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Title level={5}>Filter Data by Date</Title>
          </Col>
          <Col>
            <DatePicker
              style={{ width: 200 }}
              placeholder="Select Date"
              value={
                selectedFilterDate
                  ? dayjs(selectedFilterDate, "DD-MM-YYYY")
                  : null
              }
              onChange={handleFilterDateChange}
              format="DD-MM-YYYY"
              allowClear
            />
          </Col>
        </Row>
      </Card>
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
                  Welcome Back!
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
                    onClick={() => navigate("/admin/user-management/unapproved")}
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
              <Title level={5}>Market Bid Details for {selectedDate}</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Date"
                    value={selectedDate ? dayjs(selectedDate, "DD-MM-YYYY") : null}
                    onChange={(date) => {
                      const formattedDate = date ? dayjs(date).format("DD-MM-YYYY") : null;
                      setSelectedDate(formattedDate);
                      if (formattedDate) {
                        fetchCounts(formattedDate);
                      }
                    }}
                    format="DD-MM-YYYY"
                    allowClear
                  />
                </Col>
                <Col
                  span={24}
                  style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}
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
            </Card>
            <Card style={{ marginTop: 20 }}>
              <Title level={5}>Update Market Refresh Time</Title>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <TimePicker
                    style={{ width: "100%" }}
                    value={marketRefreshTime}
                    onChange={setMarketRefreshTime}
                    format="HH:mm"
                    placeholder="Select Time"
                  />
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={handleUpdateMarketRefreshTime}
                    loading={updatingRefreshTime}
                    style={{
                      width: "100%",
                      backgroundColor: "#349163",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Update
                  </Button>
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
                    <div>
                      <UserOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#1890ff",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
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
                      <span style={{ fontWeight: "bold" }}>Games (Today)</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {totalGames.totalGameCount ?? "Failed to fetch"}
                      </div>
                    </div>
                    <div>
                      <AppstoreOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#1890ff",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              {/* New Card for Total Wallet Balance */}
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Total Wallet Balance
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalWalletBalance.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <WalletOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#722ed1",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              {/* Other Cards for counts with navigation */}
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/auto-deposit-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>All Deposit (Success)</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalAutoDeposit}
                      </div>
                    </div>
                    <div>
                      <DollarOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#52c41a",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/gateway-payment")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Auto Deposit</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalXtreemGateway}
                      </div>
                    </div>
                    <div>
                      <DollarOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#13c2c2", // आप अपनी पसंद का कोई भी रंग चुन सकते हैं
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/manual-deposits-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Manual Deposits
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalManualDeposit}
                      </div>
                    </div>
                    <div>
                      <DollarOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#f5a623",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/withdrawals-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Withdrawals</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalWithdrawals}
                      </div>
                    </div>
                    <div>
                      <FundOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#ff4d4f",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() =>
                      navigate("/admin/wallet-management/all-deposit-by-admin")
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Deposite By Admin
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {totalAdminDeposits}
                      </div>
                    </div>
                    <div>
                      <FundOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#ff4d4f",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              {/* <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={() => navigate("/admin/fund-requests-history")}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Fund Requests</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {totalFundRequests}
                      </div>
                    </div>
                    <div>
                      <FundOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#722ed1",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col> */}
              {/* Add the new cards for Bid, Win, and Profit amounts here */}
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={handleViewBids}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Total Bid Amount</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {dashboardData2.totalBidAmount || 0}
                      </div>
                    </div>
                    <div>
                      <DollarCircleOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#df4d8f",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    onClick={handleViewWins}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>Total Win Amount</span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {dashboardData2.totalWinAmount || 0}
                      </div>
                    </div>
                    <div>
                      <TrophyOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#dd4d6d",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ borderRadius: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Total Profit Amount
                      </span>
                      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Rs {dashboardData2.totalProfitAmount.toFixed(2) || 0}
                      </div>
                    </div>
                    <div>
                      <RiseOutlined
                        style={{
                          color: "#fff",
                          fontSize: "24px",
                          backgroundColor: "#ff4d4f",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Card style={{ marginTop: 20 }}>
              <Title level={5}>
                Total Bids on Single Ank on {selectedFilterDate || "All Dates"}
              </Title>
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Select
                    placeholder="Select Game Name"
                    style={{ width: "100%" }}
                    onChange={handleGameChange}
                  >
                    {mainMarketGamesList.map((game) => (
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
                  <div className="card" key={ank} style={{ borderColor: color }}>
                    <p className="card-text mt-2">
                      Today Bids: {digitData.totalUsers || 0}
                    </p>
                    <h4 className="card-title">₹{digitData.totalAmount || 0}</h4>
                    <span className="font-bold">Total Bid Amount</span>
                    <button className="card-btn" style={{ backgroundColor: color }}>
                      Ank {ank}
                    </button>
                  </div>
                );
              })}
            </div>
            <Card style={{ marginTop: 20, width: "100%" }}>
              <Title level={5}>
                Profit/Loss Report for {selectedFilterDate || "All Dates"}
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
    </div>
  );
};

export default Dashboard;