import React, { useEffect, useState } from "react";
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

import moment from "moment";

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
  const [error, setError] = useState(null); // Error state
  const [profitLossData, setProfitLossData] = useState([]);
  const [dashboardData2, setDashboardData2] = useState({
    totalBidAmount: 0,
    totalWinAmount: 0,
    totalProfitAmount: 0,
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGame2, setSelectedGame2] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);
  const [loadingButton3, setLoadingButton3] = useState(false);
  // Handler for DatePicker changes.
  // We expect the date to come in as a Moment object; we then convert it to "DD-MM-YYYY" format.
  const handleDateChange2 = (date, dateString) => {
    if (date) {
      // Convert dateString from "YYYY-MM-DD" (default) to "DD-MM-YYYY"
      const parts = dateString.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate("");
    }
  };

  // Handler for game selection.
  const handleGameChange2 = (value) => {
    // console.log("Selected Game:", value);
    setSelectedGame2(value);
  };

  // Submit handler that calls the API directly.
  const handleSubmit = async () => {
    // console.log("Submit clicked with:", { selectedGame2, selectedDate });
    if (!selectedDate || !selectedGame2) {
      message.error("Please select both a date and a game name.");
      return;
    }
    try {
      setLoadingButton(true);
      // Prepare the request body.
      const requestBody = {
        gameName: selectedGame2,
        date: selectedDate, // Expected in "DD-MM-YYYY" format.
      };
      // console.log("Posting to API with:", requestBody);

      const response = await instance.post(
        `/api/mainmarketdeclareResult/get-total-winnings`,
        requestBody
      );
      // console.log("API response:", response.data);

      // Assuming the response data has { totalPoints, totalWinningPoints }
      const { totalPoints, totalWinningPoints } = response.data;
      // Calculate profit (for example, difference between points and winning points).
      const totalProfitAmount = totalPoints - totalWinningPoints;

      // Set the dashboard data.
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

  // console.log(profitLossData)
  // Fetch data for Total Users
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

  // Fetch data for ApprovedUsers
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

  // Fetch data for UnApprovedUsers
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
        setLoading(true); // Set loading to true before API call
        const response = await instance.get(
          `/api/userPayment/getpaymentResponse`
        );
        setAutoDepositHistory(response.data.data || []); // Ensure data is an array
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error("Error fetching deposit history:", err);
        setError("Failed to fetch deposit history. Please try again.");
        setLoading(false); // Stop loading on error
      }
    };

    fetchDepositHistory();
  }, []);

  // Handler for Game Name selection
  const handleGameChange = (value) => {
    setSelectedGame(value);
  };

  // Handler for Session selection
  const handleSessionChange = (value) => {
    setSelectedSession(value);
  };

  const handleGetClick = async () => {
    // Validate selections
    if (!selectedGame || !selectedSession) {
      message.error("Please select both a game name and a session");
      return;
    }

    // Determine the open/close flags based on selection
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
    };

    try {
      setLoadingButton2(true);
      const response = await instance.post(`/api/bid/todayDigitSummary`, body);
      // Assuming response.data.data contains the summary for digits 0–9
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
        // Ensure the response is an array
        if (Array.isArray(response.data)) {
          // Filter out only the games with marketName exactly "Main Market"
          const filteredGames = response.data.filter(
            (game) => game.marketName === "Main Market"
          );
          setMainMarketGamesList(filteredGames);
          setMainMarketGamesListLeft(filteredGames);
          // console.log("Main Market Games List:", filteredGames);
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

        // console.log("API Response for Games List:", response.data);

        // Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setGamesList(response.data);
        } else {
          setGamesList([]); // Fallback to empty array if data is not an array
          console.error(
            "Error: Expected an array but received:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching games list:", error);
        setGamesList([]); // Fallback to empty array on error
      }
    };

    fetchDashboardData();
    fetchFundRequests();
    fetchGamesList();
  }, []);

  // Fetch data for Starline
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

  // Fetch data for Main Market
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

  // Fetch data for Total  Games
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

  // Call both fetch functions when the component mounts or  changes
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
        // Call the API using a GET request.
        const response = await instance.get(`/api/users/total-profit-loss`);
        // console.log("Profit/Loss API response:", response.data);

        if (response.data && response.data.success) {
          const totalDeposit = response.data.totalDeposit || 0;
          const totalWithdraw = response.data.totalWithdraw || 0;
          const total = totalDeposit - totalWithdraw;
          // Set the table data as a single-row array.
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
  }, []); // Empty dependency array means this runs once on mount

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
      // Format the createdAt date using moment.
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

  // Table columns for Profit / Loss Summary
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
        // Set background color based on profit or loss.
        const bgColor = isProfit ? "cyan" : isLoss ? "tomato" : "inherit";
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
    <div style={{ padding: 20 }}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="small" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Left Side */}
          <Col xs={24} md={8}>
            <Card style={{ borderRadius: 8, padding: 16 }}>
              <Title level={2} style={{ fontWeight: "bold" }}>
                Welcome Back!
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: 18, fontWeight: "bold" }}
              >
                Admin Dashboard
              </Text>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Avatar
                  size={80}
                  src="https://img.icons8.com/?size=256w&id=110479&format=png"
                />
                <Title level={3} style={{ marginTop: 10, fontWeight: "bold" }}>
                  Admin
                </Title>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Unapproved Users:{" "}
                  {unapprovedUsers.unapprovedUsers ?? "Failed to fetch"}
                </Text>
                <br />
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Approved Users:{" "}
                  {approvedUsers.approvedUsers ?? "Failed to fetch"}
                </Text>
              </div>
            </Card>

            <Card style={{ marginTop: 20 }}>
              <Title level={5}>Market Bid Details</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Date"
                    onChange={handleDateChange2}
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
                <Col span={24} style={{ marginTop: 10 }}>
                  <Button
                    type="primary"
                    block
                    onClick={handleSubmit}
                    loading={loadingButton}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Dashboard Cards */}
            <Card style={{ marginTop: 20 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Card>
                    <Row justify="space-between" align="middle">
                      <Statistic
                        title="Total Bid Amount"
                        value={dashboardData2.totalBidAmount || 0}
                        prefix="Rs"
                      />
                      <Button type="primary">View</Button>
                    </Row>
                  </Card>
                </Col>
                <Col span={24} style={{ marginTop: 10 }}>
                  <Card>
                    <Row justify="space-between" align="middle">
                      <Statistic
                        title="Total Win Amount"
                        value={dashboardData2.totalWinAmount || 0}
                        prefix="Rs"
                      />
                      <Button type="primary">View</Button>
                    </Row>
                  </Card>
                </Col>
                <Col span={24} style={{ marginTop: 10 }}>
                  <Card style={{ backgroundColor: "#f6ffed" }}>
                    <Statistic
                      title="Total Profit Amount"
                      value={dashboardData2.totalProfitAmount || 0}
                      prefix="Rs"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Side */}
          <Col xs={24} md={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title={
                      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Users
                      </span>
                    }
                    value={totalUsers.totalUsers ?? "Failed to fetch"} // ✅ Fix applied here
                    valueStyle={{ fontWeight: "bold", fontSize: "28px" }}
                    prefix={
                      <UserOutlined
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                      />
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title={
                      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Games
                      </span>
                    }
                    value={totalGames.totalGameCount ?? "Failed to fetch"} // ✅ Fix applied here
                    valueStyle={{ fontWeight: "bold", fontSize: "28px" }}
                    prefix={
                      <AppstoreOutlined
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                      />
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title={
                      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Main Market Bid Amount
                      </span>
                    }
                    value={mainMarketData.totalAmount ?? "Failed to fetch"} // ✅ Fix here
                    valueStyle={{ fontWeight: "bold", fontSize: "28px" }}
                    prefix={
                      <DollarOutlined
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                      />
                    }
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title={
                      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                        Starline Bid Amount
                      </span>
                    }
                    value={starlineData.totalAmount ?? "Failed to fetch"} // ✅ Fix here
                    valueStyle={{ fontWeight: "bold", fontSize: "28px" }}
                    prefix={
                      <FundOutlined
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                      />
                    }
                  />
                </Card>
              </Col>
            </Row>

            <Card style={{ marginTop: 20 }}>
              <Title level={5}>
                Total Bids on Single Ank of Date{" "}
                {new Date().toISOString().split("T")[0]}
              </Title>
              <Row gutter={16} align="middle">
                <Col span={9}>
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
                <Col span={9}>
                  <Select
                    placeholder="Select Session"
                    style={{ width: "100%" }}
                    onChange={handleSessionChange} // You can still capture the selection here
                  >
                    <Option value="open">Open</Option>
                    <Option value="close">Close</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    block
                    onClick={handleGetClick}
                    loading={loadingButton2}
                  >
                    Get
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Dashboard Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ank) => {
                // Calculate a unique hue for each card
                const hue = 36 * ank; // 360 / 10 * ank
                const color = `hsl(${hue}, 70%, 50%)`;
                // Extract summary data for the digit or use default values
                const digitData = dashboardData[ank] || {
                  totalUsers: 0,
                  totalAmount: 0,
                };

                return (
                  <Col span={6} key={ank}>
                    <Card style={{ textAlign: "center", borderColor: color }}>
                      <Text style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Total Bids {digitData.totalUsers}
                      </Text>
                      <Title
                        level={3}
                        style={{ fontWeight: "bold", fontSize: "32px" }}
                      >
                        {digitData.totalAmount}
                      </Title>
                      <Button
                        block
                        style={{
                          backgroundColor: color,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        Ank {ank}
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Profit / Loss Summary Table */}
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
                  scroll={{ x: 800 }} // Adjust this value if needed for your layout
                />
              )}
            </Card>

            <Card style={{ marginTop: 20, width: "100%" }}>
              <Title level={5}>Fund Request Auto Deposit History</Title>
              {loading ? (
                <Spin />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <Table
                  columns={fundRequestColumns}
                  dataSource={autoDepositHistory}
                  rowKey="_id"
                  // Optional: enable horizontal scrolling if your table is wider than the viewport
                  scroll={{ x: true }}
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
