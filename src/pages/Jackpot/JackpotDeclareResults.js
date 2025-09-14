import React, { useState, useEffect } from 'react';
import {
  Table, Input, DatePicker, Button, Form, Row, Col,
  Select, Card, message, Modal, Typography, Tag
} from 'antd';
import moment from 'moment';
import axios from '../../utils/axiosInstance';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;
const { Title } = Typography;

const JackpotDeclareResults = () => {
  const [filters, setFilters] = useState({
    date: dayjs(),
    game: '',
    open_time: '',
    declaredDigit: ''
  });
  const [data, setData] = useState([]);
  const [winnersData, setWinnersData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [gameOptions, setGameOptions] = useState([]);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [winnerForm] = Form.useForm();
  const [allMarketsWithResults, setAllMarketsWithResults] = useState([]);

  // Fetch all markets and results
  const fetchData = async () => {
    try {
      // Fetch all markets
      const marketsRes = await axios.get('/api/jackpotMarket/getAllMarket');
      const markets = marketsRes.data.data || [];
      setGameOptions(markets);

      // Fetch declared results
      const resultsRes = await axios.get('/api/JackpotDeclareResult/getResult');
      const results = resultsRes.data.results || [];

      // Combine markets with results
      const combinedData = markets.map(market => {
        // Find result for this market on the selected date
        const marketResult = results.find(result =>
          result.gameName === market.game_name &&
          result.open_time === moment(market.open_time, "hh:mm:ssA").format("hh:mm A") &&
          result.date === filters.date.format("YYYY-MM-DD")
        );

        return {
          _id: market._id,
          gameName: market.game_name,
          open_time: moment(market.open_time, "hh:mm:ssA").format("hh:mm A"),
          declaredDigit: marketResult ? marketResult.declaredDigit : "--",
          resultId: marketResult ? marketResult._id : null,
          hasResult: !!marketResult,
          date: filters.date.format("YYYY-MM-DD")
        };
      });

      setAllMarketsWithResults(combinedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      message.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.date]);

  const getOpenTimeOptions = () => {
    if (filters.game) {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      return selectedGame ? [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")] : [];
    }
    return [...new Set(
      gameOptions.map(option =>
        moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
      )
    )];
  };

  const handleDeleteDeclareResult = async (record) => {
    if (window.confirm("Delete this result?")) {
      try {
        await axios.delete(`/api/JackpotDeclareResult/delete/${record.resultId}`);
        toast.success("Deleted successfully");
        fetchData();
      } catch (err) {
        message.error("Failed to delete");
      }
    }
  };

  const handleFilterChange = (value, key) => {
    setFilters(prev => ({ ...prev, [key]: value, ...(key === 'game' && { open_time: '' }) }));
  };

  const handleShowWinnersClick = async () => {
    try {
      const selectedGame = gameOptions.find(g => g._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} [ ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")} ]`
        : '';

      const body = {
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        digit: filters.declaredDigit
      };

      const res = await axios.post("/api/jackpotWinners/showwinners", body);
      setWinnersData(res.data.winners);
    } catch (err) {
      message.error("Failed to fetch winners");
    }
  };

  const handleDeclareResultClick = async () => {
    try {
      const selectedGame = gameOptions.find(g => g._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';

      const body = {
        marketName: "Jackpot",
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        declaredDigit: filters.declaredDigit
      };

      await axios.post("/api/JackpotDeclareResult/declare", body);
      toast.success("Result declared!");
      fetchData();
    } catch (err) {
      message.error("Failed to declare result");
    }
  };

  const handleEditWinner = (record) => {
    setEditingWinner(record);
    winnerForm.setFieldsValue({
      userName: record.userName,
      points: record.bidPoints,
      winningPoints: record.winningPoints,
      digit: record.digit
    });
    setIsWinnerModalOpen(true);
  };

  const handleUpdateWinner = async () => {
    try {
      const values = await winnerForm.validateFields();
      const payload = {
        points: values.points,
        digit: values.digit
      };

      await axios.put(
        `/api/jackpotBid/updateBid/${editingWinner._id}`,
        payload
      );

      toast.success("Bid updated successfully");
      setIsWinnerModalOpen(false);
      setEditingWinner(null);
      handleShowWinnersClick();
    } catch (err) {
      console.error("Error updating bid:", err);
      message.error(err.response?.data?.message || "Failed to update bid");
    }
  };

  const columns = [
    {
      title: '#',
      render: (_, __, index) => index + 1,
      width: 50
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      width: 150
    },
    {
      title: 'Open Time',
      dataIndex: 'open_time',
      width: 100
    },
    {
      title: 'Result Date',
      dataIndex: 'date',
      render: text => moment(text).format('DD-MM-YYYY'),
      width: 120
    },
    {
      title: 'Winning Digit',
      dataIndex: 'declaredDigit',
      render: (digit, record) => (
        <Tag color={digit === "--" ? "default" : "green"}>
          {digit}
        </Tag>
      ),
      width: 100
    },
    {
      title: 'Action',
      render: (_, record) => (
        record.hasResult ? (
          <Button danger onClick={() => handleDeleteDeclareResult(record)}>Delete</Button>
        ) : null
      ),
      width: 100
    }
  ];

  const winnersColumns = [
    { title: 'User Name', dataIndex: 'userName', width: 120 },
    { title: 'Bid Points', dataIndex: 'bidPoints', width: 100 },
    { title: 'Winning Points', dataIndex: 'winningPoints', width: 120 },
    { title: 'Market Name', dataIndex: 'marketName', width: 120 },
    { title: 'Game Name', dataIndex: 'gameName', width: 150 },
    { title: 'Digit', dataIndex: 'digit', width: 80 },
    {
      title: 'Date',
      dataIndex: 'date',
      render: text => text ? moment(text).format('YYYY-MM-DD') : '',
      width: 120
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEditWinner(record)}>
          Edit
        </Button>
      ),
      width: 100
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Jackpot Declare Results</Title>

      <Card style={{ marginBottom: 20 }}>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col md={4}>
              <Form.Item label="Date">
                <DatePicker
                  value={filters.date}
                  onChange={date => handleFilterChange(date, 'date')}
                  format="DD-MM-YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item label="Game">
                <Select
                  showSearch
                  value={filters.game}
                  placeholder="Select Game"
                  onChange={value => handleFilterChange(value, 'game')}
                  style={{ width: '100%' }}
                >
                  {gameOptions.map(opt => (
                    <Option key={opt._id} value={opt._id}>
                      {`${opt.game_name} ${moment(opt.open_time, "hh:mm:ssA").format("hh:mm A")}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={4}>
              <Form.Item label="Open Time">
                <Select
                  showSearch
                  value={filters.open_time}
                  placeholder="Open Time"
                  onChange={value => handleFilterChange(value, 'open_time')}
                  style={{ width: '100%' }}
                >
                  {getOpenTimeOptions().map(time => (
                    <Option key={time} value={time}>{time}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={4}>
              <Form.Item label="Digit">
                <Input
                  value={filters.declaredDigit}
                  onChange={e => handleFilterChange(e.target.value, 'declaredDigit')}
                  maxLength={2}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Button
          onClick={handleShowWinnersClick}
          style={{ marginRight: 8 }}
          disabled={!filters.declaredDigit}
        >
          Show Winners
        </Button>
        <Button type="primary" onClick={handleDeclareResultClick}>Declare Result</Button>
      </div>

      <Card title="Winners List" style={{ marginBottom: 20 }}>
        <Table
          columns={winnersColumns}
          dataSource={winnersData}
          rowKey="_id"
          pagination={false}
          scroll={{ x: '100%' }}
          size="small"
        />
      </Card>

      <Card
        title="All Markets with Results"
        extra={
          <Input
            placeholder="Search by Game Name"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={allMarketsWithResults.filter(item =>
            item.gameName?.toLowerCase().includes(searchText.toLowerCase())
          )}
          rowKey="_id"
          pagination={false}
          scroll={{ x: '100%' }}
          size="small"
        />
      </Card>

      {/* Winner Edit Modal */}
      <Modal
        title="Edit Winner"
        open={isWinnerModalOpen}
        onOk={handleUpdateWinner}
        onCancel={() => {
          setIsWinnerModalOpen(false);
          setEditingWinner(null);
        }}
      >
        <Form form={winnerForm} layout="vertical">
          <Form.Item
            name="userName"
            label="User Name"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="points"
            label="Bid Points"
            rules={[{ required: true, message: 'Please enter bid points' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="winningPoints"
            label="Winning Points"
          >
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item
            name="digit"
            label="Digit"
            rules={[{ required: true, message: 'Please enter digit' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JackpotDeclareResults;