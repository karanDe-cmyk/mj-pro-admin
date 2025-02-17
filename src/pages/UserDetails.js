import React, { useState, useEffect } from "react";

import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Badge,
  Table,
  Select,
  Tabs,
  Modal,
  Form,
  Input,
  message, Tag
} from "antd";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import instance from "../utils/axiosInstance";
import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const UserDetails = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [withdrawData, setWithdrawData] = useState([]);
  const [search, setSearch] = useState(""); // Search input

  const [modalVisible, setModalVisible] = useState(false);
  // State to track which action to perform ("add" or "withdraw")
  const [actionType, setActionType] = useState("");
  // State to store the amount entered in the popup
  const [amount, setAmount] = useState("");
  const [depositTransactions, setDepositTransactions] = useState([]);
  const [winningData, setWinningData] = useState([]);
  const [entries, setEntries] = useState(5);
  const { userId } = useParams();


  // console.log("userId....", userId);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [transactionHistoryDataAll, setTransactionHistoryDataAll] = useState(
    []
  );

  const fetchTransactions = async (userId) => {
    try {
      const response = await instance.get(
        `/api/deposit/transactions/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  // Function to load transactions for the current user.
  const loadTransactions = async () => {
    // If userData is not available, just return.
    if (!userData || !userData.userId) return;

    try {
      const data = await fetchTransactions(userData.userId);
      if (data.status) {
        setDepositTransactions(data.transactions);
      } else {
        message.error("Failed to fetch transactions");
      }
    } catch (error) {
      message.error("Error fetching transactions");
    }
  };

  // Always call useEffect at the top level.
  // Use an inner async function to handle async logic and include userData in dependencies.
  useEffect(() => {
    const fetchData = async () => {
      if (userData && userData.userId) {
        await loadTransactions();
      }
    };

    fetchData();
  }, [userData]); // include userData as a dependency

  // **Fetch Withdraw Transactions (Only Pending & Today’s)**
  const fetchWithdrawTransactions = async () => {
    try {
      const response = await instance.get(`/api/withdraw/transactions/${userId}`);
      if (response.data.status) {
        const today = moment().format("YYYY-MM-DD");

        // Filter to show only today's pending transactions
        const filteredData = response.data.transactions.filter(
          (txn) => txn.status.toLowerCase() === "pending" && moment(txn.date).format("YYYY-MM-DD") === today
        );

        setWithdrawData(filteredData);
      } else {
        message.error("Failed to fetch withdrawal transactions");
      }
    } catch (error) {
      console.error("Error fetching withdrawal transactions:", error);
      message.error("Error fetching withdrawal transactions");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWithdrawTransactions();
    }
  }, [userId]);
  // **Update Withdrawal Status (Accept/Reject)**
  const updateWithdrawStatus = async (id, status) => {
    try {
      await instance.patch(`/api/users/withdrawals/status/${id}`, {
        status: status,
        
      });

      // Remove the transaction from UI immediately
      setWithdrawData((prevData) => prevData.filter((txn) => txn._id !== id));

      message.success(`Withdrawal request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      message.error(`Failed to ${status.toLowerCase()} withdrawal request.`);
    }
  };


  // Load withdrawal transactions once userData is available.
  const loadWithdrawTransactions = async () => {
    if (!userData || !userId) return;
    try {
      const data = await fetchWithdrawTransactions(userId);
      if (data.status) {
        setWithdrawData(data.transactions);
      } else {
        message.error("Failed to fetch withdrawal transactions");
      }
    } catch (error) {
      message.error("Error fetching withdrawal transactions");
    }
  };

  useEffect(() => {
    loadWithdrawTransactions();
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get(`/api/app/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Open the modal and set the action type
  const openModal = (type) => {
    setActionType(type);
    setModalVisible(true);
  };

  // Handler for closing the modal
  const closeModal = () => {
    setModalVisible(false);
    setAmount("");
  };

  const handleSubmit = async () => {
    try {
      const requestBody = {
        email: userData.email,
        amount: parseFloat(amount),
      };

      let transactionResponse;

      if (actionType === "add") {
        transactionResponse = await instance.post(
          `/api/deposit/Addfunds`,
          requestBody
        );
      } else if (actionType === "withdraw") {
        transactionResponse = await instance.post(
          "/api/withdraw/withdrawalFund/",
          requestBody
        );
      }

      if (
        transactionResponse &&
        transactionResponse.data &&
        transactionResponse.data.status
      ) {
        // Determine the change amount based on the action type.
        // For "add", the amount is added; for "withdraw", subtract the amount.
        const changeAmount = transactionResponse.data.requestAmount;
        setUserData((prevData) => ({
          ...prevData,
          walletBalance:
            actionType === "add"
              ? prevData.walletBalance + changeAmount
              : prevData.walletBalance - changeAmount,
        }));

        message.success(transactionResponse.data.message);
      } else {
        message.error("Transaction completed but no updated balance returned.");
      }

      closeModal();
    } catch (error) {
      console.error("Error processing transaction:", error);
      message.error("An error occurred during the transaction.");
    }
  };

  useEffect(() => {
    if (!userData?._id) return; // Ensure user ID is available
    fetchWinningData();
  }, [userData]);

  const fetchWinningData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/api/winning/getTotalWinningamount/${userData._id}`
      );

      if (response.data.status) {
        formatWinningData(response.data.winningRecords);
      } else {
        message.error("Failed to fetch winning history.");
      }
    } catch (error) {
      console.error("Error fetching winning history:", error);
      message.error("Error fetching winning data.");
    } finally {
      setLoading(false);
    }
  };

  const formatWinningData = (records) => {
    const formattedData = records.flatMap((record) =>
      record.winners.map((winner) => ({
        key: `${record._id}-${winner._id}`,
        market: record.marketName || "Starline",
        gameName: record.gameName || record.market,
        bidAmount: winner.points,
        winningAmount: winner.winningAmount || winner.winningPoints,
        status: "Win",
        date: moment(record.createdAt).format("YYYY-MM-DD hh:mm:ss A"),
      }))
    );

    // Sort by latest date (Descending)
    const sortedData = formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Assign proper sequential S.No (1,2,3,4...)
    const finalData = sortedData.map((item, index) => ({
      ...item,
      sNo: index + 1, // Ensure sNo starts from 1 and increments
    }));

    setWinningData(finalData);
  };

  useEffect(() => {
    if (!userData?._id) return; // Ensure user ID is available
    fetchBids();
  }, [userData]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/bid/bids/${userData._id}`);
      if (response.data.status) {
        formatData(response.data);
      } else {
        message.error("Failed to fetch bids.");
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      message.error("Error fetching bid history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return; // Ensure userId is available
    fetchTransactionsAll();
  }, [userData]);

  const fetchTransactionsAll = async () => {
    try {
        setLoading(true);
        // console.log("Fetching transactions...");

        // console.log("User ID:", userId);
        // console.log("User Data ID:", userData.userId);

        // Fetch deposit and withdraw transactions simultaneously
        const [depositRes, withdrawRes] = await Promise.allSettled([
            instance.get(`/api/deposit/transactions/${userData.userId}`),
            instance.get(`/api/withdraw/transactions/${userId}`)
        ]);

        // console.log("Deposit API Response:", depositRes);
        // console.log("Withdraw API Response:", withdrawRes);

        let depositTransactions = [];
        let withdrawTransactions = [];

        // ✅ Handle deposit API response
        if (
            depositRes.status === "fulfilled" &&
            depositRes.value.status === 200 &&
            depositRes.value.data.status &&
            Array.isArray(depositRes.value.data.transactions)
        ) {
            // console.log("Deposit Transactions:", depositRes.value.data.transactions);
            depositTransactions = depositRes.value.data.transactions;
        } else {
            console.warn("No deposit transactions found or API failed.");
        }

        // ✅ Handle withdraw API response
        if (
            withdrawRes.status === "fulfilled" &&
            withdrawRes.value.status === 200 &&
            withdrawRes.value.data.status &&
            Array.isArray(withdrawRes.value.data.transactions)
        ) {
            // console.log("Withdraw Transactions:", withdrawRes.value.data.transactions);
            withdrawTransactions = withdrawRes.value.data.transactions;
        } else {
            console.warn("No withdrawal transactions found or API failed.");
        }

        // ✅ Ensure the transactions are displayed even if one API has no data
        formatTransactionData(depositTransactions, withdrawTransactions);

        if (depositTransactions.length === 0 && withdrawTransactions.length === 0) {
            message.info("No transactions found for this user.");
        } else {
            message.success("Transactions fetched successfully.");
        }

    } catch (error) {
        console.error("Error fetching transactions:", error);
        message.error("Error fetching wallet transaction history.");
    } finally {
        setLoading(false);
    }
};

  
const formatTransactionData = (depositTransactions, withdrawTransactions) => {
  // Format deposit transactions
  const formattedDeposits = depositTransactions.map((txn, index) => ({
    key: `deposit-${index}`,
    sNo: index + 1,
    requestNumber: txn.requestNumber || txn.transaction_id || "N/A", // Handle missing request numbers
    amount: txn.amount,
    transactionType: "Money Added",
    date: moment(txn.date).format("YYYY-MM-DD hh:mm:ss A"),
    type: "deposit",
  }));

  // Format withdraw transactions
  const formattedWithdrawals = withdrawTransactions.map((txn, index) => ({
    key: `withdraw-${index}`,
    sNo: index + 1 + formattedDeposits.length,
    // Use txn.requestNumber if it exists, otherwise txn.transaction_id, or "N/A" if neither exists.
    requestNumber: txn.requestNumber || txn.transaction_id || "N/A",
    amount: txn.amount,
    transactionType: "Withdraw Request",
    // For withdrawals, check if txn.time exists (from withdraw model); otherwise, use txn.date (from WithdrawalTransaction model)
    date: moment(txn.time || txn.date).format("YYYY-MM-DD hh:mm:ss A"),
    type: "withdraw",
  }));

  // Merge both transactions and sort them by date (latest first)
  const allTransactions = [...formattedDeposits, ...formattedWithdrawals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Update state with the merged data
  setTransactionHistoryDataAll(allTransactions);
};


  const formatData = (responseData) => {
    const allBids = [
      ...responseData.mainMarketBids,
      ...responseData.starLineBids,
    ];

    const formattedData = allBids.map((bid, index) => {
      const isStarline = bid.market === "Starline";
      let digitValue = "";
      let closeDigitValue = "";
      let sessionValue = "";

      if (isStarline) {
        digitValue = bid.digit; // Starline: keep digit in digit column
      } else {
        if (bid.open) {
          digitValue = bid.digit; // Main Market open: digit in "Digit" column
          sessionValue = "Open";
        }
        if (bid.close) {
          closeDigitValue = bid.digit; // Main Market close: digit in "Close Digits" column
          sessionValue = "Close";
        }
      }

      return {
        key: index + 1,
        sNo: index + 1,
        gameName: bid.gameName || bid.gamename, // Handling inconsistent naming
        market: bid.market,
        gameType: bid.gameType || bid.gametype,
        session: sessionValue || "  ━━━━", // New session column
        digit: digitValue || closeDigitValue,
        // closeDigits: closeDigitValue,
        points: bid.points,
        date: moment(bid.createdAt).format("YYYY-MM-DD hh:mm:ss A"),
      };
    });

    setData(formattedData);
  };

  // Handle WhatsApp icon click to open WhatsApp chat
  const handleWhatsAppClick = () => {
    if (userData?.userWhatsappNumber) {
      window.open(`https://wa.me/+91${userData.userWhatsappNumber}`, "_blank");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  const handleEntriesChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when page size changes
  };
  const winningFilteredData = winningData.filter((record) =>
    Object.values(record).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );
  const getTodaysWinningData = (startIndex, endIndex) => {
    const today = moment().format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format

    const todaysData = winningData.filter((record) => {
      const recordDate = moment(record.date).format("YYYY-MM-DD"); // Extract record date
      return recordDate === today; // Return records that match today's date
    });

    return todaysData.slice(startIndex - 1, endIndex); // Apply pagination
  };


  const filteredWinningData = winningData.filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const depositTransactionColumns = [
    {
      title: "#",
      key: "sno",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Amount ₹",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => {
        const style = {
          display: "inline-block",
          width: "80px",
          height: "30px",
          lineHeight: "30px",
          textAlign: "center",
          borderRadius: "4px",
          backgroundColor: "#e6fffb", // Light cyan for better contrast
          color: "#000",
          fontWeight: "bold",
        };
        return <div style={style}>+ {amount}</div>;
      },
    },
    {
      title: "Request Number",
      dataIndex: "requestNumber",
      key: "requestNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD hh:mm:ss A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          success: "green",
          pending: "orange",
          failed: "red",
        };
        return <Tag color={colorMap[status.toLowerCase()] || "gray"}>{status}</Tag>;
      },
    },
  ];
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(search.toLowerCase()) // ✅ Null check added
    )
  );


 // ✅ Filter transaction data
 const historyFilteredData = transactionHistoryDataAll.filter((item) =>
  Object.values(item).some((value) => {
    if (value !== null && value !== undefined) {
      return value.toString().toLowerCase().includes(search.toLowerCase());
    }
    return false; // Skip null/undefined values
  })
);




  const winningHistoryColumns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
    },
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      key: "bidAmount",
      render: (amount) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>{amount}</span>
      ),
    },
    {
      title: "Winning Amount",
      dataIndex: "winningAmount",
      key: "winningAmount",
      render: (amount) => (
        <span style={{ fontWeight: "bold", color: "#52c41a" }}>{amount}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#52c41a",
            display: "inline-block",
            textAlign: "center",
            minWidth: "80px",
          }}
        >
          Win
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  const filteredDepositTransactions = depositTransactions
  ? depositTransactions.filter((item) =>
      Object.values(item || {}).some((value) => 
        value !== null && value !== undefined && 
        value.toString().toLowerCase().includes((search || "").toLowerCase()) // ✅ Safe search handling
      )
    )
  : []; // ✅ If `depositTransactions` is undefined, return an empty array

  const filteredWithdrawData = withdrawData.filter((item) =>
    Object.values(item).some((value) =>
      value && value.toString().toLowerCase().includes(search.toLowerCase()) // ✅ Null check added
    )
  );

  // Define the columns for the withdrawal transactions table.
  const withdrawColumns = [
    {
      title: "S.No",
      key: "sno",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => {
        const style = {
          display: "inline-block",
          minWidth: "80px",
          textAlign: "center",
          padding: "6px 10px",
          borderRadius: "4px",
          backgroundColor: "#ff4d4f",
          color: "#fff",
          fontWeight: "bold",
        };
        return <span style={style}>- {amount}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD hh:mm:ss A"),
    },
    {
      title: "Request No",
      dataIndex: "requestNumber",
      key: "requestNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const style = {
          display: "inline-block",
          minWidth: "80px",
          textAlign: "center",
          padding: "6px 10px",
          borderRadius: "4px",
          color: "#fff",
          textTransform: "capitalize",
          backgroundColor: "#faad14", // Orange for pending
        };

        return <span style={style}>{status}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Row gutter={[12, 12]} justify="center">
          {/* Accept Button */}
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: "#4CAF50", // Green
              borderColor: "#4CAF50",
              color: "#fff",
              fontWeight: "bold",
              marginRight: "10px", // Added margin between buttons
            }}
            onClick={() => updateWithdrawStatus(record._id, "approved")}
          >
            Accept
          </Button>
    
          {/* Reject Button */}
          <Button
            type="primary"
            icon={<CloseCircleOutlined />}
            style={{
              backgroundColor: "#FF4D4F", // Red
              borderColor: "#FF4D4F",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={() => updateWithdrawStatus(record._id, "rejected")}
          >
            Reject
          </Button>
        </Row>
      ),
    }
  ];

  const allbidHistoryColumns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
    },
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
    },

    {
      title: "Game Type",
      dataIndex: "gameType",
      key: "gameType",
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
    },
    {
      title: "Digit/Pana",
      dataIndex: "digit",
      key: "digit",
    },
    {
      title: "Points ₹",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];


  const walletHistoryData = [
  
  ];
  const getFilteredData = () => {
    return activeTab === "winning"
      ? walletHistoryData.filter((item) => item.transactionType === "Money Added")
      : walletHistoryData;
  };

  const filteredWalletHistoryData = getFilteredData(); // Call function to get data

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredWalletHistoryData.length);

  const transactionHistoryColumnsAll = [
    {
      title: "#",
      key: "sNo",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // ✅ Fix pagination issue
    },
    {
      title: "Request No",
      dataIndex: "requestNumber",
      key: "requestNumber",
      render: (requestNumber) => requestNumber || "N/A", // ✅ Handle missing request numbers
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        const isDeposit = record.type === "deposit";
        const style = {
          padding: "4px 8px",
          borderRadius: "4px",
          color: isDeposit ? "#000" : "#fff",
          display: "inline-block",
          minWidth: "80px",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: isDeposit ? "#d9f7be" : "#ff4d4f", // Green for deposit, red for withdraw
        };
        return (
          <span style={style}>
            {record.type === "withdraw" ? `- ${amount || 0}` : `+ ${amount || 0}`}
          </span>
        );
      },
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text, record) => {
        const isDeposit = record.type === "deposit";
        const style = {
          padding: "6px 12px",
          borderRadius: "4px",
          color: isDeposit ? "#389e0d" : "#ad6800", // Dark green for deposit, dark orange for withdraw
          fontWeight: "bold",
          border: `2px solid ${isDeposit ? "#b7eb8f" : "#ffa940"}`, // Light green for deposit, light orange for withdraw
          backgroundColor: isDeposit ? "#f6ffed" : "#fffbe6", // Light green/yellow bg
          display: "inline-block",
          minWidth: "120px",
          textAlign: "center",
        };
        return <span style={style}>{text || "Unknown"}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => date ? new Date(date).toLocaleString() : "N/A", // ✅ Format date properly
    },
  ];
  
  

  return (
    <div style={{ padding: "20px" }}>
      {/* USER DETAILS Header */}
      <Row align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <ArrowLeftOutlined
            style={{ fontSize: "20px", cursor: "pointer", marginRight: "10px" }}
            onClick={() => window.history.back()}
          // Go back to the previous page
          />
        </Col>
        <Col>
          <Title level={3} style={{ marginBottom: 0 }}>
            USER DETAILS
          </Title>
        </Col>
      </Row>
      {/* Main Row */}
      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} md={10}>
          <Card>
            <Row>
              <Col span={24}>
                <Row
                  justify="space-between"
                  align="middle"
                  style={{ backgroundColor: "#b7b6d9", padding: "20px" }}
                >
                  <Col>
                    <Title level={5} style={{ marginBottom: "5px" }}>
                      {userData.userName}
                    </Title>
                    <Text>
                      <PhoneOutlined /> {userData.phone} &nbsp;
                      <WhatsAppOutlined
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={handleWhatsAppClick}
                      />
                    </Text>
                  </Col>
                  <Col>
                    <Text>
                      Active:{" "}
                      <Badge
                        status={userData.status ? "true" : "false"}
                        text={userData.status ? "Yes" : "No"}
                      />
                    </Text>
                    <br />
                    <Text>
                      Banned:{" "}
                      <Badge
                        // Assuming banned is the opposite of active
                        status={!userData.status ? "false" : "true"}
                        text={!userData.status ? "Yes" : "No"}
                      />
                    </Text>
                  </Col>
                </Row>
                <div style={{ marginTop: "20px" }}>
                  <Text>Available Balance: </Text>
                  <Title level={3}>₹{userData.walletBalance}</Title>
                </div>
                <Row
                  gutter={16}
                  justify="space-evenly"
                  style={{ marginTop: "10px" }}
                >
                  <Col span={10}>
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: "green", borderColor: "green" }}
                      onClick={() => openModal("add")}
                    >
                      Add Fund
                    </Button>
                  </Col>
                  <Col span={10}>
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: "red", borderColor: "red" }}
                      onClick={() => openModal("withdraw")}
                    >
                      Withdraw Fund
                    </Button>
                  </Col>
                </Row>

                {/* Modal for entering the amount */}
                <Modal
                  title={actionType === "add" ? "Add Fund" : "Withdraw Fund"}
                  visible={modalVisible}
                  onCancel={closeModal}
                  onOk={handleSubmit}
                  okText="Submit"
                >
                  <Form layout="vertical">
                    <Form.Item label="Amount">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </Form.Item>
                  </Form>
                </Modal>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} md={14}>
          <Card>
            <Row>
              <Col span={24}>
                <Title level={5}>Personal Information</Title>
                <Row
                  justify="space-between"
                  gutter={[0, 10]}
                  style={{ marginTop: "10px" }}
                >
                  <Col span={12}>
                    <Text strong>Full Name:</Text>{" "}
                    <Text>{userData.userName}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Mobile:</Text> <Text>{userData.phone}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Security Pin:</Text>{" "}
                    <Text>{userData.securityPin}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Password:</Text> <Text>******</Text>
                    {/* Password is typically not sent back from the API */}
                  </Col>
                </Row>
              </Col>
              <Col span={24} style={{ marginTop: "20px" }}>
                <Title level={5}>Payment Information</Title>
                <Row gutter={[0, 10]} style={{ marginTop: "10px" }}>
                  <Col span={12}>
                    <Text strong>Bank Name:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>
                        {userData.bank_details?.bank_name &&
                          userData.bank_details.bank_name !== "Null"
                          ? userData.bank_details.bank_name
                          : "N/A"}
                      </Text>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Text strong>A/c Holder Name:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>{userData.userName}</Text>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Text strong>A/c Number:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>
                        {userData.bank_details?.account_number &&
                          userData.bank_details.account_number !== "Null"
                          ? userData.bank_details.account_number
                          : "N/A"}
                      </Text>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Text strong>IFSC Code:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>
                        {userData.bank_details?.ifsc_code &&
                          userData.bank_details.ifsc_code !== "Null"
                          ? userData.bank_details.ifsc_code
                          : "N/A"}
                      </Text>
                    </span>
                  </Col>
                  {/* Since PhonePe, Google Pay, and Paytm details are not provided in the API, we default to N/A */}
                  <Col span={12}>
                    <Text strong>PhonePe No.:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>N/A</Text>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Text strong>Google Pay No.:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>N/A</Text>
                    </span>
                  </Col>
                  <Col span={12}>
                    <Text strong>Paytm No.:</Text>{" "}
                    <span style={{ marginLeft: "20px" }}>
                      <Text>N/A</Text>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Add Fund Request List */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card>
            <Title level={5}>Add Fund Request List</Title>

            {/* Search & Entries Selection */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                className="border px-3 py-2 rounded w-1/3"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                defaultValue={10}
                onChange={(value) => setEntries(value)}
                style={{ width: 120 }}
              >

                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={30}>30</Option>
                <Option value={40}>40</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>

            {/* Table */}
            <Table
              columns={depositTransactionColumns}
              dataSource={filteredDepositTransactions}
              rowKey="_id"
              pagination={{ pageSize: entries }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>
      </Row>
      <div style={{ padding: "20px" }}>
        {/* Withdraw Fund Request List */}
        <Card style={{ marginBottom: "20px" }}>
          <Row justify="space-between" align="middle">
            <Title level={5}>Withdraw Fund Request List</Title>
            <div className="flex justify-between mb-4">
              <div>
                Show{" "}
                <Select
                  value={entries.toString()} // Ensure it's a string
                  style={{ width: 80 }}
                  onChange={(value) => setEntries(parseInt(value))}
                >
                  <Option value="10">10</Option>
                  <Option value="25">25</Option>
                  <Option value="50">50</Option>
                </Select>{" "}
                entries
              </div>


            </div>
          </Row>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-1/3 mb-4"
          />

          {/* 🔍 Search Box */}

          {/* 📝 Table with filtered data */}
          <Table
        columns={withdrawColumns}
        dataSource={withdrawData}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
        </Card>

        {/* Bid History */}

        <Card style={{ marginBottom: "20px" }}>
          <Row justify="space-between" align="middle">
            <Title level={5}>Bid History</Title>
            <div>
              Show{" "}
              <Select
                value={entries.toString()}
                style={{ width: 80 }}
                onChange={(value) => setEntries(parseInt(value))}
              >
                <Option value="10">10</Option>
                <Option value="25">25</Option>
                <Option value="50">50</Option>
              </Select>{" "}
              entries
            </div>
          </Row>

          {/* 🔍 Search Box */}
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-1/3 mb-4"


          />

          {/* 📝 Table with filtered data */}
          <Table
            columns={allbidHistoryColumns}
            dataSource={filteredData}
            pagination={{ pageSize: entries }}
            loading={loading}
            rowKey="_id"
            scroll={{ x: 1000 }}
          />
        </Card>

      
        <div style={{ padding: "20px" }}>
    
          <Card style={{ marginBottom: "20px" }}>
            <Tabs defaultActiveKey="all">
              {/* All Winning History */}
              <TabPane tab="All" key="all">
                <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
                  <Title level={5}>Winning History</Title>
                  <div>
                    Show{" "}
                    <Select
                      defaultValue="10"
                      style={{ width: 80 }}
                      onChange={handleEntriesChange}
                    >
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={20}>20</Option>
                      <Option value={50}>50</Option>
                    </Select>{" "}
                    entries
                  </div>
                </Row>
                {/* Search Input */}
                <Input
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ marginBottom: "10px", width: "250px" }}
                />
                {/* Table */}
                <Table
                  columns={winningHistoryColumns}
                  dataSource={filteredData.slice(startIndex - 1, endIndex)}
                  pagination={{
                    pageSize: entries,
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page),
                  }}
                  loading={loading}
                  scroll={{ x: 1000 }}
                />
                <div style={{ marginTop: "10px", textAlign: "right" }}>
                  {`Showing ${startIndex} to ${endIndex} of ${filteredData.length} entries`}
                </div>
              </TabPane>

              {/* Today's Winning History */}
              <TabPane tab="Winning History" key="winning">
                <Row justify="space-between" align="middle">
                  <Title level={5}>Today's Winning History</Title>
                </Row>
                <Table
                  columns={winningHistoryColumns}
                  dataSource={getTodaysWinningData().slice(startIndex - 1, endIndex)}
                  pagination={{
                    pageSize: entries,
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page),
                  }}
                />
                <div style={{ marginTop: "10px", textAlign: "right" }}>
                  {`Showing ${startIndex} to ${endIndex} of ${getTodaysWinningData().length} entries`}
                </div>
              </TabPane>
            </Tabs>
          </Card>
          {/* Wallet Transaction History */}
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: "10px" }}>
              <Title level={5}>Wallet Transaction History</Title>
              <div>
                Show{" "}
                <Select
                  value={entries.toString()}
                  style={{ width: 80 }}
                  onChange={(value) => setEntries(parseInt(value))}
                >
                  <Option value="10">10</Option>
                  <Option value="25">25</Option>
                  <Option value="50">50</Option>
                </Select>{" "}
                entries
              </div>
            </Row>

            {/* 🔍 Search Box */}
            <Input
              placeholder="Search Transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: "10px", width: "30%" }}
            />
            {/* 📝 Transaction Table */}
            <Table
  columns={transactionHistoryColumnsAll}
  dataSource={historyFilteredData}
  pagination={{
    pageSize: entries,
    current: currentPage,
    onChange: (page) => setCurrentPage(page),
  }}
  loading={loading}
  rowKey="key"
  scroll={{ x: 1000 }}
/>;

            {/* 📊 Showing Entries Count */}
            <div style={{ marginTop: "10px", textAlign: "right" }}>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
