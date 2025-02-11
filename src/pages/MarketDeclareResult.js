import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, message, Typography, Col, Row, Card, Divider } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";

const { Title } = Typography;

const MarketDeclareResult = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [marketGameList, setMarketGameList] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedMarketGame, setSelectedMarketGame] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState(null);
  const [digitValue, setDigitValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDeclareResult, setLoadingDeclareResult] = useState(false);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [winners, setWinners] = useState([]);
  const [gameResults, setGameResults] = useState([]); // Merged declared result history
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const pannaOptions = ["000", ...Array.from({ length: 900 }, (_, i) => (100 + i).toString())];

  // ---------------------------
  // FETCH MARKET & GAME LIST
  // ---------------------------
  const fetchMarketGameList = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/marketManagement/getMarketGames`);
      if (response?.data) {
        const uniqueMarkets = [
          ...new Set(
            response.data
              .map((item) => item.marketName)
              .filter((name) => name && name.trim() !== "")
          ),
        ];
        setMarketGameList(uniqueMarkets);
        setAllGames(response.data);
      }
    } catch (error) {
      console.error("Error fetching market and game list:", error);
      message.error("Failed to fetch market & game names.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // EDIT MODAL FOR BIDS
  // ---------------------------
  const handleEdit = (record) => {
    setEditingWinner(record);
    // Pre-fill the edit form with current values
    editForm.setFieldsValue({
      points: record.points,
      digit: record.digit,
    });
    setIsEditModalVisible(true);
  };

  // ---------------------------
  // FETCH DECLARED RESULTS (MERGED)
  // ---------------------------
  const fetchDeclaredResults = async () => {

    try {
      setLoading(true);
      const response = await instance.get(`/api/mainmarketdeclareResult/getDeclareResult`);
      if (response?.data?.results) {
        const results = response.data.results;
        // Group results by gameName and date (formatted as DD-MM-YYYY)
        const groupedResults = {};
        results.forEach((item) => {
          const groupKey = `${item.gameName}_${moment(item.date).format("DD-MM-YYYY")}`;
          if (!groupedResults[groupKey]) {
            groupedResults[groupKey] = {
              gameName: item.gameName,
              date: item.date,
              open: null,  // will hold an object: { value, id }
              close: null, // will hold an object: { value, id }
            };
          }
          if (item.gameType === "open") {
            groupedResults[groupKey].open = {
              value: `${item.panna}-${item.digit}`,
              id: item._id, // Use the actual declared result id
            };
          }
          if (item.gameType === "close") {
            groupedResults[groupKey].close = {
              value: `${item.panna}-${item.digit}`,
              id: item._id,
            };
          }
        });
        setGameResults(Object.values(groupedResults));
      } else {
        setGameResults([]);
      }
    } catch (error) {
      console.error("Error fetching declared results:", error);
      message.error("Failed to fetch declared results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketGameList();
    fetchDeclaredResults();
  }, []);

  // ---------------------------
  // FETCH WINNERS BASED ON FORM
  // ---------------------------
  const fetchWinners = async () => {
    const values = form.getFieldsValue();
    if (!values.marketGame || !values.gameName || !values.gameType || !values.panna) {
      message.error("Please select all required fields to show winners.");
      return;
    }
    try {
      setLoading(true);
      const response = await instance.post(`/api/showwinners/getWinningBids`, {
        marketName: values.marketGame,
        gameName: values.gameName,
        date: values.resultDate
          ? values.resultDate.format("DD-MM-YYYY")
          : moment().format("DD-MM-YYYY"),
        gameType: values.gameType,
        digit: values.digit,
        panna: values.panna,
      });
      if (response?.data?.winners && Array.isArray(response.data.winners)) {
        setWinners(response.data.winners);
      } else {
        setWinners([]);
      }
      setIsWinnerModalVisible(true);
    } catch (error) {
      console.error("Error fetching winners:", error);
      message.error("Failed to fetch winner data.");
      setWinners([]);
      setIsWinnerModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // DECLARE WINNER
  // ---------------------------
  const declareWinner = async () => {
    const values = form.getFieldsValue();
    try {
      setLoadingDeclareResult(true);
      const response = await instance.post(
        `/api/mainmarketdeclareResult/declareResult`,
        {
          marketName: values.marketGame,
          gameName: values.gameName,
          date: values.resultDate
            ? values.resultDate.format("DD-MM-YYYY")
            : moment().format("DD-MM-YYYY"),
          gameType: values.gameType,
          digit: values.digit,
          panna: values.panna,
          winners: winners.length > 0 ? winners : [],
        }
      );
      // console.log(response);
      if (response.data.success === false) {
        alert(response.data.message);
      } else {
        message.success("Result declared successfully!");
        setIsWinnerModalVisible(false);
        fetchDeclaredResults();
      }
    } catch (error) {
      message.error(
        (error.response && error.response.data && error.response.data.message) ||
        "Failed to declare winner."
      );
    } finally {
      setLoadingDeclareResult(false);
    }
  };

  // ---------------------------
  // DELETE DECLARED RESULT BY ID
  // ---------------------------
  const handleDeleteDeclaredResult = async (declaredId) => {
    try {
      await instance.delete(`/api/mainmarketdeclareResult/delete/${declaredId}`);
      message.success("Declared result deleted successfully!");
      fetchDeclaredResults();
    } catch (error) {
      message.error("Failed to delete declared result.");
    }
  };

  const handleMarketChange = (selectedMarket) => {
    const filteredGames = allGames
      .filter((game) => game.marketName === selectedMarket)
      .map((game) => game.gameName);
    setGameOptions([...new Set(filteredGames)]);
    setSelectedMarketGame(selectedMarket);
    form.setFieldsValue({ gameName: undefined });
  };

  const handlePannaChange = (value) => {
    const sum = value.split("").reduce((acc, num) => acc + parseInt(num, 10), 0);
    setDigitValue(sum % 10);
    form.setFieldsValue({ digit: sum % 10 });
  };

  // ---------------------------
  // DELETE BID (For Winner List)
  // ---------------------------
  const handleDelete = async (record) => {
    try {
      setIsDeleting(true);
      await instance.delete(`/api/bid/deleteBid/${record._id}`, {
        data: { bidId: record.bidId },
      });
      message.success("Bid deleted successfully!");
      setWinners((prev) => prev.filter((winner) => winner._id !== record._id));
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Failed to delete bid.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------------------
  // UPDATE BID (For Winner List)
  // ---------------------------
  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
      // Get new values from the edit form
      const { points: newPoints, digit: newDigit } = editForm.getFieldsValue();
      await instance.put(`/api/bid/updateBid/${editingWinner._id}`, {
        bidId: editingWinner.bidId,
        newPoints,
        newbidvalue: newDigit,
      });
      message.success("Bid updated successfully!");
      setWinners((prev) =>
        prev.map((winner) =>
          winner._id === editingWinner._id ? { ...winner, points: newPoints, digit: newDigit } : winner
        )
      );
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating bid:", error);
      message.error("Failed to update bid.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ---------------------------
  // WINNER TABLE COLUMNS
  // ---------------------------
  const winnerColumns = [
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Game Type", dataIndex: "gameType", key: "gameType" },
    { title: "Digit/Pana", dataIndex: "digit", key: "digit" },
    { title: "Bid Amount", dataIndex: "points", key: "points" },
    { title: "Winning Amount", dataIndex: "winningPoints", key: "winningPoints" },
  ];

  // ---------------------------
  // DECLARED RESULTS TABLE COLUMNS (MERGED)
  // ---------------------------
  const gameResultColumns = [
    {
      title: "S. No",
      dataIndex: "sNo",
      key: "sNo",
      render: (_, __, index) => index + 1,
    },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    {
      title: "Open",
      key: "open",
      render: (_, record) =>
        record.open ? (
          <div>
            <span>{record.open.value}</span>{" "}
            <Button
              type="danger"
              size="small"
              onClick={() => handleDeleteDeclaredResult(record.open.id)}
              style={{ backgroundColor: 'red', borderColor: 'red', color: 'white', marginLeft: '8px' }}
            >
              Delete
            </Button>
          </div>
        ) : (
          "━━"
        ),
    },
    {
      title: "Close",
      key: "close",
      render: (_, record) =>
        record.close ? (
          <div>
            <span>{record.close.value}</span>{" "}
            <Button
              type="primary"
              size="small"
              onClick={() => handleDeleteDeclaredResult(record.close.id)}
              style={{ backgroundColor: 'red', borderColor: 'red', color: 'white', marginLeft: '8px' }}
            >
              Delete
            </Button>

          </div>
        ) : (
          "━━"
        ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card scroll={{ x: 1000 }}
        title={<Title level={4} style={{ marginBottom: 0 }}>Select Market Game</Title>}
        bordered={false}
        style={{ maxWidth: "92%", margin: "auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "10px" }}
      >
        <Form form={form} layout="vertical">

          {/* Date Picker Section */}
          <div style={{ marginBottom: "12px" }}>
            <Title level={5} style={{ marginBottom: "4px" }}>Select Date</Title>
            <Form.Item name="resultDate" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
              <DatePicker format="DD-MM-YYYY" style={{ width: "150px" }} />
            </Form.Item>
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Market & Game Selection */}
          <div>
            <Title level={5} style={{ marginBottom: "4px" }}>Market & Game Selection</Title>
            <Row gutter={12}>
              {/* Market Name */}
              <Col xs={24} sm={12}>
                <Form.Item name="marketGame" label="Market Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select
                    onChange={handleMarketChange}
                    placeholder="Select Market"
                    loading={loading}
                    style={{ width: "100%" }}
                  >
                    {marketGameList.map((market, index) => (
                      <Select.Option key={index} value={market}>
                        {market}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Name */}
              <Col xs={24} sm={12}>
                <Form.Item name="gameName" label="Game Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select
                    onChange={(value) => setSelectedGameName(value)}
                    placeholder="Select Game"
                    disabled={!gameOptions.length}
                    style={{ width: "100%" }}
                  >
                    {gameOptions.map((game, index) => (
                      <Select.Option key={index} value={game}>
                        {game}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Type */}
              <Col xs={24} sm={12}>
                <Form.Item name="gameType" label="Game Type" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select placeholder="Select Type" style={{ width: "100%" }}>
                    <Select.Option value="open">Open</Select.Option>
                    <Select.Option value="close">Close</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Panna */}
              <Col xs={24} sm={12}>
                <Form.Item name="panna" label="Panna" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select onChange={handlePannaChange} placeholder="Select Panna" style={{ width: "100%" }}>
                    {pannaOptions.map((panna) => (
                      <Select.Option key={panna} value={panna}>
                        {panna}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Digit (Read-only) */}
              <Col xs={24} sm={12}>
                <Form.Item name="digit" label="Digit" style={{ marginBottom: "8px" }}>
                  <Input value={digitValue} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Buttons Section */}
          <Row gutter={12} justify="center">
  <Col style={{ margin: "10px" }}>
    <Button type="primary" onClick={fetchWinners}>
      Show Winners
    </Button>
  </Col>
  <Col style={{ margin: "10px" }}>
    <Button type="primary" loading={loadingDeclareResult} onClick={declareWinner}>
      Declare Result
    </Button>
  </Col>
</Row>

        </Form>
      </Card>
      <Modal
        title="Show Winner List"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        width="80%"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
        footer={null}
      >
        {winners.length > 0 ? (
          <Table
            columns={[
              { title: "Game Name", dataIndex: "gameName" },
              { title: "Date", dataIndex: "time" },
              { title: "Digit/Pana", dataIndex: "digit" },
              {
                title: "Type",
                render: (_, record) =>
                  record.open ? "Open" : record.close ? "Close" : "N/A",
              },
              { title: "Bid Amount", dataIndex: "points" },
              { title: "Winning Amount", dataIndex: "winningPoints" },
              {
                title: "Action",
                render: (_, record) => (
                  <div>
                    <Button type="primary" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => handleDelete(record)}
                      loading={isDeleting}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            dataSource={winners}
            rowKey="_id"
          />
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              padding: "20px",
              color: "#ff4d4f",
            }}
          >
            No winners found.
          </p>
        )}
      </Modal>
      <Modal
        title="Edit Bid"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleSaveEdit}
        confirmLoading={isSavingEdit}
      >
        <Form form={editForm} layout="vertical">
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
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{maxWidth:"92%"}} className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
        <h2 className="text-lg font-bold mb-4">Game Result History</h2>
        <Table  scroll={{ x: 1000 }}
          columns={gameResultColumns}
          dataSource={gameResults}
         
          pagination={false}
          rowKey={(record) =>
            `${record.gameName}_${moment(record.date).format("DD-MM-YYYY")}`
          }
        />
      </div>
    </div>
  );
};

export default MarketDeclareResult;
