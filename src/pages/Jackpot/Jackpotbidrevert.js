
import React, { useState, useEffect } from "react";
import {
  Form,
  DatePicker,
  Select,
  Button,
  Table,
  Typography,
  Card,
  message,
  Modal,
  Spin
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const JackpotBidRevert = () => {
  const [form] = Form.useForm();
  const [gameOptions, setGameOptions] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState({});
  const [revertingAll, setRevertingAll] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://maya-api.kglame.com/api/jackpotMarket/getAllMarket",
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        setGameOptions(res.data.data || []);
      } catch (err) {
        message.error("Error loading game list");
      }
    };
    fetchGames();
  }, []);

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        date: dayjs(values.date).format("DD-MM-YYYY"),
        gamename: values.gamename.split(" [")[0].trim(),
        gametype: "jodi_digit",
        market: "Jackpot",
        reverted: false, // Explicitly request only non-reverted bids
        _fresh: Date.now() // Prevent caching
      };

      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post(
        "https://maya-api.kglame.com/api/jackpotBid/filterBids",
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (res.data.success) {
        // No need for client-side filtering since API handles it
        setBids(res.data.bids || []);
      } else {
        setBids([]);
        message.warning("No active bids found");
      }
    } catch (err) {
      message.error("Error filtering bids");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (bidId) => {
    try {
      setReverting(prev => ({ ...prev, [bidId]: true }));

      // Optimistic UI update
      setBids(prev =>
        prev.map(bid =>
          bid.bidId === bidId ? { ...bid, reverted: true } : bid
        )
      );

      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `https://maya-api.kglame.com/api/jackpotBid/revertBid/${bidId}`,
        { bidIds: [bidId] },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      message.success("Bid reverted and amount refunded");

      // Refresh data after 1 second to confirm
      setTimeout(() => {
        handleSearch();
      }, 1000);
    } catch (err) {
      // Rollback UI if API fails
      setBids(prev =>
        prev.map(bid =>
          bid.bidId === bidId ? { ...bid, reverted: false } : bid
        )
      );
      message.error(err.response?.data?.message || "Error reverting bid");
    } finally {
      setReverting(prev => ({ ...prev, [bidId]: false }));
    }
  };

  const handleRevertAll = () => {
    Modal.confirm({
      title: "Revert All Bids?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to revert all visible bids? This action cannot be undone.",
      okText: "Yes, Revert All",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setRevertingAll(true);
          const accessToken = localStorage.getItem("accessToken");

          // Optimistic update
          setBids(prev =>
            prev.map(bid => ({ ...bid, reverted: true }))
          );

          const revertPromises = bids.map(bid =>
            axios.put(
              `https://maya-api.kglame.com/api/jackpotBid/revertBid/${bid.bidId}`,
              {},
              {
                headers: { Authorization: `Bearer ${accessToken}` }
              }
            )
          );

          await Promise.all(revertPromises);

          message.success("All bids reverted successfully!");
          handleSearch();
        } catch (err) {
          // Rollback UI if API fails
          setBids(prev =>
            prev.map(bid => ({ ...bid, reverted: false }))
          );
          message.error("Error reverting all bids");
        } finally {
          setRevertingAll(false);
        }
      }
    });
  };

  const columns = [
    { title: "#", render: (_, __, i) => i + 1 },
    { title: "User", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "Digit", dataIndex: "number" },
    { title: "Points", dataIndex: "points" },
    { title: "Bid ID", dataIndex: "bidId" },
    {
      title: "Status",
      render: (_, record) =>
        record.reverted ? (
          <span style={{ color: "red" }}>Reverted</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        )
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="dashed"
          danger
          loading={reverting[record.bidId]}
          disabled={record.reverted || reverting[record.bidId]}
          onClick={() => handleRevert(record.bidId)}
        >
          {record.reverted ? "Reverted" : "Revert"}
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Jackpot Bid Revert Panel</Title>
      <Card>
        <Form form={form} layout="inline">
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker format="DD-MM-YYYY" style={{ width: 150 }} />
          </Form.Item>

          <Form.Item
            label="Game Name"
            name="gamename"
            rules={[{ required: true, message: "Select game" }]}
          >
            <Select
              placeholder="Select game"
              style={{ width: 250 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {gameOptions.map((g) => (
                <Option
                  key={g._id}
                  value={`${g.game_name} [ ${dayjs(
                    g.open_time,
                    "hh:mm:ssA"
                  ).format("hh:mm A")} ]`}
                >
                  {g.game_name} [ {dayjs(g.open_time, "hh:mm:ssA").format("hh:mm A")} ]
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSearch} loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            danger
            onClick={handleRevertAll}
            disabled={bids.length === 0 || revertingAll}
            loading={revertingAll}
          >
            Revert All Bids
          </Button>
          <span style={{ marginLeft: 8 }}>
            {bids.length > 0 && `Showing ${bids.length} active bids`}
          </span>
        </div>

        <Table
          dataSource={bids}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey="bidId"
          locale={{
            emptyText: (
              <div style={{ padding: 20 }}>
                {loading ? (
                  <Spin tip="Loading bids..." />
                ) : (
                  "No active bids found for the selected criteria"
                )}
              </div>
            )
          }}
        />
      </Card>
    </div>
  );
};

export default JackpotBidRevert;