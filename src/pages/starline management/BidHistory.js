import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, DatePicker, Modal, Form, Spin, message } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import { appiD } from "../../utils/config";
import moment from "moment";

const { Option } = Select;

const BidHistory = () => {
  // Store both the raw moment object and the formatted date string
  const [date, setDate] = useState(null); // moment object from DatePicker
  const [formattedDate, setFormattedDate] = useState(""); // formatted date string
  const [selectedGame, setSelectedGame] = useState("");
  const [gameOptions, setGameOptions] = useState([]);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBid, setEditBid] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form] = Form.useForm();

  // Fetch game list on component mount
  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await axiosInstance.get(`/api/starline/getGameList/${appiD}`);
        const uniqueGameNames = new Set();

        if (Array.isArray(response.data.data)) {
          response.data.data.forEach((game) => uniqueGameNames.add(game.game_name));
        }

        setGameOptions([...uniqueGameNames]);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };

    fetchGameList();
  }, []);

  // When the user clicks Submit, use the stored formattedDate
  const handleFilterSubmit = async () => {
    setLoading(true);
    try {
      // Use the formatted date string directly
      const payload = { date: formattedDate, gamename: selectedGame };

      const response = await axiosInstance.post(
        `api/starlinebid/showBidlistOfSingleMarket/${appiD}`,
        payload
      );

      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBid = async (bidId) => {
    setDeleting(bidId);
    try {
      const response = await axiosInstance.delete(
        `/api/starlinebid/deletebid/${appiD}/${bidId}`
      );

      if (response.status === 200) {
        setBidHistoryData((prevBids) => prevBids.filter((bid) => bid.bidId !== bidId));
        message.success("Bid deleted successfully and amount refunded.");
        alert("User bid deleted successfully and amount refunded to user wallet");
      } else {
        message.error("Failed to delete bid. Please try again.");
      }
    } catch (error) {
      message.error("Error deleting bid. Please check your network and try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleEditBid = (bid) => {
    setEditBid(bid);
    form.setFieldsValue({
      points: bid.points,
      digit: bid.digit,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setUpdating(true);

      await axiosInstance.patch(`/api/starlinebid/updatebid/${appiD}/${editBid.bidId}`, {
        points: values.points,
        digit: values.digit,
      });

      setBidHistoryData((prevBids) =>
        prevBids.map((bid) =>
          bid.bidId === editBid.bidId
            ? { ...bid, points: values.points, digit: values.digit }
            : bid
        )
      );

      message.success("Bid updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      message.error("Failed to update bid. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Member Name",
      dataIndex: "userName",
    },
    {
      title: "Game Name",
      dataIndex: "gamename",
    },
    {
      title: "Games",
      dataIndex: "gametype",
    },
    {
      title: "Bid Amount",
      dataIndex: "points",
    },
    {
      title: "Bid Number",
      dataIndex: "digit",
    },
    {
      title: "Bidding Time",
      dataIndex: "time",
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="primary" className="mr-2" onClick={() => handleEditBid(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDeleteBid(record.bidId)}>
            {deleting === record.bidId ? "Deleting..." : "Delete"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Bid History Report</h2>

      <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center justify-between">
        {/* Date Picker */}
        <DatePicker
          className="w-52"
          format="DD-MM-YYYY"
          value={date}
          onChange={(value) => {
            setDate(value);
            // Store the formatted date string immediately when a date is selected.
            setFormattedDate(value ? value.format("DD-MM-YYYY") : "");
          }}
          placeholder="Select Date"
        />

        {/* Game Dropdown */}
        <Select
          className="w-52"
          value={selectedGame || undefined}
          onChange={(value) => setSelectedGame(value)}
          placeholder="Select Game"
          allowClear
        >
          {gameOptions.map((game, index) => (
            <Option key={index} value={game}>
              {game}
            </Option>
          ))}
        </Select>

        {/* Submit Button */}
        <Button type="primary" onClick={handleFilterSubmit}>
          Submit
        </Button>
      </div>

      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Bid History List</h3>

        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={bidHistoryData.map((item, index) => ({ ...item, key: index }))}
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>

      {/* Edit Bid Modal */}
      <Modal
        title="Edit Bid"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Update"
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Bid Amount"
            name="points"
            rules={[{ required: true, message: "Please enter bid amount" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Bid Number"
            name="digit"
            rules={[{ required: true, message: "Please enter bid number" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BidHistory;
