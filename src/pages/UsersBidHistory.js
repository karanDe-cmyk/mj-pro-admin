import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Select, Button, Table, message, Modal, Row, Col } from "antd";
import axios from "../utils/axiosInstance";
import dayjs from "dayjs"; // For date formatting
import moment from "moment";

const UserBidHistory = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [markets, setMarkets] = useState([]);
  const [games, setGames] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD")); // Default to today's date
  const printRef = useRef();

  // Fetch data for the selected date
  useEffect(() => {
    fetchMarketAndGames(selectedDate);
  }, [selectedDate]);

  const fetchMarketAndGames = async (date, market = "", game = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bid/getAllBid?date=${date}`);

      if (response.data) {
        let filteredData = response.data.filter((item) => {
          if (item.time) {
            // Use time string for filtering (format: 'YYYY-MM-DD hh:mm:ss A')
            return item.time.startsWith(date);
          } else if (item.createdAt) {
            // Use createdAt fallback for ISO date comparison
            return moment(item.createdAt).format("YYYY-MM-DD") === date;
          }
          return false;
        });

        // Filter by Market & Game if specified
        if (market) filteredData = filteredData.filter((item) => item.market === market);
        if (game) filteredData = filteredData.filter((item) => item.gameName === game);

        setBidHistory(filteredData);

        // Extract unique Market and Game names
        const uniqueMarkets = [...new Set(response.data.map((item) => item.market))];
        const uniqueGames = [...new Set(response.data.map((item) => item.gameName))];

        setMarkets(uniqueMarkets);
        setGames(uniqueGames);
      }
    } catch (error) {
      console.error("Error fetching bid history:", error);
      message.error("Failed to fetch bid history.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form value changes to update selectedDate state
  const onFormValuesChange = (changedValues) => {
    if (changedValues.date) {
      setSelectedDate(changedValues.date);
    }
  };

  // Handle form submission (filter bids)
  const onFinish = (values) => {
    fetchMarketAndGames(selectedDate, values.marketName, values.gameName);
  };

  // Open Edit Modal
  const handleEdit = (record) => {
    setEditingBid(record);
    editForm.setFieldsValue({
      newPoints: record.points,
      newbidvalue: record.digit,
    });
    setEditModalOpen(true);
  };

  // Submit Updated Bid
  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const values = await editForm.validateFields();

      const requestBody = {
        bidId: editingBid.bidId, // Unique identifier for the bid
        id: editingBid._id,       // MongoDB document ID
        newPoints: values.newPoints,
        newbidvalue: values.newbidvalue,
      };

      const response = await axios.put(`/api/bid/updateBid/${editingBid._id}`, requestBody);

      if (response.data.success) {
        message.success("Bid updated successfully!");
        setEditModalOpen(false);
        fetchMarketAndGames(selectedDate); // Refresh Data
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      message.error("Failed to update bid.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Bid Deletion
  const handleDelete = async (bidId, id) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [bidId]: true }));

      const response = await axios.delete(`/api/bid/deleteBid/${id}`, { data: { bidId, id } });

      if (response.data.success) {
        message.success("Bid deleted successfully!");
        fetchMarketAndGames(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Failed to delete bid.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  // Table Columns (without an extra date column)
  const columns = [
    { title: "#", dataIndex: "key", key: "key", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName", render: (userName, record) => (
      <a 
        href={`/admin/user-management/user-details/${record.userId}`}
        className="text-blue-500 hover:text-blue-700 hover:underline"
      >
        {userName}
      </a>
    ) },
    { title: "Market Name", dataIndex: "market", key: "market" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Game Type", dataIndex: "gameType", key: "gameType" },
    { title: "Open", dataIndex: "open", key: "open", render: (value) => (value ? "Yes" : "No") },
    { title: "Close", dataIndex: "close", key: "close", render: (value) => (value ? "Yes" : "No") },
    { title: "Points", dataIndex: "points", key: "points" },
    { title: "Bid Number", dataIndex: "digit", key: "digit" },
    {
      title: "Bid Time",
      dataIndex: "time",
      key: "bidTime",
      render: (time) => dayjs(time).format("HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          {/* <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: "10px" }}>
            Edit
          </Button> */}
          <Button type="danger" onClick={() => handleDelete(record.bidId, record._id)} loading={deleteLoading[record.bidId]}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          Bid History Report
        </h1>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ date: selectedDate }}
          onValuesChange={onFormValuesChange}
        >
          <Row gutter={[16, 16]} align="middle">
            {/* Date Picker with current date showing by default */}
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="date" label="Select Date">
                <Input type="date" />
              </Form.Item>
            </Col>

            {/* Market Name */}
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="marketName" label="Market Name">
                <Select placeholder="Select Market" allowClear>
                  {markets.map((market, index) => (
                    <Select.Option key={index} value={market}>
                      {market}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Game Name */}
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="gameName" label="Game Name">
                <Select placeholder="Select Game" allowClear>
                  {games.map((game, index) => (
                    <Select.Option key={index} value={game}>
                      {game}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Submit Button */}
            <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{ textAlign: "right" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Bid History Table */}
      <Table
        columns={columns}
        dataSource={bidHistory}
        pagination={{ pageSize: 5 }}
        loading={filterLoading || loading}
        scroll={{ x: 1000 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Bid"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditSubmit}
        confirmLoading={editLoading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="New Points" name="newPoints" rules={[{ required: true, message: "Please enter new points" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="New Bid Value" name="newbidvalue" rules={[{ required: true, message: "Please enter new bid value" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserBidHistory;
