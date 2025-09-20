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
  Spin,
  Space
} from "antd";
import axios from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        const res = await axios.get("/api/jackpotMarket/getAllMarket");
        setGameOptions(res.data.data || []);
      } catch (err) {
        message.error("Error loading game list");
      }
    };
    fetchGames();

    // Set default date to today
    form.setFieldsValue({
      date: dayjs()
    });
  }, [form]);

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Parse gamename and open_time from the selected value
      const [gamename, open_time] = values.gamename.split("|");

      const payload = {
        date: dayjs(values.date).format("DD-MM-YYYY"),
        gamename: gamename.trim(),
        gametype: "jodi_digit",
        market: "Jackpot",
        reverted: false,
        open_time: open_time.trim(),
        _fresh: Date.now()
      };

      console.log("Sending payload:", payload);

      const res = await axios.post("/api/jackpotBid/filterBids", payload);

      if (res.data.success) {
        setBids(res.data.bids || []);
        if (res.data.bids.length === 0) {
          message.info("No active bids found for the selected criteria");
        }
      } else {
        setBids([]);
        message.warning(res.data.message || "No active bids found");
      }
    } catch (err) {
      console.error("Filter error:", err);
      message.error(err.response?.data?.message || "Error filtering bids");
    } finally {
      setLoading(false);
    }
  };

  const handleRevertAndDelete = async (bidId) => {
    try {
      setReverting(prev => ({ ...prev, [bidId]: true }));

      // First revert the bid (refund amount)
      await axios.put(`/api/jackpotBid/revertBid/${bidId}`, { bidIds: [bidId] });

      // Then delete the bid
      // await axios.delete(`/api/jackpotBid/deleteBid/${bidId}`);

      // Remove the bid from the UI immediately
      setBids(prev => prev.filter(bid => bid.bidId !== bidId));

      toast.success("Bid reverted, amount refunded, and bid deleted successfully");
    } catch (err) {
      console.error("Error in revert and delete:", err);
      message.error(err.response?.data?.message || "Error processing bid");
    } finally {
      setReverting(prev => ({ ...prev, [bidId]: false }));
    }
  };

  const handleRevertAll = () => {
    if (bids.length === 0) {
      message.warning("No bids to revert");
      return;
    }

    Modal.confirm({
      title: "Revert and Delete All Bids?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to revert and delete all visible bids? This action cannot be undone.",
      okText: "Yes, Revert & Delete All",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setRevertingAll(true);

          const revertAndDeletePromises = bids.map(bid =>
            axios.put(`/api/jackpotBid/revertBid/${bid.bidId}`)
              .then(() => axios.delete(`/api/jackpotBid/deleteBid/${bid.bidId}`))
          );

          await Promise.all(revertAndDeletePromises);

          // Clear all bids from UI
          setBids([]);

          message.success("All bids reverted and deleted successfully!");
        } catch (err) {
          console.error("Error in revert all:", err);
          message.error("Error reverting and deleting all bids");
        } finally {
          setRevertingAll(false);
        }
      }
    });
  };

  const columns = [
    {
      title: "#",
      render: (_, __, i) => i + 1,
      width: 50
    },
    {
      title: "User",
      dataIndex: "username",
      width: 100
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      ellipsis: true
    },
    {
      title: "Digit",
      dataIndex: "number",
      width: 80
    },
    {
      title: "Points",
      dataIndex: "points",
      width: 80
    },
    {
      title: "Bid ID",
      dataIndex: "bidId",
      width: 200,
      ellipsis: true
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <Button
          type="dashed"
          danger
          size="small"
          loading={reverting[record.bidId]}
          onClick={() => handleRevertAndDelete(record.bidId)}
        >
          Revert & Delete
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
            <DatePicker
              format="DD-MM-YYYY"
              style={{ width: 150 }}
              disabledDate={(current) => {
                // Can not select days after today
                return current && current > dayjs().endOf('day');
              }}
            />
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
              {gameOptions.map((g) => {
                const openTimeFormatted = dayjs(g.open_time, "hh:mm:ssA").format("hh:mm A");
                return (
                  <Option
                    key={g._id}
                    value={`${g.game_name}|${g.open_time}`}
                  >
                    {g.game_name} [ {openTimeFormatted} ]
                  </Option>
                );
              })}
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
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              type="primary"
              danger
              onClick={handleRevertAll}
              disabled={bids.length === 0 || revertingAll}
              loading={revertingAll}
            >
              Revert & Delete All Bids
            </Button>
            <span>
              {bids.length > 0 ? `Showing ${bids.length} active bids` : 'No bids found'}
            </span>
          </Space>
        </div>

        <Table
          dataSource={bids}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey="bidId"
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div style={{ padding: 20, textAlign: 'center' }}>
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