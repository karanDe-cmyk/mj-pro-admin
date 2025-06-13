import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Button,
  Form,
  Row,
  Col,
  Select,
  Pagination,
  Card,
  Modal
} from 'antd';
import moment from 'moment';
// import axiosInstance from "../../utils/axiosInstance";
import axios from 'axios';
import dayjs from "dayjs";
const { Option } = Select;
const GalidisawerDeclareResults = () => {
  const [filters, setFilters] = useState({
    date: dayjs(),
    game: '', // now holds game _id
    open_time: '', // will be set based on selected game or chosen manually
    pana: '',
    leftDigit: '',
    rightDigit: ''
  });
  const [data, setData] = useState([]);
  const [winnersData, setWinnersData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');
  const [gameOptions, setGameOptions] = useState([]);
  const pannaOptions = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();
  const getOpenTimeOptions = () => {
    if (filters.game) {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      if (selectedGame) {
        return [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")];
      }
      return [];
    } else {
      return Array.from(
        new Set(
          gameOptions.map(option =>
            moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
          )
        )
      );
    }
  };
  const fetchDeclareResults = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get('https://maya-api.kglame.com/api/JackpotDeclareResult/getResult',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching declare results:", error);
    }
  };
  useEffect(() => {
    fetchDeclareResults();
  }, []);
  const handleDeleteDeclareResult = async (record) => {
    if (window.confirm("Are you sure you want to delete this declare result?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`https://maya-api.kglame.com/api/JackpotDeclareResult/delete/${record._id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        alert("Declare result deleted successfully. The winning amount has been deducted from the user's wallet.");
        fetchDeclareResults();
      } catch (error) {
        console.error("Error deleting declare result:", error);
        alert("Error deleting declare result");
      }
    }
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios.get('https://maya-api.kglame.com/api/jackpotMarket/getAllMarket',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setGameOptions(response.data.data);
        } else {
          setGameOptions([]);
        }
      })
      .catch(error => {
        console.error("Error fetching game options:", error);
      });
  }, []);
  const handleFilterChange = (value, key) => {
    if (key === 'game') {
      setFilters(prev => ({ ...prev, [key]: value, open_time: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  const handlePannaChange = (value) => {
    setFilters(prev => ({
      ...prev,
      pana: value,
      leftDigit: value[0] || '',
      rightDigit: value[1] || ''
    }));
  };
  const handleShowWinnersClick = async () => {
    try {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';
      const reqBody = {
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        pana: filters.pana,
        leftDigit: filters.leftDigit,
        rightDigit: filters.rightDigit
      };
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://maya-api.kglame.com/api/jackpotWinners/showwinners",
        reqBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setWinnersData(response.data.winners);
    } catch (error) {
      console.error("Error calling show winners API:", error);
    }
  };
  const handleDeclareResultClick = async () => {
    try {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';
      const reqBody = {
        marketName: "Gali Disawar",
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        pana: filters.pana,
        leftDigit: filters.leftDigit,
        rightDigit: filters.rightDigit
      };
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "https://maya-api.kglame.com/api/JackpotDeclareResult/declare",
        reqBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      alert("Result Declared successfully!");
      setTimeout(() => {
        fetchDeclareResults();
      }, 100);
    } catch (error) {
      console.error("Error calling declare result API:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
        setTimeout(() => {
          fetchDeclareResults();
        }, 100);
      } else {
        alert("Error declaring result. Please try again.");
      }
    }
  };
  const handleEdit = (record) => {
    setEditingRecord(record);
    const computedBidNum =
      record.pana && record.pana !== "false"
        ? record.pana
        : record.leftDigit && record.leftDigit !== "false"
          ? record.leftDigit
          : record.rightDigit && record.rightDigit !== "false"
            ? record.rightDigit
            : "";
    editForm.setFieldsValue({
      bidPoints: record.bidPoints,
      bidNumber: computedBidNum
    });
    setIsEditModalVisible(true);
  };
  const handleDelete = async (record) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`https://maya-api.kglame.com/api/jackpotWinners/deletewinner/${record._id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        handleShowWinnersClick();
      } catch (error) {
        console.error("Error deleting bid:", error);
      }
    }
  };
  const handleEditFinish = async (values) => {
    try {
      let updatePayload = { points: Number(values.bidPoints) };
      if (editingRecord.bidType === "pana") {
        updatePayload.pana = values.bidNumber;
      } else if (editingRecord.bidType === "leftDigit") {
        updatePayload.leftdigit = values.bidNumber;
      } else if (editingRecord.bidType === "rightDigit") {
        updatePayload.rightdigit = values.bidNumber;
      }
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `https://maya-api.kglame.com/api/jackpotWinners/updatewinner/${editingRecord._id}`,
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setIsEditModalVisible(false);
      setEditingRecord(null);
      handleShowWinnersClick();
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };
  const columns = [
    {
      title: '#',
      key: 'serial',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName'
    },
    {
      title: 'Result Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
    },
    {
      title: 'Open Pana',
      dataIndex: 'jodiDigit',
      key: 'jodiDigit'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', marginRight: '8px' }}
          onClick={() => handleDeleteDeclareResult(record)}
        >
          Delete
        </Button>
      )
    }
  ];
  const winnersColumns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Bid Points',
      dataIndex: 'bidPoints',
      key: 'bidPoints'
    },
    {
      title: 'Winning Points',
      dataIndex: 'winningPoints',
      key: 'winningPoints'
    },
    {
      title: 'Bid Type',
      dataIndex: 'bidType',
      key: 'bidType'
    },
    {
      title: 'Market Name',
      dataIndex: 'marketName',
      key: 'marketName'
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName'
    },
    {
      title: 'Bid Number',
      key: 'bidNumber',
      render: (_, record) => {
        let bidNum = "";
        if (record.pana && record.pana !== "false") {
          bidNum = record.pana;
        } else if (record.leftDigit && record.leftDigit !== "false") {
          bidNum = record.leftDigit;
        } else if (record.rightDigit && record.rightDigit !== "false") {
          bidNum = record.rightDigit;
        }
        return bidNum;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button
            style={{ backgroundColor: '#1890ff', color: 'white', marginRight: '8px' }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            style={{ backgroundColor: '#ff4d4f', color: 'white' }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </span>
      )
    }
  ];
  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          backgroundColor: '#f0f2f5',
          padding: '10px'
        }}
      >
        JackPot Declare Results
      </h1>
      <Card style={{ marginBottom: '20px' }}>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Date">
                <DatePicker
                  value={filters.date}
                  onChange={(date) => handleFilterChange(date, 'date')}
                  format="DD-MM-YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Game">
                <Select
                  showSearch
                  value={filters.game}
                  placeholder="Select Game"
                  onChange={(value) => handleFilterChange(value, 'game')}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {gameOptions.map((option) => {
                    const formattedTime = moment(option.open_time, "hh:mm:ssA").format("hh:mm A");
                    return (
                      <Option key={option._id} value={option._id}>
                        {`${option.game_name} ${formattedTime}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Open Time">
                <Select
                  showSearch
                  value={filters.open_time}
                  placeholder="Select Open Time"
                  onChange={(value) => handleFilterChange(value, 'open_time')}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {getOpenTimeOptions().map((timeOption) => (
                    <Option key={timeOption} value={timeOption}>
                      {timeOption}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Pana">
                <Select
                  showSearch
                  value={filters.pana}
                  placeholder="Select Pana"
                  onChange={handlePannaChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {pannaOptions.map((panna) => (
                    <Option key={panna} value={panna}>
                      {panna}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Left Digit">
                <Input value={filters.leftDigit} disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Right Digit">
                <Input value={filters.rightDigit} disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '10px'
        }}
      >
        <Button type="default" onClick={handleShowWinnersClick}>
          Show Winners
        </Button>
        <Button type="primary" onClick={handleDeclareResultClick}>
          Declare Result
        </Button>
      </div>
      <Card style={{ marginBottom: '20px' }}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            backgroundColor: '#f0f2f5',
            padding: '10px'
          }}
        >
          Winners List
        </h2>
        <Table
          columns={winnersColumns}
          dataSource={winnersData}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: 'No winners available' }}
          scroll={{ x: '100%' }}
        />
      </Card>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          <div>
            <span>Show </span>
            <Select
              defaultValue={pagination.pageSize}
              style={{ width: 70 }}
              onChange={(value) =>
                setPagination(prev => ({ ...prev, pageSize: value }))
              }
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            <span> entries</span>
          </div>
          <Form.Item label="Search" style={{ marginBottom: 0 }}>
            <Input
              placeholder="Search by User Name or TXID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: 'No data available in table' }}
          scroll={{ x: '100%' }}
        />
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={data.length}
            onChange={(page) =>
              setPagination(prev => ({ ...prev, current: page }))
            }
          />
        </div>
      </Card>
      <Modal
        title="Edit Bid"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item
            label="Bid Points"
            name="bidPoints"
            rules={[{ required: true, message: "Please enter bid points" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Bid Number"
            name="bidNumber"
            rules={[{ required: true, message: "Please enter bid number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Bid
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default GalidisawerDeclareResults;