import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  TimePicker,
  Row,
  Col,
  Card,
  Typography,
  message,
  Switch,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axiosInstance from "../../utils/axiosInstance";
// import axios from "axios";

dayjs.extend(customParseFormat);
const { Title } = Typography;

const GameName = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Fetch markets from API
  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosInstance.get("/api/JackpotMarket/getAllMarket",
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // The actual array of markets is in response.data.data
      if (response.data && Array.isArray(response.data.data)) {
        setMarkets(response.data.data);
      } else {
        setMarkets([]);
        message.warning("No valid market data found.");
      }
    } catch (error) {
      console.error("Error fetching markets", error);
      message.error("Error fetching market data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Handler for adding a new market (POST API)
  const handleAddMarket = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        game_name: values.name,
        open_time: values.time.format("hh:mm:ssA"),
        is_active: true,
      };
      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.post("/api/JackpotMarket/AddMarket", payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      message.success("Market added successfully");
      form.resetFields();
      setIsModalOpen(false);
      fetchMarkets();
    } catch (error) {
      console.error("Error adding market", error);
      const errMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to add market";
      alert(errMsg);
      message.error(errMsg);
    }
  };

  // Handler for updating an existing market (PUT API)
  const handleUpdateMarket = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        game_name: values.name,
        open_time: values.time.format("hh:mm:ssA"),
        is_active: true, // Sending is_active true by default for edit
      };
      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.put(
        `/api/JackpotMarket/updateMarket/${editingMarket._id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      message.success("Market updated successfully");
      setEditingMarket(null);
      form.resetFields();
      setIsModalOpen(false);
      fetchMarkets();
    } catch (error) {
      console.error("Error updating market", error);
      const errMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to update market";
      alert(errMsg);
      message.error(errMsg);
    }
  };

  // Handler for updating is_active using the toggle switch
  const handleToggleStatus = async (record, checked) => {
    try {
      const payload = {
        game_name: record.game_name,
        open_time: record.open_time,
        is_active: checked,
      };
      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.put(
        `/api/JackpotMarket/updateMarket/${record._id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      message.success("Market status updated");
      fetchMarkets();
    } catch (error) {
      console.error("Error updating market status", error);
      const errMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to update market status";
      alert(errMsg);
      message.error(errMsg);
    }
  };

  // Handler for deleting a market (DELETE API)
  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.delete(`/api/JackpotMarket/deleteMarketById/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      message.success("Market deleted successfully");
      fetchMarkets();
    } catch (error) {
      console.error("Error deleting market", error);
      message.error("Failed to delete market");
    }
  };

  // Open modal for editing a market
  const handleEdit = (record) => {
    setEditingMarket(record);
    form.setFieldsValue({
      name: record.game_name,
      time: dayjs(record.open_time, "hh:mm:ssA"),
    });
    setIsModalOpen(true);
  };

  // Table columns definition with added "Status" column
  const columns = [
    {
      title: "#",
      key: "sNo",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Game Name",
      dataIndex: "game_name",
      key: "game_name",
      sorter: (a, b) => a.game_name.localeCompare(b.game_name),
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Open Time",
      dataIndex: "open_time",
      key: "open_time",
      sorter: (a, b) => a.open_time.localeCompare(b.open_time),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          onChange={(checked) => handleToggleStatus(record, checked)}
          checkedChildren="Running"
          unCheckedChildren="Closed"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: "8px" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Filter markets by search text (game_name or open_time)
  const filteredData = markets.filter(
    (item) =>
      item.game_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.open_time.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Jackpot Games
      </Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12}>
          <Button
            type="primary"
            onClick={() => {
              setEditingMarket(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Add Game
          </Button>
        </Col>
        <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: "10px" }}>
          <Input
            placeholder="Search by Game Name or Open Time"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "80%", maxWidth: "300px" }}
          />
        </Col>
      </Row>

      <Card bordered style={{ marginBottom: "20px" }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          loading={loading}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingMarket ? "Edit Game" : "Add Game"}
        open={isModalOpen}
        onOk={editingMarket ? handleUpdateMarket : handleAddMarket}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingMarket(null);
        }}
        okText={editingMarket ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Game Name"
            rules={[{ required: true, message: "Please enter game name" }]}
          >
            <Input placeholder="Enter game name" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Open Time"
            rules={[{ required: true, message: "Please select open time" }]}
          >
            <TimePicker
              use12Hours
              format="hh:mm:ssA"
              style={{ width: "100%" }}
              placeholder="Select time"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GameName;