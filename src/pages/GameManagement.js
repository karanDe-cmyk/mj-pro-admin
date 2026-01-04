import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Switch,
  InputNumber,
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
  Tabs,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "../utils/axiosInstance";
import dayjs from "dayjs";

const { Option } = Select;

const gameTypeOptions = [
  "Triple Pana",
  "Panel Group",
  "SP DP TP",
  "Choice Panna SP DP",
  "SP Motor",
  "DP Motor",
  "Odd Even",
  "Two Digits Panel",
  "Group Jodi",
  "Digit Based Jodi",
  "Red Bracket",
  "Half Sangam A",
  "Half Sangam B",
  "Full Sangam",
  "Single Digits",
  "Single Digits Bulk",
  "Jodi",
  "Jodi Bulk",
  "Single Pana",
  "Single Pana Bulk",
  "Double Pana",
  "Double Pana Bulk",
];

/* ---------------- Time helpers ---------------- */
const TIME_FORMATS = ["hh:mm A", "hh:mm:ssA"];
const buildTime = (hour, minute, period) => {
  const hh = String(((Number(hour) % 12) || 12)).padStart(2, "0");
  const mm = String(Number(minute)).padStart(2, "0");
  const p = (period || "AM").toUpperCase() === "PM" ? "PM" : "AM";
  return `${hh}:${mm} ${p}`;
};
const explodeTime = (t) => {
  const m = moment(t, TIME_FORMATS, true);
  if (!m.isValid()) return { hour: 1, minute: 0, period: "AM" };
  return {
    hour: Number(m.format("hh")),
    minute: Number(m.format("mm")),
    period: m.format("A"),
  };
};
/* ------------------------------------------------ */

const GameManagement = () => {

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fetchedGames, setFetchedGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [marketStatus, setMarketStatus] = useState("active");

  const sortedGameTypeOptionsAsc = useMemo(() => {
    return [...gameTypeOptions].sort((a, b) => a.localeCompare(b));
  }, []);

  const sortedGames = useMemo(() => {
    return [...fetchedGames].sort((a, b) => {
      const timeA = dayjs(a.openTime, "hh:mm A").valueOf();
      const timeB = dayjs(b.openTime, "hh:mm A").valueOf();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [fetchedGames, sortOrder]);

  const filteredGames = useMemo(() => {
    return sortedGames
      .filter((game) => {
        if (marketStatus === "active") {
          return game.isActive === true;
        } else if (marketStatus === "inactive") {
          return game.isActive === false;
        }
        return true;
      })
      .filter((game) =>
        game?.gameName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [sortedGames, marketStatus, searchTerm]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/marketManagement/getMarketGames`);
      if (response.data) {
        setFetchedGames(response.data || []);
      } else {
        message.error("Failed to fetch market games.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      message.error("Failed to fetch games.");
    } finally {
      setLoading(false);
      setFirstLoad(false);
    }
  };

  const handleGameTypeChange = (selectedValues) => {
    if (
      selectedValues.includes("Select All") ||
      selectedValues.length === sortedGameTypeOptionsAsc.length
    ) {
      setSelectedGameTypes(sortedGameTypeOptionsAsc);
      form.setFieldsValue({ gameType: sortedGameTypeOptionsAsc });
    } else {
      const filteredValues = selectedValues.filter(
        (val) => val !== "Select All"
      );
      setSelectedGameTypes(filteredValues);
      form.setFieldsValue({ gameType: filteredValues });
    }
  };

  const handleEditGameTypeChange = (selectedValues) => {
    if (
      selectedValues.includes("Select All") ||
      selectedValues.length === sortedGameTypeOptionsAsc.length
    ) {
      editForm.setFieldsValue({ gameType: sortedGameTypeOptionsAsc });
    } else {
      editForm.setFieldsValue({
        gameType: selectedValues.filter((val) => val !== "Select All"),
      });
    }
  };

  // ADD GAME (now manual HH/MM + AM/PM)
  const handleAddGame = async (values) => {
    try {
      const newGame = {
        marketName: values.marketName,
        gameName: values.gameName,
        gameType: values.gameType,
        openTime: buildTime(values.openHour, values.openMinute, values.openPeriod),
        closeTime: buildTime(values.closeHour, values.closeMinute, values.closePeriod),
        isActive: values.marketOnOff || false,
      };

      await axios.post(`/api/marketManagement/addMarketGame`, newGame);
      message.success("Game added successfully!");
      fetchGames();
      form.resetFields();
      setSelectedGameTypes([]);
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
        gameType: values.gameType,
        openTime: buildTime(values.openHour, values.openMinute, values.openPeriod),
        closeTime: buildTime(values.closeHour, values.closeMinute, values.closePeriod),
        weekends: (values.weekends || []).map((day) => ({
          ...day,
          openTime: buildTime(day.openHour, day.openMinute, day.openPeriod),
          closeTime: buildTime(day.closeHour, day.closeMinute, day.closePeriod),
          is_on: !!day.is_on,
        })),
      };

      await axios.put(
        `/api/marketManagement/updateMarketGame/${editingGame._id}`,
        updatedGame
      );
      message.success("Game updated successfully!");
      setIsModalOpen(false);
      setEditingGame(null);
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
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      width: 250,
    },
    {
      title: "Open Time",
      dataIndex: "openTime",
      key: "openTime",
      width: 180,
    },
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

    // explode top-level times
    const o = explodeTime(record.openTime);
    const c = explodeTime(record.closeTime);

    // weekends: ensure array; explode each day's times
    const weekends = (record.weekends || []).map((day) => {
      const dn = explodeTime(day.openTime);
      const dc = explodeTime(day.closeTime);
      return {
        ...day,
        openHour: dn.hour,
        openMinute: dn.minute,
        openPeriod: dn.period,
        closeHour: dc.hour,
        closeMinute: dc.minute,
        closePeriod: dc.period,
        is_on: !!day.is_on,
      };
    });

    editForm.setFieldsValue({
      gameName: record.gameName,
      gameType: record.gameType || [],
      openHour: o.hour,
      openMinute: o.minute,
      openPeriod: o.period,
      closeHour: c.hour,
      closeMinute: c.minute,
      closePeriod: c.period,
      weekends,
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

  // Quick fill buttons in edit modal
  const applyOpenToAll = () => {
    const vals = editForm.getFieldsValue();
    const weekends = (vals.weekends || []).map((d) => ({
      ...d,
      openHour: vals.openHour,
      openMinute: vals.openMinute,
      openPeriod: vals.openPeriod,
    }));
    editForm.setFieldsValue({ weekends });
  };
  const applyCloseToAll = () => {
    const vals = editForm.getFieldsValue();
    const weekends = (vals.weekends || []).map((d) => ({
      ...d,
      closeHour: vals.closeHour,
      closeMinute: vals.closeMinute,
      closePeriod: vals.closePeriod,
    }));
    editForm.setFieldsValue({ weekends });
  };
  const applyBothToAll = () => {
    const vals = editForm.getFieldsValue();
    const weekends = (vals.weekends || []).map((d) => ({
      ...d,
      openHour: vals.openHour,
      openMinute: vals.openMinute,
      openPeriod: vals.openPeriod,
      closeHour: vals.closeHour,
      closeMinute: vals.closeMinute,
      closePeriod: vals.closePeriod,
    }));
    editForm.setFieldsValue({ weekends });
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
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "25px",
            backgroundColor: "#f7fcf8",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            Add Game
          </h3>

          <Form
  form={form}
  layout="vertical"
  onFinish={handleAddGame}
  initialValues={{
    marketName: "Main Market",
    openPeriod: "AM",
    closePeriod: "AM",
  }}
>
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={4}>
      <Form.Item
        label="Market Name"
        name="marketName"
        rules={[{ required: true, message: "Select Market name" }]}
      >
        {/* Locked to Main Market */}
        <Select >
          <Option value="Main Market">Main Market</Option>
        </Select>
      </Form.Item>
    </Col>

    <Col xs={24} sm={12} md={8} lg={4}>
      <Form.Item
        label="Game Name"
        name="gameName"
        rules={[{ required: true, message: "Enter game name" }]}
      >
        <Input placeholder="Enter Game Name" />
      </Form.Item>
    </Col>

    {/* Open Time: HH / MM / AMPM */}
    <Col xs={24} sm={12} md={8} lg={6}>
      <Form.Item label="Market Open Time" required style={{ marginBottom: 0 }}>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="openHour"
              rules={[{ required: true, message: "HH" }]}
            >
              <InputNumber
                min={1}
                max={12}
                placeholder="HH"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="openMinute"
              rules={[{ required: true, message: "MM" }]}
            >
              <InputNumber
                min={0}
                max={59}
                placeholder="MM"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="openPeriod"
              rules={[{ required: true, message: "AM/PM" }]}
            >
              <Select>
                <Option value="AM">AM</Option>
                <Option value="PM">PM</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Col>

    {/* Close Time: HH / MM / AMPM */}
    <Col xs={24} sm={12} md={8} lg={6}>
      <Form.Item label="Market Close Time" required style={{ marginBottom: 0 }}>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="closeHour"
              rules={[{ required: true, message: "HH" }]}
            >
              <InputNumber
                min={1}
                max={12}
                placeholder="HH"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="closeMinute"
              rules={[{ required: true, message: "MM" }]}
            >
              <InputNumber
                min={0}
                max={59}
                placeholder="MM"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="closePeriod"
              rules={[{ required: true, message: "AM/PM" }]}
            >
              <Select>
                <Option value="AM">AM</Option>
                <Option value="PM">PM</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Col>

    <Col xs={24} sm={12} md={8} lg={4}>
      <Form.Item
        label="Game Type"
        name="gameType"
        rules={[{ required: true, message: "Select at least one game type" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select Game Types"
          value={selectedGameTypes}
          onChange={handleGameTypeChange}
          style={{ width: "100%" }}
        >
          <Option key="Select All" value="Select All">
            Select All
          </Option>
          {sortedGameTypeOptionsAsc.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>

    <Col xs={24} sm={12} md={8} lg={4}>
      <Form.Item
        label="Market On/Off"
        name="marketOnOff"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Col>
  </Row>

  <Row justify="center">
    <Col>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          style={{ fontWeight: "600", marginTop: "20px" }}
        >
          Add Market
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
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "15px",
              textAlign: "center",
              padding: "0 10px",
            }}
          >
            Game List
          </h3>

          <div style={{ padding: "0 10px" }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Sort by:" style={{ marginBottom: 0 }}>
                  <Select
                    value={sortOrder}
                    onChange={(value) => setSortOrder(value)}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="asc">Old to New</Select.Option>
                    <Select.Option value="desc">New to Old</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={18}>
                <Form.Item label="Search:" style={{ marginBottom: 0 }}>
                  <Input
                    placeholder="Search Games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ padding: "0 10px", margin: "15px 0" }}>
            <Tabs
              activeKey={marketStatus}
              onChange={(key) => setMarketStatus(key)}
              centered
              tabBarStyle={{ margin: 0 }}
            >
              <Tabs.TabPane tab="Active Market" key="active" />
              <Tabs.TabPane tab="Inactive Market" key="inactive" />
            </Tabs>
          </div>

          <div style={{ padding: "0 10px" }}>
            {firstLoad ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spin size="large" />
              </div>
            ) : filteredGames.length === 0 ? (
              <Empty
                description="No Games Available"
                style={{ padding: "20px 0" }}
                imageStyle={{ display: "block", margin: "0 auto" }}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={filteredGames}
                loading={loading}
                pagination={false}
                bordered
                scroll={{ x: true }}
                style={{
                  width: "100%",
                  overflowX: "auto",
                }}
                size="middle"
              />
            )}
          </div>
        </Card>
      </Card>

      {/* Edit Modal - Full width and manual HH/MM AM-PM */}
      <Modal
        title="Edit Game"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingGame(null);
        }}
        onOk={handleUpdate}
        width="95vw"
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Game Name"
                name="gameName"
                rules={[{ required: true, message: "Enter game name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Game Type"
                name="gameType"
                rules={[{ required: true, message: "Select at least one game type" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Game Types"
                  onChange={handleEditGameTypeChange}
                >
                  <Option key="Select All" value="Select All">
                    Select All
                  </Option>
                  {sortedGameTypeOptionsAsc.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Top-level open/close time as HH/MM/AMPM */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label="Open Time" required style={{ marginBottom: 0 }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item name="openHour" rules={[{ required: true, message: "HH" }]}>
                      <InputNumber min={1} max={12} placeholder="HH" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="openMinute" rules={[{ required: true, message: "MM" }]}>
                      <InputNumber min={0} max={59} placeholder="MM" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="openPeriod" rules={[{ required: true, message: "AM/PM" }]}>
                      <Select>
                        <Option value="AM">AM</Option>
                        <Option value="PM">PM</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Close Time" required style={{ marginBottom: 0 }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item name="closeHour" rules={[{ required: true, message: "HH" }]}>
                      <InputNumber min={1} max={12} placeholder="HH" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="closeMinute" rules={[{ required: true, message: "MM" }]}>
                      <InputNumber min={0} max={59} placeholder="MM" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="closePeriod" rules={[{ required: true, message: "AM/PM" }]}>
                      <Select>
                        <Option value="AM">AM</Option>
                        <Option value="PM">PM</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>

          {/* Apply-to-all controls */}
          <Row justify="end" gutter={8} style={{ marginBottom: 16 }}>
            <Col>
              <Button onClick={applyOpenToAll} type="primary">Apply Open to All</Button>
            </Col>
            <Col>
              <Button onClick={applyCloseToAll} type="primary" ghost>Apply Close to All</Button>
            </Col>
            <Col>
              <Button onClick={applyBothToAll} style={{ background: "#722ed1", color: "#fff" }}>
                Apply Both to All
              </Button>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {editingGame &&
              [...(editingGame.weekends || [])]
                .sort(
                  (a, b) =>
                    dayjs(a.openTime, "hh:mm A").valueOf() -
                    dayjs(b.openTime, "hh:mm A").valueOf()
                )
                .map((day, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={day.day}>
                    <Card size="small" title={day.day} style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Open Time</div>
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "openHour"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={1} max={12} placeholder="HH" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "openMinute"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={0} max={59} placeholder="MM" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "openPeriod"]}
                            rules={[{ required: true }]}
                          >
                            <Select>
                              <Option value="AM">AM</Option>
                              <Option value="PM">PM</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Close Time</div>
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "closeHour"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={1} max={12} placeholder="HH" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "closeMinute"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={0} max={59} placeholder="MM" style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name={["weekends", index, "closePeriod"]}
                            rules={[{ required: true }]}
                          >
                            <Select>
                              <Option value="AM">AM</Option>
                              <Option value="PM">PM</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name={["weekends", index, "is_on"]}
                        label="Active Status"
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