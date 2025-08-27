// src/pages/AutoDepositHistory.jsx
import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Spin, message } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AutoDepositHistory = () => {
  const [autoDepositHistory, setAutoDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        const response = await instance.get("/api/userPayment/getpaymentResponse");
        setAutoDepositHistory(response.data.data || []);
      } catch (err) {
        console.error("Error fetching auto deposit history:", err);
        setError("Failed to fetch auto deposit history. Please try again.");
        message.error("Failed to fetch auto deposit history.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, []);

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
      render: (createdAt) => moment(createdAt || new Date()).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Title level={4}>Auto Deposit History</Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table
            columns={fundRequestColumns}
            dataSource={autoDepositHistory}
            rowKey="_id"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AutoDepositHistory;