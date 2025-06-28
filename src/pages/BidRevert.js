import React, { useState, useEffect } from "react";
import {
  Table, Button, Form, Select, DatePicker, message, Typography,
  Card, Divider, Row, Col, Tag, Tooltip
} from "antd";
import instance from "../utils/axiosInstance";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const BidRevert = () => {
  const [form] = Form.useForm();
  const [marketGameList, setMarketGameList] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRevert, setLoadingRevert] = useState(false);
  const [revertResult, setRevertResult] = useState(null);

  useEffect(() => {
    fetchMarketGameList();
  }, []);

  const fetchMarketGameList = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/marketManagement/getMarketGames`);
      if (response?.data) {
        const uniqueMarkets = [...new Set(response.data.map(item => item.marketName))];
        setMarketGameList(uniqueMarkets);
      }
    } catch (error) {
      message.error("Failed to fetch market list");
    } finally {
      setLoading(false);
    }
  };

  const handleMarketChange = async (market) => {
    try {
      const response = await instance.get(`/api/marketManagement/getMarketGames?marketName=${market}`);
      if (response?.data) {
        const games = [...new Set(response.data.map(item => item.gameName))];
        setGameOptions(games);
        form.setFieldsValue({ gameName: null }); // reset gameName if market changes
      }
    } catch (error) {
      message.error("Failed to fetch games for selected market");
    }
  };

  const handleRevertBids = async () => {
    try {
      setLoadingRevert(true);
      const values = await form.validateFields();

      const payload = {
        market: values.marketGame,
        gameName: values.gameName,
        gameType: values.gameType,
        date: values.resultDate.format("YYYY-MM-DD")
      };

      const response = await instance.post("/api/bid/revertBid", payload);

      if (response.data.success) {
        setRevertResult(response.data);
        message.success(
          `Reverted ${response.data.totalBids} bids totaling ${response.data.totalAmount} points. Wallets updated.`
        );
      } else if (response.status === 207) {
        setRevertResult(response.data);
        message.warning(
          `Partial Success: ${response.data.totalBids} bids reverted totaling ${response.data.totalAmount}. ` +
          `${response.data.failedUpdates.length} user wallet updates failed.`
        );
      } else {
        message.error(response.data.message || "Failed to revert bids");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error reverting bids");
    } finally {
      setLoadingRevert(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card title={<Title level={4}>Revert Bids</Title>} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="marketGame" label="Market" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Market"
                  onChange={handleMarketChange}
                  loading={loading}
                >
                  {marketGameList.map((market) => (
                    <Select.Option key={market} value={market}>
                      {market}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="gameName" label="Game" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Game"
                  disabled={!gameOptions.length}
                >
                  {gameOptions.map((game) => (
                    <Select.Option key={game} value={game}>
                      {game}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="gameType" label="Type" rules={[{ required: true }]}>
                <Select placeholder="Select Type">
                  <Select.Option value="open">Open</Select.Option>
                  <Select.Option value="close">Close</Select.Option>
                  <Select.Option value="all">All</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="resultDate"
            label="Date"
            initialValue={dayjs()}
            rules={[{ required: true, message: "Please select a result date" }]}
          >
            <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Button
            type="primary"
            onClick={handleRevertBids}
            loading={loadingRevert}
            style={{ width: 200 }}
          >
            Revert Bids
          </Button>
        </Form>

        {revertResult && (
          <div style={{ marginTop: 24 }}>
            <Divider orientation="left">Revert Summary</Divider>
            <Text strong>Total Bids: </Text>
            <Text>{revertResult.totalBids}</Text><br />
            <Text strong>Total Points: </Text>
            <Text>{revertResult.totalAmount}</Text>

            <Divider orientation="left">User Wallet Update Status</Divider>
            <Table
              columns={[
                { title: "User ID", dataIndex: "userId" },
                { title: "Username", dataIndex: "userName" },
                {
                  title: "Points Added",
                  dataIndex: "totalAmount",
                  render: (amount) => <span style={{ color: "green" }}>+{amount}</span>
                },
                {
                  title: "Status",
                  render: (_, record) => {
                    const updateResult =
                      revertResult.walletUpdates?.find(u => u.userId === record.userId) ||
                      revertResult.failedUpdates?.find(u => u.userId === record.userId);
                    return updateResult?.success ? (
                      <Tag color="green">Success</Tag>
                    ) : (
                      <Tooltip title={updateResult?.error}>
                        <Tag color="red">Failed</Tag>
                      </Tooltip>
                    );
                  }
                }
              ]}
              dataSource={revertResult.usersSummary}
              rowKey="userId"
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default BidRevert;
