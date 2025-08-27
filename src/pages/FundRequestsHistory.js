// src/pages/FundRequestsHistory.jsx
import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Spin, message } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const FundRequestsHistory = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundRequests = async () => {
      try {
        const response = await instance.get("/api/admin/fundRequests");
        setFundRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching fund requests:", error);
        setError("Failed to fetch fund requests.");
        message.error("Failed to fetch fund requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundRequests();
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
      title: "Type",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Title level={4}>Fund Requests History</Title>
        {loading ? (
          <Spin />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table
            columns={fundRequestColumns}
            dataSource={fundRequests}
            rowKey="_id"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default FundRequestsHistory;