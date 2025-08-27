// src/pages/ManualDepositsHistory.jsx
import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Spin, message } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ManualDepositsHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await instance.get("/api/manualDeposit");
        setData(res.data || []);
      } catch (error) {
        console.error("Failed to fetch manual deposit transactions:", error);
        setError("Failed to fetch manual deposit transactions.");
        message.error("Failed to fetch manual deposit transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  const fundRequestColumnsManualDeposit = [
    {
      title: "#",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Txn ID",
      dataIndex: "transactionId",
      key: "transactionId",
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
        <Title level={4}>Manual Deposits History</Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table
            columns={fundRequestColumnsManualDeposit}
            dataSource={data}
            rowKey="_id"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ManualDepositsHistory;