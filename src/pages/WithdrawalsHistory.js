// src/pages/WithdrawalsHistory.jsx
import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Spin, message, Button } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const WithdrawalsHistory = () => {
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/api/users/todaywithdrawals`);
      setWithdrawalHistory(response.data || []);
    } catch (err) {
      console.error("Error fetching withdrawal requests:", err);
      setError("Failed to fetch withdrawal requests.");
      message.error("Failed to fetch withdrawal requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await instance.patch(`api/users/withdrawals/status/${id}`, { status });
      setWithdrawalHistory((prevHistory) => prevHistory.filter((item) => item._id !== id));
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
      render: (status) => status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "time",
      render: (createdAt) => moment(createdAt || new Date()).format("DD-MM-YYYY HH:mm:ss"),
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
            <Button
              onClick={() => handleStatusChange(record._id, "approved")}
              style={{
                marginRight: "8px",
                backgroundColor: "#1677FF",
                color: "white",
              }}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleStatusChange(record._id, "rejected")}
              style={{
                backgroundColor: "#F14646",
                color: "white",
              }}
            >
              Reject
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Title level={4}>Withdrawals History</Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
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

export default WithdrawalsHistory;