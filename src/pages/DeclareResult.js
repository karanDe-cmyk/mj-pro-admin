import React, { useState, useEffect } from 'react';
import { Modal, Table, Button,Form,Select,DatePicker } from 'antd';
import instance from "../utils/axiosInstance";

const DeclareResult = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [winnerList, setWinnerList] = useState();
  console.log(winnerList, "winnerList");

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

  const showWinnerList = async () => {
    setIsModalVisible(true);
    try {
      const response = await instance.get('http://localhost:5001/api/declareResults/showWinnerList/3d88dae8-5904-40e9-b314-4906bc064bed', {
      });
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
              <Select>
                <Select.Option value="Game A">Game A</Select.Option>
                <Select.Option value="Game B">Game B</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="session" label="Session">
              <Select>
                <Select.Option value="Session 1">Session 1</Select.Option>
                <Select.Option value="Session 2">Session 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="number" label="Number">
              <Select>
                <Select.Option value="Number 1">Number 1</Select.Option>
                <Select.Option value="Number 2">Number 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Declare Result</Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={showWinnerList}>Show Winner List</Button>
            </Form.Item>
          </Form>
        </div>

        <Modal title="Winner List" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Table columns={winnerListColumns} dataSource={winnerList} />
        </Modal>
      </div>
    </div>
  );
};

export default DeclareResult;