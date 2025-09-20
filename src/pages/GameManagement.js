import React, { useState, useEffect, useMemo } from "react";
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
  Tabs,
  Checkbox,
  Divider,
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

const GameManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  // Remove the separate 'games' state; we will use fetchedGames as our raw data source.
  const [fetchedGames, setFetchedGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" = Old to New, "desc" = New to Old
  const [marketStatus, setMarketStatus] = useState("active"); // "active" or "inactive"
  const [applyToAllDays, setApplyToAllDays] = useState(false);

  // Create a sorted copy of gameTypeOptions in ascending order.
  const sortedGameTypeOptionsAsc = [...gameTypeOptions].sort((a, b) =>
    a.localeCompare(b)
  );

  const getTodayDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getTodaysSchedule = (game) => {
    const today = getTodayDayName();
    const todaysSchedule = game.weekends.find(day => day.day === today);

    return {
      openTime: todaysSchedule?.openTime || game.openTime || 'N/A',
      closeTime: todaysSchedule?.closeTime || game.closeTime || 'N/A',
      isActive: todaysSchedule?.is_on !== undefined ? todaysSchedule.is_on : game.isActive
    };
  };

  // Compute sortedGames dynamically whenever fetchedGames or sortOrder changes.
  const sortedGames = useMemo(() => {
    return [...fetchedGames].sort((a, b) => {
      const timeA = dayjs(getTodaysSchedule(a).openTime, "hh:mm A").valueOf();
      const timeB = dayjs(getTodaysSchedule(b).openTime, "hh:mm A").valueOf();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [fetchedGames, sortOrder]);


  // Filter the sorted games by the search term.
  const filteredGames = sortedGames
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

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/marketManagement/getMarketGames`);
      if (response.data) {
        // Store the raw games data.
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

  // Handler for Add Form game type select
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

  // Handler for Edit Modal game type select
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



  const handleAddGame = async (values) => {
    try {
      const newGame = {
        marketName: values.marketName,
        gameName: values.gameName,
        gameType: values.gameType,
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
      const game = fetchedGames.find(g => g._id === id);
      const today = getTodayDayName();
      const todaysSchedule = game.weekends.find(day => day.day === today);

      // If today has a specific schedule, update just that day
      if (todaysSchedule) {
        const updatedWeekends = game.weekends.map(day =>
          day.day === today ? { ...day, is_on: !isActive } : day
        );

        await axios.put(`/api/marketManagement/updateMarketGame/${id}`, {
          weekends: updatedWeekends
        });
      } else {
        // Otherwise update the universal status
        await axios.put(`/api/marketManagement/updateMarketGame/${id}`, {
          isActive: !isActive
        });
      }

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

      // Prepare weekend data
      let weekendsData = values.weekends || [];

      // If "Apply to all days" is checked, use universal times for all days
      if (applyToAllDays && values.openTime && values.closeTime) {
        const universalOpenTime = values.openTime.format("hh:mm A");
        const universalCloseTime = values.closeTime.format("hh:mm A");

        weekendsData = weekendsData.map(day => ({
          ...day,
          openTime: universalOpenTime,
          closeTime: universalCloseTime,
        }));
      } else {
        // Format the times for individual days
        weekendsData = weekendsData.map(day => ({
          ...day,
          openTime: day.openTime ? day.openTime.format("hh:mm A") : null,
          closeTime: day.closeTime ? day.closeTime.format("hh:mm A") : null,
        }));
      }

      const updatedGame = {
        gameName: values.gameName,
        gameType: values.gameType,
        openTime: values.openTime ? values.openTime.format("hh:mm A") : null,
        closeTime: values.closeTime ? values.closeTime.format("hh:mm A") : null,
        weekends: weekendsData,
      };

      await axios.put(
        `/api/marketManagement/updateMarketGame/${editingGame._id}`,
        updatedGame
      );
      message.success("Game updated successfully!");
      setIsModalOpen(false);
      setApplyToAllDays(false);
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
      key: "openTime",
      render: (_, record) => getTodaysSchedule(record).openTime,
      width: 180,
    },
    {
      title: "Close Time",
      key: "closeTime",
      render: (_, record) => getTodaysSchedule(record).closeTime,
      width: 180,
    },
    {
      title: "Active",
      key: "isActive",
      render: (_, record) => {
        const todaysSchedule = getTodaysSchedule(record);
        return (
          <Switch
            checked={todaysSchedule.isActive}
            onChange={() => handleToggle(record._id, todaysSchedule.isActive)}
          />
        );
      },
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
    setApplyToAllDays(false);

    // Sort weekends by day order (Sunday to Saturday)
    const sortedWeekends = [...record.weekends].sort((a, b) => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return days.indexOf(a.day) - days.indexOf(b.day);
    });

    // Set the form values
    editForm.setFieldsValue({
      gameName: record.gameName,
      gameType: record.gameType || [],
      openTime: record.openTime ? moment(record.openTime, "hh:mm A") : null,
      closeTime: record.closeTime ? moment(record.closeTime, "hh:mm A") : null,
      weekends: sortedWeekends.map((day) => ({
        openTime: day.openTime ? moment(day.openTime, "hh:mm A") : null,
        closeTime: day.closeTime ? moment(day.closeTime, "hh:mm A") : null,
        is_on: day.is_on,
      })),
    });
  };

  const handleUniversalTimeChange = (field, time) => {
    if (applyToAllDays) {
      const currentValues = editForm.getFieldsValue();
      const updatedWeekends = currentValues.weekends.map(day => ({
        ...day,
        [field]: time,
      }));
      editForm.setFieldsValue({ weekends: updatedWeekends });
    }
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

          <Form form={form} layout="vertical" onFinish={handleAddGame}>
            {/* Responsive Row - will stack vertically on small screens */}
            <Row gutter={[16, 16]}>
              {/* Market Name */}
              <Col xs={24} sm={12} md={8} lg={4}>
                <Form.Item
                  label="Market Name"
                  name="marketName"
                  rules={[{ required: true, message: "Select Market name" }]}
                >
                  <Select placeholder="Select Market Name">
                    <Option value="">--Select Market Name--</Option>
                    <Option value="Main Market">Main Market</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Name */}
              <Col xs={24} sm={12} md={8} lg={4}>
                <Form.Item
                  label="Game Name"
                  name="gameName"
                  rules={[{ required: true, message: "Enter game name" }]}
                >
                  <Input placeholder="Enter Game Name" />
                </Form.Item>
              </Col>

              {/* Market Open Time */}
              <Col xs={24} sm={12} md={8} lg={4}>
                <Form.Item
                  label="Market Open Time"
                  name="openTime"
                  rules={[{ required: true, message: "Select open time" }]}
                >
                  <TimePicker
                    format="hh:mm A"
                    use12Hours
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {/* Market Close Time */}
              <Col xs={24} sm={12} md={8} lg={4}>
                <Form.Item
                  label="Market Close Time"
                  name="closeTime"
                  rules={[{ required: true, message: "Select close time" }]}
                >
                  <TimePicker
                    format="hh:mm A"
                    use12Hours
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {/* Game Type Selection */}
              <Col xs={24} sm={12} md={8} lg={4}>
                <Form.Item
                  label="Game Type"
                  name="gameType"
                  rules={[
                    {
                      required: true,
                      message: "Select at least one game type",
                    },
                  ]}
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

              {/* Market On/Off Switch */}
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

            {/* Submit Button - centered on all screens */}
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
            overflow: "hidden", // Changed from overflowX
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "15px",
              textAlign: "center",
              padding: "0 10px" // Added padding for mobile
            }}
          >
            Game List
          </h3>

          {/* Search & Filter Controls - Now properly responsive */}
          <div style={{ padding: "0 10px" }}>
            <Row gutter={[16, 16]} align="middle">
              {/* Sort By - Full width on mobile */}
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

              {/* Show Entries - Full width on mobile */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Show Entries:" style={{ marginBottom: 0 }}>
                  <Select
                    value={pageSize}
                    onChange={(value) => setPageSize(value)}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value={5}>5</Select.Option>
                    <Select.Option value={10}>10</Select.Option>
                    <Select.Option value={20}>20</Select.Option>
                    <Select.Option value={50}>50</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Search - Full width on mobile */}
              <Col xs={24} sm={24} md={12}>
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

          {/* Tabs - Full width with centered text on mobile */}
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

          {/* Table Container with responsive padding */}
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
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: false, // Hide on mobile
                  responsive: true
                }}
                bordered
                scroll={{ x: true }} // Allow horizontal scroll when needed
                style={{
                  width: "100%",
                  overflowX: "auto" // Only show scroll when needed
                }}
                size="middle" // Better for mobile
              />
            )}
          </div>
        </Card>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Game"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setApplyToAllDays(false);
        }}
        onOk={handleUpdate}
        width={800}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Game Name"
            name="gameName"
            rules={[{ required: true, message: "Enter game name" }]}
          >
            <Input />
          </Form.Item>
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

          <Card title="Universal Times" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Universal Open Time"
                  name="openTime"
                  rules={[{ required: true, message: "Enter open time" }]}
                >
                  <TimePicker
                    format="hh:mm A"
                    use12Hours
                    style={{ width: "100%" }}
                    onChange={(time) => handleUniversalTimeChange('openTime', time)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Universal Close Time"
                  name="closeTime"
                  rules={[{ required: true, message: "Enter close time" }]}
                >
                  <TimePicker
                    format="hh:mm A"
                    use12Hours
                    style={{ width: "100%" }}
                    onChange={(time) => handleUniversalTimeChange('closeTime', time)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Checkbox
                checked={applyToAllDays}
                onChange={(e) => setApplyToAllDays(e.target.checked)}
              >
                Apply these times to all days of the week
              </Checkbox>
            </Form.Item>
          </Card>

          <Card title="Individual Day Settings">
            <Row gutter={[16, 16]}>
              {editingGame &&
                [...editingGame.weekends]
                  .sort((a, b) => {
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return days.indexOf(a.day) - days.indexOf(b.day);
                  })
                  .map((day, index) => (
                    <Col span={8} key={day.day}>
                      <Card size="small" title={day.day} style={{ textAlign: "center", marginBottom: 16 }}>
                        <Form.Item
                          name={["weekends", index, "openTime"]}
                          label="Open Time"
                          rules={[{ required: true }]}
                        >
                          <TimePicker
                            format="hh:mm A"
                            use12Hours
                            style={{ width: "100%" }}
                            disabled={applyToAllDays}
                          />
                        </Form.Item>
                        <Form.Item
                          name={["weekends", index, "closeTime"]}
                          label="Close Time"
                          rules={[{ required: true }]}
                        >
                          <TimePicker
                            format="hh:mm A"
                            use12Hours
                            style={{ width: "100%" }}
                            disabled={applyToAllDays}
                          />
                        </Form.Item>
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
          </Card>
        </Form>
      </Modal>

    </div>
  );
};

export default GameManagement;
