
// export default BidHistory;
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
// import axios from "axios";
import axiosInstance from '../../utils/axiosInstance'
import dayjs from "dayjs";

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

  useEffect(() => {
    const fetchGameMarkets = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axiosInstance.get("/api/jackpotMarket/getAllMarket", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setGameOptions(response.data.data);
        }
      } catch (error) {
        message.error("Error fetching game markets");
      }
    };
    fetchGameMarkets();
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  const handleFilterBids = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
  date: dayjs(values.date).format("DD-MM-YYYY"),
  gamename: values.gameName.split(" [")[0].trim(), // ✅ Fix here
  gametype: "jodi_digit",
  market: "Jackpot",
};



      console.log("Payload sent to API:", payload); // debug

      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosInstance.post(
        "/api/jackpotBid/filterBids",
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.success && Array.isArray(response.data.bids)) {
        const bidsWithKey = response.data.bids.map((bid, index) => ({
          ...bid,
          key: bid.bidId || index,
        }));
        setBidData(bidsWithKey);
        message.success("Bids filtered successfully");
      } else {
        message.warning("No bids found");
        setBidData([]);
      }
    } catch (error) {
      message.error("Error filtering bids");
    }
  };

  const openEditModal = (record) => {
    setEditingBid(record);
    editForm.setFieldsValue({
      points: record.points,
      newDigit: record.digit,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBid = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        points: values.points,
        leftdigit: "false",
        rightdigit: "false",
        pana: values.newDigit,
      };

      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.put(
        `/api/jackpotBid/updateBid/${editingBid.bidId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      message.success("Bid updated successfully");
      setIsEditModalOpen(false);
      setEditingBid(null);
      handleFilterBids();
    } catch (error) {
      message.error("Error updating bid");
    }
  };

  const handleDeleteBid = async (bidId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axiosInstance.delete(`/api/jackpotBid/deleteBid/${bidId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      message.success("Bid deleted successfully");
      handleFilterBids();
    } catch (error) {
      message.error("Error deleting bid");
    }
  };

  // const columns = [
  //   {
  //     title: "#",
  //     render: (_, __, index) => index + 1,
  //   },
  //   { title: "User Name", dataIndex: "userName" },
  //   { title: "Email", dataIndex: "email" },
  //   { title: "Bid TXID", dataIndex: "bidId" },
  //   { title: "Game Name", dataIndex: "gamename" },
  //   { title: "Game Type", render: () => "Jodi" },
  //   { title: "Digit", dataIndex: "digit" },
  //   { title: "Points", dataIndex: "points" },
  //   {
  //     title: "Action",
  //     render: (_, record) => (
  //       <>
  //         <Button onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>
  //           Edit
  //         </Button>
  //         <Button danger onClick={() => handleDeleteBid(record.bidId)}>
  //           Delete
  //         </Button>
  //       </>
  //     ),
  //   },
  // ];
const columns = [
  {
    title: "#",
    render: (_, __, index) => index + 1,
  },
  { title: "User Name", dataIndex: "username" }, // ✅ fixed
  { title: "Email", dataIndex: "email" },
  { title: "Bid TXID", dataIndex: "bidId" },
  { title: "Game Name", dataIndex: "gamename" },
  { title: "Game Type", render: () => "Jodi" },
  { title: "Digit", dataIndex: "number" }, // ✅ fixed
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
    optionLabelProp="label"
  >
    {gameOptions.map((game) => (
      <Option
        key={game._id}
        value={game.game_name} // ✅ submits only the correct value
        label={`${game.game_name} [ ${dayjs(game.open_time, "hh:mm:ssA").format("hh:mm A")} ]`}
      >
        {`${game.game_name} [ ${dayjs(game.open_time, "hh:mm:ssA").format("hh:mm A")} ]`}
      </Option>
    ))}
  </Select>
</Form.Item>

            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Game Type" name="gameType" initialValue="Jodi">
                <Select disabled>
                  <Option value="Jodi">Jodi</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item>
                <Button type="primary" onClick={handleFilterBids} style={{ marginTop: 30 }}>
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <span>Show </span>
            <Select defaultValue={pageSize} style={{ width: 70 }} onChange={setPageSize}>
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            <span> entries</span>
          </Col>
          <Col>
            <Form.Item label="Search" colon={false} style={{ marginBottom: 0 }}>
              <Input
                placeholder="Search by User Name or TXID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredBidData}
          pagination={{ pageSize }}
          rowKey="bidId"
          scroll={{ x: true }}
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
