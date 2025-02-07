import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, message } from "antd";
import instance from "../utils/axiosInstance";
import { appiD } from "../utils/config";
import moment from "moment";

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
  const [gameResults, setGameResults] = useState([]); // ✅ Stores game result history
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);


  const pannaOptions = ["000", ...Array.from({ length: 900 }, (_, i) => (100 + i).toString())];

 

  const fetchMarketGameList = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/marketManagement/getMarketGames/${appiD}`);
      if (response?.data) {
        const uniqueMarkets = [
          ...new Set(response.data.map((item) => item.marketName).filter((name) => name && name.trim() !== "")),
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

    // Function to open the edit modal with selected bid data
    const handleEdit = (record) => {
      setEditingWinner(record);
      editForm.setFieldsValue({
        bidId: record.bidId,
        newPoints: record.points,
        newbidvalue: record.digit,
      });
      setIsEditModalVisible(true);
    };

    
   // ✅ Fetch Declared Results (Game Result History)
   const fetchDeclaredResults = async () => {
    if (!appiD) {
      console.warn("appiD is undefined, skipping API call.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await instance.get(`/api/mainmarketdeclareResult/getDeclareResult/${appiD}`);
      
      if (response?.data?.results) {
        setGameResults(response.data.results);
      } else {
        setGameResults([]); // Ensure empty array if no results
      }
    } catch (error) {
      console.error("Error fetching declared results:", error);
      message.error("Failed to fetch declared results. Please try again.");
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketGameList();
    fetchDeclaredResults();
  }, [appiD]);
  
  const fetchWinners = async () => {
    const values = form.getFieldsValue();
    if (!values.marketGame || !values.gameName || !values.gameType || !values.panna) {
      message.error("Please select all required fields to show winners.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await instance.post(`/api/showwinners/getWinningBids/${appiD}`, {
        marketName: values.marketGame,
        gameName: values.gameName,
        date: values.resultDate ? values.resultDate.format("DD-MM-YYYY") : moment().format("DD-MM-YYYY"),
        gameType: values.gameType,
        digit: values.digit,
        panna: values.panna,
      });
  
      // console.log("API Response:", response.data); // ✅ Debug API response
  
      if (response?.data?.winners && Array.isArray(response.data.winners)) {
        setWinners(response.data.winners);
      } else {
        setWinners([]); // ✅ Ensure winners is always an array
      }
  
      setIsWinnerModalVisible(true);
    } catch (error) {
      console.error("Error fetching winners:", error);
      message.error("Failed to fetch winner data.");
      setWinners([]); // ✅ Handle API errors gracefully
      setIsWinnerModalVisible(true); // ✅ Ensure modal opens even if error
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Declare Winner & Update Wallet
  const declareWinner = async () => {
    const values = form.getFieldsValue();
    if (!winners.length) {
      message.warning("No winners to declare.");
      return;
    }

    try {
      setLoadingDeclareResult(true);
      await instance.post(`/api/mainmarketdeclareResult/declareResult/${appiD}`, {
        marketName: values.marketGame,
        gameName: values.gameName,
        date: values.resultDate ? values.resultDate.format("DD-MM-YYYY") : moment().format("DD-MM-YYYY"),
        gameType: values.gameType,
        digit: values.digit,
        panna: values.panna,
      });

      message.success("Winner declared successfully!");
      setIsWinnerModalVisible(false);
      fetchDeclaredResults();
    } catch (error) {
      message.error("Failed to declare winner.");
    } finally {
      setLoadingDeclareResult(false);
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

  const deleteGameResult = async (id) => {
    try {
      await instance.delete(`/api/marketManagement/deleteGameResult/${appiD}/${id}`);
      message.success("Game result deleted successfully!");
      setGameResults((prevResults) => prevResults.filter((result) => result._id !== id));
    } catch (error) {
      message.error("Failed to delete game result.");
    }
  };

  const handleDelete = async (record) => {
    try {
      setIsDeleting(true);
      await instance.delete(`/api/bid/deleteBid/${appiD}/${record._id}`,{
        bidId: record.bidId,
      });
      
      message.success("Bid deleted successfully!");
      
      // Remove the deleted winner from the state
      setWinners((prev) => prev.filter((winner) => winner._id !== record._id));
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Failed to delete bid.");
    } finally {
      setIsDeleting(false);
    }
  };

    // Function to update the bid
    const handleSaveEdit = async () => {
      try {
        setIsSavingEdit(true);
        const values = editForm.getFieldsValue();
          console.log(values)
        await instance.put(`/api/bid/updateBid/${appiD}/${editingWinner._id}`, {
          bidId: editingWinner.bidId,
          newPoints: editingWinner.points,
          newbidvalue: editingWinner.digit,
        });
  
        message.success("Bid updated successfully!");
        
        // Update the local winners list dynamically
        setWinners((prev) =>
          prev.map((winner) =>
            winner._id === editingWinner._id ? { ...winner, ...values } : winner
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


  const winnerColumns = [
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Game Type", dataIndex: "gameType", key: "gameType" },
    { title: "Digit/Pana", dataIndex: "digit", key: "digit" },
    { title: "Bid Amount", dataIndex: "points", key: "points" },
    { title: "Winning Amount", dataIndex: "winningPoints", key: "winningPoints" },
  ];

  const gameResultColumns = [
    { title: "S. No", dataIndex: "sNo", key: "sNo", render: (_, __, index) => index + 1 },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Panna", dataIndex: "panna", key: "panna" },
    { title: "Digit", dataIndex: "digit", key: "digit" },
    { title: "Total Winners", dataIndex: "totalWinners", key: "totalWinners" },
    { title: "Date", dataIndex: "date", key: "date", render: (date) => moment(date).format("DD-MM-YYYY") },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => deleteGameResult(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 className="text-lg font-bold mb-4">Select Market Game</h1>
        <Form form={form}>
          <Form.Item name="resultDate" label="Date" rules={[{ required: true }]}>
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item name="marketGame" label="Market Name" rules={[{ required: true }]}>
            <Select onChange={handleMarketChange} placeholder="Select Market" loading={loading}>
              {marketGameList.map((market, index) => (
                <Select.Option key={index} value={market}>
                  {market}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="gameName" label="Game Name" rules={[{ required: true }]}>
            <Select
              onChange={(value) => setSelectedGameName(value)}
              placeholder="Select Game"
              disabled={!gameOptions.length}
            >
              {gameOptions.map((game, index) => (
                <Select.Option key={index} value={game}>
                  {game}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="gameType" label="Game Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="close">Close</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="panna" label="Panna" rules={[{ required: true }]}>
            <Select onChange={handlePannaChange}>
              {pannaOptions.map((panna) => (
                <Select.Option key={panna} value={panna}>
                  {panna}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="digit" label="Digit">
            <Input value={digitValue} readOnly />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={fetchWinners}>
              Show Winners
            </Button>
            <Button type="primary" loading={loadingDeclareResult} onClick={declareWinner} className="ml-2">
              Declare Result
            </Button>
          </Form.Item>
        </Form>
      </div>

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
                render: (_, record) => (record.open ? "Open" : record.close ? "Close" : "N/A"),
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
          <p style={{ textAlign: "center", fontSize: "16px", padding: "20px", color: "#ff4d4f" }}>
            No winners found.
          </p>
        )}
</Modal>
         {/* Edit Bid Modal */}
      <Modal
        title="Edit Bid"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleSaveEdit}
        confirmLoading={isSavingEdit}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Bid Amount" name="points" rules={[{ required: true, message: "Please enter bid amount" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Bid Number" name="digit" rules={[{ required: true, message: "Please enter bid number" }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
        <h2 className="text-lg font-bold mb-4">Game Result History</h2>
        <Table columns={gameResultColumns} dataSource={gameResults} pagination={false} rowKey="_id" />
      </div>
      
    </div>
    
  );
};

export default MarketDeclareResult;
