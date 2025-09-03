// File: src/components/TotalBidsList.js

import React, { useState, useEffect } from "react";
import { Table, Spin, message, Card, Typography } from "antd";
import { useLocation } from "react-router-dom";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title } = Typography;

const TotalBidsList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchBids = async () => {
      const params = new URLSearchParams(location.search);
      const date = params.get("date");

      if (!date) {
        message.error("Date is missing from the URL.");
        setLoading(false);
        return;
      }

      const parsedUrlDate = dayjs(date, "DD-MM-YYYY");
      
      setLoading(true);
      try {
        const response = await instance.get(`/api/bid/getAllBid`);

        // Correctly handle the API response which is a direct array
        if (Array.isArray(response.data)) {
          // Filter the bids to show only those matching the selected date
          const filteredBids = response.data.filter(
            (bid) => {
              if (!bid.createdAt) return false;
              return parsedUrlDate.isSame(dayjs(bid.createdAt), 'day');
            }
          );
          
          setBids(filteredBids);
        } else {
          message.error("Invalid response format from the server.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        message.error("An error occurred while fetching bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [location.search]);

  const columns = [
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Session", dataIndex: "session", key: "session" },
    { title: "Points", dataIndex: "points", key: "points" },
    { 
      title: "Date", 
      dataIndex: "createdAt", 
      key: "createdAt",
      render: (text) => dayjs(text).format("DD-MM-YYYY")
    },
    { 
      title: "Time", 
      dataIndex: "createdAt", 
      key: "time",
      render: (text) => dayjs(text).format("hh:mm A")
    },
  ];
  
  const totalBidsAmount = bids.reduce((sum, bid) => sum + (bid.points || 0), 0);

  return (
    <Card>
      <Title level={4}>
        Total Bids on {new URLSearchParams(location.search).get("date")}
      </Title>
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={2}>
          Total Bid Amount: ₹{totalBidsAmount}
        </Typography.Title>
      </div>
      {loading ? (
        <Spin tip="Loading bids..." />
      ) : (
        <Table
          columns={columns}
          dataSource={bids}
          rowKey="_id"
          scroll={{ x: true }}
        />
      )}
    </Card>
  );
};

export default TotalBidsList;