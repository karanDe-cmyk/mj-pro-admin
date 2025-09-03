// File: src/components/TotalWinsList.js

import React, { useState, useEffect } from "react";
import { Table, Spin, message, Card, Typography } from "antd";
import { useLocation } from "react-router-dom";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs"; // Import dayjs

const { Title } = Typography;

const TotalWinsList = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchWins = async () => {
      const params = new URLSearchParams(location.search);
      const date = params.get("date");

      if (!date) {
        message.error("Date is missing from the URL.");
        setLoading(false);
        return;
      }
      
      // Convert the date from the URL (DD-MM-YYYY) to the API's format (YYYY-MM-DD)
      const formattedDate = dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");

      setLoading(true);
      try {
        const response = await instance.get(
          "/api/mainmarketdeclareResult/getDeclareResult"
        );

        if (response.data.success && response.data.results) {
          const allWinners = response.data.results.reduce((acc, result) => {
            // Use the newly formatted date for comparison
            if (result.date === formattedDate && result.winners && result.winners.length > 0) {
              const gameName = result.gameName;
              const winningDigit = result.digit;
              
              const winnersWithGameInfo = result.winners.map(winner => ({
                ...winner,
                key: winner._id,
                gameName,
                winningDigit,
                date: result.date
              }));
              return acc.concat(winnersWithGameInfo);
            }
            return acc;
          }, []);

          setWins(allWinners);
        } else {
          message.error(response.data.message || "Failed to fetch winning results.");
        }
      } catch (error) {
        console.error("Error fetching winning results:", error);
        message.error("An error occurred while fetching winning results.");
      } finally {
        setLoading(false);
      }
    };

    fetchWins();
  }, [location.search]);

  const columns = [
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Winning Amount", dataIndex: "winningPoints", key: "winningPoints" },
    { title: "Winning Digit", dataIndex: "winningDigit", key: "winningDigit" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const totalWinnings = wins.reduce(
    (sum, item) => sum + (item.winningPoints || 0),
    0
  );

  return (
    <Card>
      <Title level={4}>
        Total Winnings on {new URLSearchParams(location.search).get("date")}
      </Title>
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={2}>
          Total Winnings: ₹{totalWinnings}
        </Typography.Title>
      </div>
      {loading ? (
        <Spin tip="Loading winnings..." />
      ) : (
        <Table
          columns={columns}
          dataSource={wins}
          rowKey="key"
          scroll={{ x: true }}
        />
      )}
    </Card>
  );
};

export default TotalWinsList;