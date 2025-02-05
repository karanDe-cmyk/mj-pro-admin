import React from "react";
import { Card, Form, Select, Input, Button, Table, Typography } from "antd";

const { Title } = Typography;

const DeclareResult = () => {
  const winMembers = [
    {
      key: 1,
      member: "John Doe",
      gameName: "Game A",
      betDigit: "123",
      betAmount: 500,
      winningAmount: 1000,
    },
    {
      key: 2,
      member: "Jane Smith",
      gameName: "Game B",
      betDigit: "456",
      betAmount: 300,
      winningAmount: 800,
    },
  ];

  const gameResults = [
    {
      key: 1,
      gameName: "Kalyan Morning",
      openPana: "-",
      closePana: "-",
    },
    {
      key: 2,
      gameName: "Sridevi",
      openPana: "-",
      closePana: "-",
    },
  ];

  const winMemberColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Member",
      dataIndex: "member",
      key: "member",
      align: "center",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      align: "center",
    },
    {
      title: "Bet Digit",
      dataIndex: "betDigit",
      key: "betDigit",
      align: "center",
    },
    {
      title: "Bet Amount",
      dataIndex: "betAmount",
      key: "betAmount",
      align: "center",
    },
    {
      title: "Winning Amount",
      dataIndex: "winningAmount",
      key: "winningAmount",
      align: "center",
    },
  ];

  const gameResultColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      align: "center",
    },
    {
      title: "Open Pana",
      dataIndex: "openPana",
      key: "openPana",
      align: "center",
    },
    {
      title: "Open Action",
      key: "openAction",
      render: () => (
        <Button type="link" danger>
          Delete Result
        </Button>
      ),
      align: "center",
    },
    {
      title: "Close Pana",
      dataIndex: "closePana",
      key: "closePana",
      align: "center",
    },
    {
      title: "Close Action",
      key: "closeAction",
      render: () => (
        <Button type="link" danger>
          Delete Result
        </Button>
      ),
      align: "center",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-md">
        {/* Select Game Section */}
        <Title level={4}>Select Game</Title>
        <Form layout="vertical" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Form.Item label="Result Date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Game Name">
            <Select placeholder="Select Game">
              <Select.Option value="gameA">Game A</Select.Option>
              <Select.Option value="gameB">Game B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Session">
            <Select placeholder="Select Session">
              <Select.Option value="morning">Morning</Select.Option>
              <Select.Option value="evening">Evening</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Number">
            <Select placeholder="Select Number">
              <Select.Option value="123">123</Select.Option>
              <Select.Option value="456">456</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button type="primary" className="w-full">
            Declare Result
          </Button>
          <Button type="default" className="w-full">
            Show Winner List
          </Button>
        </div>

        {/* Win Member Section */}
        <Title level={4} className="mt-8">
          Win Member
        </Title>
        <Table
          dataSource={winMembers}
          columns={winMemberColumns}
          pagination={false}
          bordered
          className="mt-4"
        />

        {/* Game Result History Section */}
        <Title level={4} className="mt-8">
          Game Result History - 27-01-2025
        </Title>
        <Table
          dataSource={gameResults}
          columns={gameResultColumns}
          pagination={false}
          bordered
          className="mt-4"
        />
      </Card>
    </div>
  );
};

export default DeclareResult;
