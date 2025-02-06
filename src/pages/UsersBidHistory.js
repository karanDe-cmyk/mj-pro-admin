import React, { useState } from "react";
import { Form, Input, Select, Button, Table } from "antd";

const UserBidHistory = () => {
  const [filters, setFilters] = useState({
    date: "2025-01-20",
    marketName: "",
    gameName: "",
  });

  const [bidHistory, setBidHistory] = useState([]);

  const markets = ["Market 1", "Market 2", "Market 3"];
  const games = ["Game 1", "Game 2", "Game 3"];

  const onFinish = (values) => {
    console.log("Filters applied:", values);
    setFilters(values);

    const filteredData = [
      {
        key: 1,
        userMobile: "1234567890",
        gameName: "Game 1",
        paanaAndDigit: "Paana 123",
        points: 100,
        date: "2025-01-20",
        time: "10:00 AM",
        type: "Win",
        marketName: "Market 1",
        marketId: "67a3ce7b8839492bead72949",
        gameType: "singlePanna",
        userId: "679dd90b54da3c7826d80190",
        email: "amrit100@gmail.com",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNTZjZTJiMy1hYWI5LTQzY2UtYWY2Yi04YjljZmJlNzMwOWIiLCJlbWFpbCI6ImFtcml0MTAwQGdtYWlsLmNvbSIsImlhdCI6MTczODM5ODAwNX0.hWP471Ugu0y5c3IZ0VLYRNWL1eQ3UKLdGCXqe4fnY9c",
        digit: 1,
        panna: 123,
        market: "open",
        win: "true",
      },
    ];
    setBidHistory(filteredData);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "User  Mobile",
      dataIndex: "userMobile",
      key: "userMobile",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
    },
    {
      title: "Paana and Digit",
      dataIndex: "paanaAndDigit",
      key: "paanaAndDigit",
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="primary">Bid Reverse</Button>
      ),
    },
    {
      title: "Market Name",
      dataIndex: "marketName",
      key: "marketName",
    },
    {
      title: "Market ID",
      dataIndex: "marketId",
      key: "marketId",
    },
    {
      title: "Game Type",
      dataIndex: "gameType",
      key: "gameType",
    },
    {
      title: "User  ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },
    {
      title: "Digit",
      dataIndex: "digit",
      key: "digit",
    },
    {
      title: "Panna",
      dataIndex: "panna",
      key: "panna",
    },
    {
      title: "Market Status",
      dataIndex: "market",
      key: "market",
    },
    {
      title: "Win Status",
      dataIndex: "win",
      key: "win",
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">Bid History Report</h1>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Select Date" name="date">
            <Input type="date" value={filters.date} />
          </Form.Item>
          <Form.Item label="Market Name" name="marketName">
            <Select>
              <Select.Option value="">- Please Select Market Name -</Select.Option>
              {markets.map((market, index) => (
                <Select.Option key={index} value={market}>
                  {market}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Game Name" name="gameName">
            <Select>
              <Select.Option value="">- Please Select Game Name -</Select.Option>
              {games.map((game, index) => (
                <Select.Option key={index} value={game}>
                  {game}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Bid History List</h2>
        <Table columns={columns} dataSource={bidHistory} />
      </div>
    </div>
  );
};

export default UserBidHistory;