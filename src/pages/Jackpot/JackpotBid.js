import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Card,
  Typography,
  message,
  Modal,
} from "antd";
import axios from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;
const { Title } = Typography;

const BidHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [gameOptions, setGameOptions] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGameMarkets = async () => {
      try {
        const response = await axios.get("/api/jackpotMarket/getAllMarket");

        if (response.data && Array.isArray(response.data.data)) {
          // Unique key banaye har option ke liye
          const optionsWithUniqueKeys = response.data.data.map((game, index) => ({
            ...game,
            uniqueKey: `${game.game_name}_${game.open_time}_${index}`
          }));
          setGameOptions(optionsWithUniqueKeys);
        }
      } catch (error) {
        console.error("Error fetching game markets:", error);
        message.error("Error fetching game markets");
      }
    };

    fetchGameMarkets();
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  const handleFilterBids = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!values.gameName) {
        message.error("Please select a game");
        setLoading(false);
        return;
      }

      // Extract game name and time from the selected value
      const [gameName, gameTime] = values.gameName.split('|');

      const payload = {
        date: dayjs(values.date).format("DD-MM-YYYY"),
        gamename: gameName.trim(),
        gametype: "jodi_digit",
        open_time: gameTime.trim(), // Add open_time to payload
      };

      const response = await axios.post(
        "/api/jackpotBid/filterBids",
        payload
      );

      if (response.data.success && Array.isArray(response.data.bids)) {
        const bidsWithKey = response.data.bids.map((bid, index) => ({
          ...bid,
          key: bid.bidId || index,
        }));
        setBidData(bidsWithKey);
        toast.success("Bids filtered successfully");
      } else {
        message.warning("No bids found");
        setBidData([]);
      }
    } catch (error) {
      console.error("Filter error:", error);
      message.error("Error filtering bids");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (record) => {
    setEditingBid(record);
    editForm.setFieldsValue({
      points: record.points,
      newDigit: record.number,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBid = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        points: values.points,
        digit: values.newDigit, // Changed from 'pana' to 'digit' to match backend
      };

      await axios.put(
        `/api/jackpotBid/updateBid/${editingBid.bidId}`,
        payload
      );
      toast.success("Bid updated successfully");
      setIsEditModalOpen(false);
      setEditingBid(null);
      handleFilterBids();
    } catch (error) {
      console.error("Update error:", error);
      message.error("Error updating bid");
    }
  };

  const handleDeleteBid = async (bidId) => {
    try {
      await axios.delete(`/api/jackpotBid/deleteBid/${bidId}`);
      toast.success("Bid deleted successfully");
      handleFilterBids();
    } catch (error) {
      message.error("Error deleting bid");
    }
  };

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({ date: dayjs() });
    setBidData([]);
    setSearchText("");
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
    },
    { title: "User Name", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "Bid TXID", dataIndex: "bidId" },
    { title: "Game Name", dataIndex: "gamename" },
    { title: "Game Type", render: () => "Jodi" },
    { title: "Digit", dataIndex: "number" },
    { title: "Points", dataIndex: "points" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteBid(record.bidId)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const filteredBidData = bidData.filter(
    (item) =>
      item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bidId?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: "center" }}>Jackpot Bid History</Title>

      <Card style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Game Name" name="gameName" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Game"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {gameOptions.map((game) => {
                    const formattedTime = dayjs(game.open_time, "hh:mm:ssA").format("hh:mm A");
                    const displayText = `${game.game_name} [${formattedTime}]`;
                    const uniqueValue = `${game.game_name}|${game.open_time}`;

                    return (
                      <Option key={game.uniqueKey} value={uniqueValue}>
                        {displayText}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Game Type">
                <Input value="Jodi" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <Button type="primary" onClick={handleFilterBids} loading={loading}>
                Submit
              </Button>
              <Button onClick={resetForm}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Always show the table card, even when there's no data */}
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <span>Show </span>
            <Select value={pageSize} style={{ width: 70 }} onChange={setPageSize}>
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            <span> entries</span>
          </Col>
          <Col>
            <Input
              placeholder="Search by User Name or TXID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredBidData}
          pagination={{ pageSize }}
          rowKey="bidId"
          scroll={{ x: true }}
          loading={loading}
          locale={{
            emptyText: "No data available. Please filter to see bid history."
          }}
        />
      </Card>

      <Modal
        title="Edit Jodi Bid"
        open={isEditModalOpen}
        onOk={handleUpdateBid}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          setEditingBid(null);
        }}
        okText="Update"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="points" label="Points" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Game Type">
            <Input value="Jodi" disabled />
          </Form.Item>
          <Form.Item name="newDigit" label="New Digit" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BidHistory;