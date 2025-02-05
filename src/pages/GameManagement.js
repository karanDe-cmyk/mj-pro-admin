import React, { useState, useEffect } from "react";
import { Table, Form, Input, Select, TimePicker, Button, Modal } from "antd";
import instance from "../utils/axiosInstance";
import { apiUrl, appiD } from "../utils/config";
import moment from "moment";
const { Option } = Select;

const GameManagement = () => {
  const [games, setGames] = useState([]);

  const [formData, setFormData] = useState({
    marketName: "",
    marketType: "",
    marketOpenTime: null,
    marketCloseTime: null,
    selectedGames: [],
  });

  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await instance.get(`${apiUrl}/api/marketManagement/getMarketGames/${appiD}`);
      console.log("Fetched Games Data:", response.data);  // Debugging log

      if (Array.isArray(response.data.data)) {
        setGames(response.data.data);  // ✅ Fix: Use response.data.data
      } else {
        console.error("Expected an array but got:", response.data);
        setGames([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching game markets:", error);
      setGames([]); // Prevent crashes by ensuring it's always an array
    }
  };



  const handleInputChange = (changedValues) => {
    setFormData({ ...formData, ...changedValues });
  };

  const handleAddMarket = async () => {
    try {
      const newGame = {
        market_name: formData.marketName,
        market_type: formData.marketType,
        open_time: formData.marketOpenTime?.format("HH:mm"),
        close_time: formData.marketCloseTime?.format("HH:mm"),
        games: formData.selectedGames,
        closeActivity: false,
      };

      const url = `${apiUrl}/api/marketManagement/addMarketGame/${appiD}`;
      console.log("Adding Market Game:", url, newGame);

      const response = await instance.post(url, { appiD, ...newGame });

      console.log("Add Market Response:", response.data);
      fetchGames();
    } catch (error) {
      console.error("Error adding game:", error.response?.data || error.message);
    }
  };


  const handleDeleteGame = (game) => {
    setGameToDelete(game);
    setIsConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;

    try {
      await instance.delete(`${apiUrl}/api/marketManagement/deleteMarketGameById/${appiD}/${gameToDelete._id}`);

      fetchGames();
      setIsConfirmDelete(false);
      setGameToDelete(null);
    } catch (error) {
      console.error("Error deleting game market:", error);
    }
  };

  // ✅ Edit game market
  // ✅ Open Edit Modal with selected game data
  // ✅ Import moment

  const handleEditGame = (game) => {
    setEditData({
      ...game,
      open_time: game.open_time ? moment(game.open_time, "HH:mm") : null,  // ✅ Convert string to Moment.js object
      close_time: game.close_time ? moment(game.close_time, "HH:mm") : null,
    });
    setIsEditModalVisible(true);
  };


  // ✅ Handle saving the edited game market
  const handleSaveEdit = async () => {
    if (!editData || !editData._id) return;

    try {
      const updatedGame = {
        ...editData,
        open_time: editData.open_time ? editData.open_time.format("HH:mm") : null,  // ✅ Convert Moment.js to string
        close_time: editData.close_time ? editData.close_time.format("HH:mm") : null,
      };

      await instance.put(`${apiUrl}api/marketManagement/updateMarketGame/${appiD}/${editData._id}`, updatedGame);
      fetchGames();  // Refresh table
      setIsEditModalVisible(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating game market:", error);
    }
  };


  // ✅ Table columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id" },
    { title: "Market Name", dataIndex: "market_name", key: "market_name" },
    { title: "Market Type", dataIndex: "market_type", key: "market_type" },
    { title: "Open Time", dataIndex: "open_time", key: "open_time" },
    { title: "Close Time", dataIndex: "close_time", key: "close_time" },
    {
      title: "Games",
      dataIndex: "games",
      key: "games",
      render: (games) => (Array.isArray(games) ? games.join(", ") : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditGame(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteGame(record)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 p-4">
        <h2>Add New Market</h2>
        <Form
          layout="horizontal"
          onValuesChange={(changedValues) => handleInputChange(changedValues)}
          style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "10px" }}
        >
          <Form.Item label="Market Name" name="marketName">
            <Input placeholder="Market Name" />
          </Form.Item>

          <Form.Item label="Market Type" name="marketType">
            <Select placeholder="Select Market Type">
              <Option value="Main">Main</Option>

              <Option value="Startline">Startline</Option>
              <Option value="King Jackpot">King Jackpot</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Open Time" name="marketOpenTime">
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item label="Close Time" name="marketCloseTime">
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item label="Games" name="selectedGames">
            <Select mode="multiple" placeholder="Select Games">
              <Option value="Roulette">Roulette</Option>
              <Option value="Blackjack">Blackjack</Option>
              <Option value="Poker">Poker</Option>
            </Select>
          </Form.Item>
        </Form>

        <Button className="m-5" type="primary" onClick={handleAddMarket}>
          Add Market
        </Button>
      </div>

      <Table columns={columns} dataSource={games || []} rowKey="_id" />


      {/* <Table columns={columns} dataSource={games} rowKey="_id" /> */}

      {/* Confirm Delete Modal */}
      <Modal title="Confirm Delete" open={isConfirmDelete} onOk={confirmDelete} onCancel={() => setIsConfirmDelete(false)}>
        <p>Are you sure you want to delete this market?</p>
      </Modal>

      {/* Edit Market Modal */}
      {/* Edit Market Modal */}
      <Modal title="Edit Market" open={isEditModalVisible} onOk={handleSaveEdit} onCancel={() => setIsEditModalVisible(false)}>
        <Form
          initialValues={editData}  // ✅ Pass the converted values
          onValuesChange={(changedValues) => setEditData({ ...editData, ...changedValues })}
        >
          <Form.Item label="Market Name" name="market_name">
            <Input />
          </Form.Item>
          <Form.Item label="Market Type" name="market_type">
            <Input />
          </Form.Item>
          <Form.Item label="Open Time" name="open_time">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="Close Time" name="close_time">
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default GameManagement;
