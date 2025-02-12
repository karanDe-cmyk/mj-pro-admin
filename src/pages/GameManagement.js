import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Switch,
  TimePicker,
  Input,
  Form,
  Card,
  Row,
  Col,
  message,
  Modal,
  Empty,
  Spin,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "../utils/axiosInstance";

const { Option } = Select;

const GameManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true); // New state to track initial loading

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/marketManagement/getMarketGames`);
      if (response.data) {
        setGames(response.data || []);
      } else {
        message.error("Failed to fetch market games.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      message.error("Failed to fetch games.");
    } finally {
      setLoading(false);
      setFirstLoad(false); // Stops showing the loader after the first request
    }
  };

  const handleAddGame = async (values) => {
    try {
      const newGame = {
        marketName: values.marketName,
        gameName: values.gameName,
        openTime: values.openTime.format("hh:mm A"),
        closeTime: values.closeTime.format("hh:mm A"),
        isActive: values.marketOnOff || false,
      };

      await axios.post(`/api/marketManagement/addMarketGame`, newGame);
      message.success("Game added successfully!");
      fetchGames();
      form.resetFields();
    } catch (error) {
      console.error("Error adding game:", error);
      message.error("Failed to add game.");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.put(`/api/marketManagement/updateMarketGame/${id}`, {
        isActive: !isActive,
      });
      message.success("Market status updated!");
      fetchGames();
    } catch (error) {
      console.error("Error updating market status:", error);
      message.error("Failed to update market status.");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();

      const updatedGame = {
        gameName: values.gameName,
        openTime: values.openTime ? values.openTime.format("hh:mm A") : null, // Save main game open time
        closeTime: values.closeTime ? values.closeTime.format("hh:mm A") : null, // Save main game close time
        weekends: values.weekends
          ? values.weekends.map((day) => ({
            ...day,
            openTime: day.openTime ? day.openTime.format("hh:mm A") : null, // Ensure time formatting
            closeTime: day.closeTime ? day.closeTime.format("hh:mm A") : null,
          }))
          : [], // Handle empty weekends array
      };

      await axios.put(
        `/api/marketManagement/updateMarketGame/${editingGame._id}`,
        updatedGame
      );
      message.success("Game updated successfully!");
      setIsModalOpen(false);
      fetchGames();
    } catch (error) {
      console.error("Error updating game:", error);
      message.error("Failed to update game.");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    { title: "Game Name", dataIndex: "gameName", key: "gameName", width: 250 },
    { title: "Open Time", dataIndex: "openTime", key: "openTime", width: 180 },
    {
      title: "Close Time",
      dataIndex: "closeTime",
      key: "closeTime",
      width: 180,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggle(record._id, isActive)}
        />
      ),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              marginRight: 10,
              backgroundColor: "#1890ff",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              padding: "4px 12px",
              fontWeight: "500",
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            danger
          >
            Delete
          </Button>
        </>
      ),
      width: 180,
    },
  ];

  const handleEdit = (record) => {
    setEditingGame(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      gameName: record.gameName,
      openTime: record.openTime ? moment(record.openTime, "hh:mm A") : null, // Set default Open Time for main game
      closeTime: record.closeTime ? moment(record.closeTime, "hh:mm A") : null, // Set default Close Time for main game
      weekends: record.weekends.map((day) => ({
        ...day,
        openTime: day.openTime ? moment(day.openTime, "hh:mm A") : null, // Set default Open Time for weekends
        closeTime: day.closeTime ? moment(day.closeTime, "hh:mm A") : null, // Set default Close Time for weekends
        is_open: day.is_open,
      })),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/marketManagement/deleteMarketGameById/${id}`);
      message.success("Game deleted successfully!");
      fetchGames();
    } catch (error) {
      console.error("Error deleting game:", error);
      message.error("Failed to delete game.");
    }
  };

  return (
    <div style={{ padding: "8px", maxWidth: "1400px", margin: "auto" }}>
      <Card
        style={{
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "25px",
          }}
        >
          Game Market
        </h2>

        {/* ADD GAME SECTION */}
        <Card
          style={{
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "25px",
            backgroundColor: "#f7fcf8",
            overflowX: "auto", // Enables horizontal scrolling on small screens
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "15px",
              textAlign: "center", // Centers heading on small screens
            }}
          >
            Add Game
          </h3>

          <Form
            form={form}
            layout="vertical" // Changed to vertical for better stacking on mobile
            onFinish={handleAddGame}
          >
            <Row gutter={[16, 16]}>
              {/* Market Name */}
              <Col xs={24} sm={12} md={8}>
                <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
                  Market Name
                </label>
                <Form.Item name="marketName" rules={[{ required: true, message: "Select Market name" }]}>
                  <Select placeholder="Select Market Name" style={{ width: "100%" }}>
                    <Select.Option value="">--Select Market Name--</Select.Option>
                    <Select.Option value="Main Market">Main Market</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Name */}
              <Col xs={24} sm={12} md={8}>
                <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
                  Game Name
                </label>
                <Form.Item name="gameName" rules={[{ required: true, message: "Enter game name" }]}>
                  <Input placeholder="Enter Game Name" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Market Open Time */}
              <Col xs={24} sm={12} md={8}>
                <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
                  Market Open Time
                </label>
                <Form.Item name="openTime" rules={[{ required: true, message: "Select open time" }]}>
                  <TimePicker format="hh:mm A" use12Hours style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Market Close Time */}
              <Col xs={24} sm={12} md={8}>
                <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
                  Market Close Time
                </label>
                <Form.Item name="closeTime" rules={[{ required: true, message: "Select close time" }]}>
                  <TimePicker format="hh:mm A" use12Hours style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Market On/Off */}
              <Col xs={24} sm={12} md={8}>
                <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
                  Market On/Off
                </label>
                <Form.Item name="marketOnOff" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>

              {/* Add Game Button */}
              <Col xs={24} style={{ textAlign: "center" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} style={{ fontWeight: "600" }}>
                    Add Game
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>


        {/* TABLE SECTION */}
        <Card
  style={{
    borderRadius: "8px",
   
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
    overflowX: "auto", // Ensures horizontal scrolling on small screens
  }}
>
  <h3
    style={{
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px",
      textAlign: "center", // Centers title on smaller screens
    }}
  >
    Game List
  </h3>

  {firstLoad ? (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <Spin size="large" />
    </div>
  ) : games.length === 0 ? (
    <Empty description="No Games Available" style={{ padding: "10px" }} />
  ) : (
    <Table
      columns={columns}
      dataSource={games}
      loading={loading}
      pagination={{ pageSize: 5 }}
      bordered
      scroll={{ x: "max-content" }} // Allows table to adjust dynamically
      style={{ whiteSpace: "nowrap" }} // Prevents text wrapping issues
    />
  )}
</Card>

      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Game"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        width={700}
      >
        <Form form={editForm} layout="vertical">
          {/* Game Name Field */}
          <Form.Item
            label="Game Name"
            name="gameName"
            rules={[{ required: true, message: "Enter game name" }]}
          >
            <Input />
          </Form.Item>

          {/* Open Time & Close Time for Main Game */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Open Time"
                name="openTime"
                rules={[{ required: true, message: "Enter open time" }]}
              >
                <TimePicker format="hh:mm A" use12Hours />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Close Time"
                name="closeTime"
                rules={[{ required: true, message: "Enter close time" }]}
              >
                <TimePicker format="hh:mm A" use12Hours />
              </Form.Item>
            </Col>
          </Row>

          {/* Weekend Open & Close Time */}
          <Row gutter={[16, 16]}>
            {editingGame &&
              editingGame.weekends.map((day, index) => (
                <Col span={12} key={day.day}>
                  <Card
                    size="small"
                    title={day.day}
                    style={{ textAlign: "center" }}
                  >
                    <Form.Item
                      name={["weekends", index, "openTime"]}
                      label="Open Time"
                      rules={[{ required: true }]}
                    >
                      <TimePicker format="hh:mm A" use12Hours />
                    </Form.Item>
                    <Form.Item
                      name={["weekends", index, "closeTime"]}
                      label="Close Time"
                      rules={[{ required: true }]}
                    >
                      <TimePicker format="hh:mm A" use12Hours />
                    </Form.Item>
                    <Form.Item
                      name={["weekends", index, "is_open"]}
                      label="Is Active"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Card>
                </Col>
              ))}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default GameManagement;
