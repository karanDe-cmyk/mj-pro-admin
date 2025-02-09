import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Table, message, Spin, Modal } from "antd";
import axios from "../utils/axiosInstance";


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

  // ✅ Fetch Markets & Games on Component Mount
  useEffect(() => {
    fetchMarketAndGames();
  }, []);

  const fetchMarketAndGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bid/getAllBid`);
      if (response.data) {
        // ✅ Extract unique market names and game names from API response
        const uniqueMarkets = [...new Set(response.data.map((item) => item.market))];
        const uniqueGames = [...new Set(response.data.map((item) => item.gameName))];

        setMarkets(uniqueMarkets);
        setGames(uniqueGames);
        setBidHistory(response.data); // ✅ Store all bid data
      }
    } catch (error) {
      console.error("Error fetching markets and games:", error);
      message.error("Failed to fetch market & game names.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Form Submission (Filter Bids)
  const onFinish = async (values) => {
    try {
      setFilterLoading(true);

      const requestBody = {
        date: values.date,
        market: values.marketName,
        gameName: values.gameName,
      };

      // ✅ Fetch filtered bid history
      const response = await axios.post(`/api/bid/filterBids`, requestBody);

      if (response.data.success) {
        setBidHistory(response.data.bids);
        message.success("Filtered data fetched successfully!");
      } else {
        setBidHistory([]);
        message.warning("No data found!");
      }
    } catch (error) {
      console.error("Error filtering bids:", error);
      message.error("Failed to fetch bid history.");
    } finally {
      setFilterLoading(false);
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (record) => {
    setEditingBid(record);
    editForm.setFieldsValue({
      newPoints: record.points,
      newbidvalue: record.digit,
    });
    setEditModalOpen(true);
  };

  // ✅ Submit Updated Bid
  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const values = await editForm.validateFields();

      const requestBody = {
        bidId: editingBid.bidId, // ✅ Unique identifier for the bid
        id: editingBid._id, // ✅ The document ID from MongoDB
        newPoints: values.newPoints,
        newbidvalue: values.newbidvalue,
      };

      const response = await axios.put(`/api/bid/updateBid/${editingBid._id}`, requestBody);

      if (response.data.success) {
        message.success("Bid updated successfully!");
        setEditModalOpen(false);
        fetchMarketAndGames(); // Refresh Data
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      message.error("Failed to update bid.");
    } finally {
      setEditLoading(false);
    }
  };

  // ✅ Handle Bid Deletion
  const handleDelete = async (bidId, id) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [bidId]: true }));

      const requestBody = { bidId, id };

      const response = await axios.delete(`/api/bid/deleteBid/${id}`, { data: requestBody });

      if (response.data.success) {
        message.success("Bid deleted successfully!");
        fetchMarketAndGames();
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Failed to delete bid.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "#", dataIndex: "key", key: "key", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Game Type", dataIndex: "gameType", key: "gameType" },
    { title: "Open", dataIndex: "open", key: "open", render: (value) => (value ? "Yes" : "No") },
    { title: "Close", dataIndex: "close", key: "close", render: (value) => (value ? "Yes" : "No") },
    { title: "Points", dataIndex: "points", key: "points" },
    { title: "Bid Number", dataIndex: "digit", key: "digit" },
    { title: "Bid Time", dataIndex: "time", key: "time" },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: "10px" }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.bidId, record._id)} loading={deleteLoading[record.bidId]}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Bid History Report</h1>

        {/* ✅ FILTER FORM */}
        <Form form={form} onFinish={onFinish} layout="inline" style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <Form.Item name="date" label="Select Date" rules={[{ required: true, message: "Please select a date" }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="marketName" label="Market Name" rules={[{ required: true, message: "Please select a market" }]}>
            <Select placeholder="Select Market" style={{ width: "200px" }} loading={loading}>
              {markets.map((market, index) => (
                <Select.Option key={index} value={market}>{market}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="gameName" label="Game Name" rules={[{ required: true, message: "Please select a game" }]}>
            <Select placeholder="Select Game" style={{ width: "200px" }} loading={loading}>
              {games.map((game, index) => (
                <Select.Option key={index} value={game}>{game}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={filterLoading}>Submit</Button>
          </Form.Item>
        </Form>
      </div>

      {/* ✅ BID HISTORY TABLE */}
      <Table columns={columns} dataSource={bidHistory} pagination={{ pageSize: 5 }} loading={filterLoading} />

      {/* ✅ Edit Modal */}
      <Modal title="Edit Bid" open={editModalOpen} onCancel={() => setEditModalOpen(false)} onOk={handleEditSubmit} confirmLoading={editLoading}>
        <Form form={editForm} layout="vertical">
          <Form.Item label="New Points" name="newPoints" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="New Bid Value" name="newbidvalue" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserBidHistory;