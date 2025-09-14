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
import axiosInstance from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;
const { Title } = Typography;

// Helper function to display game type in desired format.
const displayGameType = (type) => {
  if (type === "jodi_digit") return "Jodi";
  if (type === "left_digit") return "Left Digit";
  if (type === "right_digit") return "Right Digit";
  return type;
};

const BidHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  // For populating the Game Name dropdown from the API
  const [gameOptions, setGameOptions] = useState([]);
  // For storing the filtered bid data from the filterBids API
  const [bidData, setBidData] = useState([]);
  // For controlling the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // The bid record that is being edited
  const [editingBid, setEditingBid] = useState(null);

  // Fetch game markets from the API for the Game Name select box
  const fetchGameMarkets = async () => {
    try {
      const response = await axiosInstance.get("/api/GaliDisawar/getAllMarket");
      // Assuming response.data has a structure like { message, success, data: [...] }
      if (response.data && Array.isArray(response.data.data)) {
        setGameOptions(response.data.data);
      } else {
        setGameOptions([]);
      }
    } catch (error) {
      console.error("Error fetching game markets", error);
      message.error("Error fetching game markets");
    }
  };

  useEffect(() => {
    fetchGameMarkets();
    // Set current date as default for the DatePicker (using dayjs object)
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  // Handler to call the filterBids API when Save is clicked in the filter form
  const handleFilterBids = async () => {
    try {
      const values = await form.validateFields();

      // Define mapping for game type conversion
      const gameTypeMapping = {
        Jodi: "jodi_digit",
        "Left Digit": "left_digit",
        "Right Digit": "right_digit",
      };

      const payload = {
        // Format the date as DD-MM-YYYY
        date: dayjs(values.date).format("DD-MM-YYYY"),
        gamename: values.gameName, // from select box
        gametype: gameTypeMapping[values.gameType] || values.gameType, // map to desired value
      };

      const response = await axiosInstance.post(
        "/api/GaliDisawarbid/filterBids",
        payload
      );
      if (response.data.success) {
        toast.success("Bids filtered successfully");
        // Add a key to each bid record (using bidId if available, else index)
        const bidsWithKey = response.data.bids.map((bid, index) => ({
          ...bid,
          key: bid.bidId || index,
        }));
        setBidData(bidsWithKey);
      } else {
        message.error("No bids found");
        setBidData([]);
      }
    } catch (error) {
      console.error("Error filtering bids:", error);
      message.error("Error filtering bids");
    }
  };

  // Open edit modal and pre-fill edit form with bid data
  const openEditModal = (record) => {
    setEditingBid(record);
    // Pre-fill the edit form with current points and current number.
    editForm.setFieldsValue({
      points: record.points,
      newNumber: record.number, // pre-fill with current number
    });
    setIsEditModalOpen(true);
  };

  // Handler for updating a bid via the update API
  const handleUpdateBid = async () => {
    try {
      const values = await editForm.validateFields();
      // Build the payload with default "false" values.
      let payload = {
        points: values.points,
        leftdigit: "false",
        rightdigit: "false",
        pana: "false",
      };
      // Normalize the stored gametype for comparison
      const gameTypeValue = editingBid.gametype.toLowerCase().replace(/_/g, " ");
      if (gameTypeValue === "left digit") {
        payload.leftdigit = values.newNumber;
      } else if (gameTypeValue === "right digit") {
        payload.rightdigit = values.newNumber;
      } else if (gameTypeValue === "jodi" || gameTypeValue === "jodi digit") {
        payload.pana = values.newNumber;
      } else {
        // fallback case (if gametype doesn't match expected values)
        payload.pana = values.newNumber;
      }
      await axiosInstance.put(
        `/api/GaliDisawarbid/updateBid/${editingBid.bidId}`,
        payload
      );
      toast.success("Bid updated successfully");
      setIsEditModalOpen(false);
      setEditingBid(null);
      // Refresh the bid data after update
      handleFilterBids();
    } catch (error) {
      console.error("Error updating bid:", error);
      message.error("Error updating bid");
    }
  };

  // Handler for deleting a bid via the delete API
  const handleDeleteBid = async (bidId) => {
    try {
      await axiosInstance.delete(`/api/GaliDisawarbid/deleteBid/${bidId}`);
      toast.success("Bid deleted successfully");
      // Refresh bid data
      handleFilterBids();
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Error deleting bid");
    }
  };

  // Table columns definition
  const columns = [
    {
      title: "#",
      key: "sNo",
      render: (_, record, index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bid TXID",
      dataIndex: "bidId",
      key: "bidId",
    },
    {
      title: "Game Name",
      dataIndex: "gamename",
      key: "gamename",
    },
    {
      title: "Game Type",
      dataIndex: "gametype",
      key: "gametype",
      render: (text) => displayGameType(text),
    },
    
    {
  title: "Number",
  key: "number",
  render: (_, record) => {
    if (record.gametype === "left_digit") return record.leftdigit;
    if (record.gametype === "right_digit") return record.rightdigit;
    if (record.gametype === "jodi_digit") return record.pana;
    return "-";
  },
},

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteBid(record.bidId)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Optionally, filter the bidData by searchText (e.g. matching username or bidId)
  const filteredBidData = bidData.filter(
    (item) =>
      item.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bidId?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Galidisawar Bid History
      </Title>

      {/* Filter Form */}
      <Card style={{ marginBottom: "20px" }}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Date" name="date">
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Game Name" name="gameName">
                <Select
                  placeholder="Select Game"
                  style={{ width: "100%" }}
                  showSearch
                  optionFilterProp="children"
                >
                  {gameOptions.map((game) => {
                    const formattedTime = dayjs(game.open_time, "hh:mm:ssA").format(
                      "hh:mm A"
                    );
                    return (
                      <Option key={game._id} value={game.game_name}>
                        {`${game.game_name} ${formattedTime}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Game Type" name="gameType">
                <Select placeholder="Select Game Type" style={{ width: "100%" }}>
                  <Option value="Left Digit">Left Digit</Option>
                  <Option value="Right Digit">Right Digit</Option>
                  <Option value="Jodi">Jodi</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "flex-end" }}>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={handleFilterBids}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table Filter Controls */}
      <Card style={{ marginBottom: "20px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col xs={24} sm={12}>
            <div>
              <span>Show </span>
              <Select defaultValue={5} style={{ width: 60 }}>
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
              </Select>
              <span> entries</span>
            </div>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Form.Item
              label="Search"
              colon={false}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginRight: 8, whiteSpace: "nowrap" } }}
            >
              <Input
                placeholder="Search by User Name or TXID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredBidData}
          pagination={{ pageSize: 5 }}
          rowKey="bidId"
          scroll={{ x: true }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Bid"
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
          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please enter points" }]}
          >
            <Input type="number" placeholder="Enter points" />
          </Form.Item>
          {/* Display gametype as read-only */}
          <Form.Item label="Game Type">
            <Input
              value={editingBid ? displayGameType(editingBid.gametype) : ""}
              disabled
            />
          </Form.Item>
          <Form.Item
            name="newNumber"
            label={`New Number for ${
              editingBid ? displayGameType(editingBid.gametype) : ""
            }`}
            rules={[{ required: true, message: "Please enter new number" }]}
          >
            <Input placeholder="Enter new number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BidHistory;
