import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, Spin, message } from "antd";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";

const DeclareResult = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gameList, setGameList] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [digitValue, setDigitValue] = useState("");
  const [winnerList, setWinnerList] = useState(null);
  const [loadingWinnerList, setLoadingWinnerList] = useState(false); // Spinner state for Winner List
  const [declear, setDeclear] = useState({});
  
  // Add loading state for Declare Result form submission
  const [loadingDeclareResult, setLoadingDeclareResult] = useState(false);

  // Add loading state for Declared Results Table
  const [loadingDeclaredResults, setLoadingDeclaredResults] = useState(false);

  // Winner List Columns
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

  // Fetch Game List
  const fetchGameList = async () => {
    try {
      const response = await instance.get(
        `${apiUrl}/api/gameRoutes/getGameList/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response?.data) {
        setGameList(response?.data);
      } else {
        throw new Error("Failed to fetch game data");
      }
    } catch (error) {
      console.error("Error fetching game list:", error);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  // Show Winner List in Modal
  const showWinnerList = async () => {
    if (!selectedGame || !digitValue) {
      message.error("Please select a game and digit to fetch winner list.");
      return;
    }
    
    setIsModalVisible(true);
    setLoadingWinnerList(true); // Show the loading spinner

    try {
      const response = await instance.get(
        `https://matka-admin-backend.onrender.com/api/declareResults/showWinnerList/3d88dae8-5904-40e9-b314-4906bc064bed/${selectedGame}/${digitValue}`
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
      setLoadingWinnerList(false); // Hide the loading spinner
    }
  };

  // Declare Result Form Submission
  const onFinish = (values) => {
    setLoadingDeclareResult(true); // Show spinner on form submission

    const declareResultBody = {
      market: values.market,
      panna: parseInt(values.panna),
      points: parseInt(values.points),
      gameName: values.gameName,
      digit: parseInt(values.digit),
    };

    instance
      .post(
        `${apiUrl}/api/declareResults/addDeclareResult/3d88dae8-5904-40e9-b314-4906bc064bed`,
        declareResultBody
      )
      .then((response) => {
        console.log("Result declared successfully:", response);

        // Fetch declared result
        setLoadingDeclaredResults(true); // Show spinner when fetching declared results
        instance
          .get(
            `${apiUrl}/api/declareResults/getDeclareResult/3d88dae8-5904-40e9-b314-4906bc064bed/PUBG/1/100/open`,
            {
              params: declareResultBody,
            }
          )
          .then((response) => {
            console.log("Declared result:", response?.data);
            setDeclear(response?.data);
          })
          .catch((error) => {
            console.error("Error fetching declared result:", error);
          })
          .finally(() => {
            setLoadingDeclaredResults(false); // Hide the spinner when data is loaded
          });
      })
      .catch((error) => {
        console.error("Error declaring result:", error);
      })
      .finally(() => {
        setLoadingDeclareResult(false); // Hide the spinner when done
      });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        {/* Select Game Section */}
        <div className="mb-8">
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
            <Form.Item name="digit" label="Digit">
              <Input onChange={(e) => setDigitValue(e.target.value)} />
            </Form.Item>
            <Form.Item name="panna" label="Panna">
              <Input />
            </Form.Item>
            <Form.Item name="points" label="Points">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loadingDeclareResult}>
                {loadingDeclareResult ? "Declaring..." : "Declare Result"}
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={showWinnerList}
              >
                Show Winner List
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Winner List Modal */}
        <Modal
          title="Winner List"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={900}
          style={{ top: 20, overflow: "auto" }}
        >
          <Spin spinning={loadingWinnerList}>
            <Table
              columns={winnerListColumns}
              dataSource={winnerList?.bids}
              loading={loadingWinnerList} // Optional: Display loading on Table itself
              rowKey="bidId"
            />
          </Spin>
        </Modal>

        {/* Declared Results Table with Spinner */}
        <Spin spinning={loadingDeclaredResults}> {/* Wrap table with Spin */}
          <Table
            columns={DeclearListColumns}
            dataSource={declear?.data}
            scroll={{ x: 1000 }}
            rowKey="bidId"
          />
        </Spin>
      </div>
    </div>
  );
};

export default DeclareResult;
