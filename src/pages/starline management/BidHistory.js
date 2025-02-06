import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, DatePicker, Modal, Form, Spin, message, Alert } from "antd";
import axiosInstance from "../../utils/axiosInstance"; // Import axios instance
import { appiD } from "../../utils/config";
import moment from "moment";

const { Option } = Select;

const BidHistory = () => {
  const [date, setDate] = useState(null);
  const [selectedGame, setSelectedGame] = useState("");
  const [gameOptions, setGameOptions] = useState([]);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBid, setEditBid] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null); // ✅ Track which bid is being deleted
  const [form] = Form.useForm();

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

  const handleFilterSubmit = async () => {
    setLoading(true);
    try {
      const formattedDate = date ? moment(date).format("DD-MM-YYYY") : "";
      const payload = { date: formattedDate, gamename: selectedGame };
      const response = await axiosInstance.post(`api/starlinebid/showBidlistOfSingleMarket/${appiD}`, payload);
      setBidHistoryData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBid = async (bidId) => {
    setDeleting(bidId); // ✅ Show "Deleting..." on this specific button

    try {
      const response = await axiosInstance.delete(`/api/starlinebid/deletebid/${appiD}/${bidId}`);

      if (response.status === 200) {
        setBidHistoryData((prevBids) => prevBids.filter((bid) => bid.bidId !== bidId));
        message.success("Bid deleted successfully and amount refunded.");
        alert("User bid deleted successfully and amount refunded to user wallet"); // ✅ Alert for success
      } else {
        console.error("Delete failed:", response);
        message.error("Failed to delete bid. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Error deleting bid. Please check your network and try again.");
    } finally {
      setDeleting(null); // ✅ Reset delete state
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

      // API Call to Update Bid
      await axiosInstance.patch(`/api/starlinebid/updatebid/${appiD}/${editBid.bidId}`, {
        points: values.points,
        digit: values.digit,
      });

      // Update the state locally
      setBidHistoryData((prevBids) =>
        prevBids.map((bid) =>
          bid.bidId === editBid.bidId ? { ...bid, points: values.points, digit: values.digit } : bid
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
            {deleting === record.bidId ? "Deleting..." : "Delete"} {/* ✅ Show "Deleting..." */}
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
    onChange={(value) => setDate(value)}
    placeholder="Select Date"
  />

  {/* Fixed Select Dropdown */}
  <Select
    className="w-52"
    value={selectedGame || undefined} // ✅ Ensure placeholder is shown when no value is selected
    onChange={(value) => setSelectedGame(value)}
    placeholder="Select Game"
    allowClear // ✅ Adds a clear option
  >
    {gameOptions.map((game, index) => (
      <Select.Option key={index} value={game}>
        {game}
      </Select.Option>
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
