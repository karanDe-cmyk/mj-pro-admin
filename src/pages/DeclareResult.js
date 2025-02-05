import React, { useState, useEffect } from 'react';
import { Modal, Table, Button,Form,Select,DatePicker, Input } from 'antd';
import instance from "../utils/axiosInstance";

const DeclareResult = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);


  const winnerListColumns = [
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
    },
    {
      title: 'Digit',
      dataIndex: 'digit',
      key: 'digit',
    },
    {
      title: 'Panna',
      dataIndex: 'panna',
      key: 'panna',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName',
    },
    {
      title: 'Win Status',
      dataIndex: 'win',
      key: 'win',
    },
  ];
  const [gameList, setGameList] = useState(null);
  console.log("gooVibesaaaaaaa", gameList?.data);
  const fetchGameList = async () => {
    try {
      const response = await instance.get(
        `http://localhost:5001/api/gameRoutes/getGameList/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response) {
        console.log("goodVibeedsdsdds", response);
        setGameList(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchGameList();
  }, []);
  const [selectedGame, setSelectedGame] = useState(null);
  const [digitValue, setDigitValue] = useState('');
  const [winnerList, setWinnerList] = useState(null);
  console.log(winnerList, "winnerList");
  const showWinnerList = async () => {
    setIsModalVisible(true);
    try {
      const response = await instance.get(`http://localhost:5001/api/declareResults/showWinnerList/3d88dae8-5904-40e9-b314-4906bc064bed/${selectedGame}/${digitValue}`);
      console.log(response, "success");
      setWinnerList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log('Form values:', values);
    // Add your logic here to handle the form submission
  };   

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
      <Select.Option key={game.id} value={game?.gameName}>{game?.gameName}</Select.Option>
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
            <Input/>
            </Form.Item>
            <Form.Item name="points" label="Points">
            <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Declare Result</Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={showWinnerList}>Show Winner List</Button>
            </Form.Item>
          </Form>
        </div>

        <Modal title="Winner List" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Table columns={winnerListColumns} dataSource={winnerList?.bids} />
        </Modal>
      </div>
    </div>
  );
};

export default DeclareResult;