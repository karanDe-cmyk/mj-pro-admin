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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(customParseFormat);
const { Title } = Typography;

const GameName = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const timeToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(/(?=[AP]M)/);
    let [hours, minutes] = time.split(':').map(Number);

    // Check if seconds exist before mapping
    if (time.split(':').length > 2) {
      [, , minutes] = time.split(':').map(Number);
    }

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/GaliDisawar/getAllMarket");

      if (response.data && Array.isArray(response.data.data)) {
        const sortedMarkets = [...response.data.data].sort((a, b) => {
          return timeToMinutes(a.open_time) - timeToMinutes(b.open_time);
        });
        setMarkets(sortedMarkets);
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

  const handleAddMarket = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        game_name: values.name,
        open_time: values.time.format("hh:mm:ssA"),
        is_active: true,
      };
      await axiosInstance.post("/api/GaliDisawar/AddMarket", payload);
      toast.success("Market added successfully");
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

  const handleUpdateMarket = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        game_name: values.name,
        open_time: values.time.format("hh:mm:ssA"),
        is_active: true,
      };
      await axiosInstance.put(
        `/api/GaliDisawar/updateMarket/${editingMarket._id}`,
        payload
      );
      toast.success("Market updated successfully");
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

  const handleToggleStatus = async (record, checked) => {
    try {
      const payload = {
        game_name: record.game_name,
        open_time: record.open_time,
        is_active: checked,
      };
      await axiosInstance.put(
        `/api/GaliDisawar/updateMarket/${record._id}`,
        payload
      );
      toast.success("Market status updated");
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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/GaliDisawar/deleteMarketById/${id}`);
      toast.success("Market deleted successfully");
      fetchMarkets();
    } catch (error) {
      console.error("Error deleting market", error);
      message.error("Failed to delete market");
    }
  };

  const handleEdit = (record) => {
    setEditingMarket(record);
    form.setFieldsValue({
      name: record.game_name,
      time: dayjs(record.open_time, "hh:mm:ssA"),
    });
    setIsModalOpen(true);
  };

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
      sorter: (a, b) => timeToMinutes(a.open_time) - timeToMinutes(b.open_time),
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

  const filteredData = markets.filter(
    (item) =>
      item.game_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.open_time.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Galidisawar Games
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
          pagination={false}
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