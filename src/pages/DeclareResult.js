import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, Spin, message } from "antd";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";

const DeclareResult = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gameList, setGameList] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [pannaValue, setPannaValue] = useState("");
  const [digitValue, setDigitValue] = useState("");
  const [winnerList, setWinnerList] = useState(null);
  const [loadingWinnerList, setLoadingWinnerList] = useState(false);
  const [declear, setDeclear] = useState({});
  const [loadingDeclareResult, setLoadingDeclareResult] = useState(false);
  const [loadingDeclaredResults, setLoadingDeclaredResults] = useState(false);

  // Winner List Table Columns
  const winnerListColumns = [
    { title: "Bid ID", dataIndex: "bidId", key: "bidId" },
    { title: "Digit", dataIndex: "digit", key: "digit" },
    { title: "Panna", dataIndex: "panna", key: "panna" },
    { title: "Points", dataIndex: "points", key: "points" },
    { title: "Market", dataIndex: "market", key: "market" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Win Status", dataIndex: "win", key: "win" },
  ];

  // Declared Results Table Columns
  const DeclearListColumns = [
    { title: "Bid ID", dataIndex: "bidId", key: "bidId" },
    { title: "Digit", dataIndex: "digit", key: "digit" },
    { title: "Panna", dataIndex: "panna", key: "panna" },
    { title: "Points", dataIndex: "points", key: "points" },
    { title: "Market", dataIndex: "market", key: "market" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Win", dataIndex: "win", key: "win" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt" },
  ];

  const pannaOptions = Array.from({ length: 900 }, (_, i) => (100 + i).toString());

  const handlePannaChange = (value) => {
    setPannaValue(value);
    setDigitValue(value[value.length - 1]);
    form.setFieldsValue({ digit: value[value.length - 1] });
  };

  // Fetch Game List
  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const response = await instance.get(`${apiUrl}/api/gameRoutes/getGameList/3d88dae8-5904-40e9-b314-4906bc064bed`);
        if (response?.data) {
          setGameList(response?.data);
        } else {
          throw new Error("Failed to fetch game data");
        }
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };
    fetchGameList();
  }, []);

  // Show Winner List
  const showWinnerList = async () => {
    if (!selectedGame || !pannaValue) {
      message.error("Please select a game and panna to fetch winner list.");
      return;
    }
  
    setIsModalVisible(true);
    setLoadingWinnerList(true);
  
    try {
      const response = await instance.get(
        `${apiUrl}/api/declareResults/showWinnerList/3d88dae8-5904-40e9-b314-4906bc064bed/${selectedGame}/${pannaValue}`
      );
      if (response?.data) {
        setWinnerList(response.data);
      } else {
        message.error("No winner data found.");
        setWinnerList(null);
      }
    } catch (error) {
      console.error("Error fetching winner list:", error);
      message.error("Failed to fetch winner list.");
      setWinnerList(null);
    } finally {
      setLoadingWinnerList(false);
    }
  };

  // Declare Result Form Submission
  const onFinish = (values) => {
    setLoadingDeclareResult(true);

    const declareResultBody = {
      market: values.market,
      panna: pannaValue,  // Storing selected panna
      digit: digitValue,  // Storing derived digit
      points: parseInt(values.points),
      gameName: values.gameName,
    };

    instance
      .post(`${apiUrl}/api/declareResults/addDeclareResult/3d88dae8-5904-40e9-b314-4906bc064bed`, declareResultBody)
      .then(() => {
        setLoadingDeclaredResults(true);

        return instance.get(
          `${apiUrl}/api/declareResults/getDeclareResult/3d88dae8-5904-40e9-b314-4906bc064bed/${values.gameName}/${values.market}/${pannaValue}`,
          { params: declareResultBody }
        );
      })
      .then((response) => {
        setDeclear(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching declared result:", error);
      })
      .finally(() => {
        setLoadingDeclareResult(false);
        setLoadingDeclaredResults(false);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 className="text-lg font-bold mb-4">Select Game</h1>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="resultDate" label="Result Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="gameName" label="Game Name">
            <Select onChange={(value) => setSelectedGame(value)}>
              {gameList?.data?.map((game) => (
                <Select.Option key={game.id} value={game?.gameName}>
                  {game?.gameName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="market" label="Market">
            <Select>
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="close">Close</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="panna" label="Panna">
            <Select onChange={handlePannaChange}>
              {pannaOptions.map((num) => (
                <Select.Option key={num} value={num}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="digit" label="Digit">
            <Input value={digitValue} disabled />
          </Form.Item>
          <Form.Item name="points" label="Points">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loadingDeclareResult}>
              {loadingDeclareResult ? "Declaring..." : "Declare Result"}
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={showWinnerList}>
              Show Winner List
            </Button>
          </Form.Item>
        </Form>

        <Modal title="Winner List" visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
          <Spin spinning={loadingWinnerList}>
            <Table columns={winnerListColumns} dataSource={winnerList?.bids} rowKey="bidId" />
          </Spin>
        </Modal>

        <Spin spinning={loadingDeclaredResults}>
          <Table columns={DeclearListColumns} dataSource={declear?.data} rowKey="bidId" />
        </Spin>
      </div>
    </div>
  );
};

export default DeclareResult;
