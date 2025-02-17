import React, { useState } from 'react';
import { Table, Input, DatePicker, Button, Form, Row, Col, Select, Pagination } from 'antd';
import moment from 'moment';

const { Option } = Select;

const GalidisawerDeclareResults = () => {
  const [filters, setFilters] = useState({
    date: null,
    game: '',
    pana: '',
    leftDigit: '',
    rightDigit: ''
  });

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');

  const games = ['Pana', 'Lotto', 'Bingo'];  // Game names, you can extend this list
  const pannaOptions = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));  // Panna values from 00-99

  const handleFilterChange = (value, key) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePannaChange = (value) => {
    // Automatically split the Panna value into Left and Right Digits
    setFilters(prev => ({
      ...prev,
      pana: value,
      leftDigit: value[0], // Left digit is the first character
      rightDigit: value[1] // Right digit is the second character
    }));
  };

  const handleSearch = () => {
    // This is where you can filter your data based on the filter state and search text
    const filteredData = [];  // Implement your filtering logic here
    setData(filteredData);
  };

 
  const columns = [
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName',
    },
    {
      title: 'Result Date',
      dataIndex: 'resultDate',
      key: 'resultDate',
      render: (text) => moment(text).format('MM/DD/YYYY'),
    },
    {
      title: 'Open Pana',
      dataIndex: 'openPana',
      key: 'openPana',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link">View</Button>,
    },
  ];

  return (
    <div style={{padding:'10px'}}>
      <h1>Galidisawer Declare Results</h1>

      <Form layout="vertical" onFinish={handleSearch}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Date">
              <DatePicker
                value={filters.date}
                onChange={(date) => handleFilterChange(date, 'date')}
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Game">
              <Select
                value={filters.game}
                onChange={(value) => handleFilterChange(value, 'game')}
                style={{ width: '100%' }}
              >
                {games.map(game => (
                  <Option key={game} value={game}>{game}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Pana">
              <Select
                value={filters.pana}
                onChange={handlePannaChange}
                style={{ width: '100%' }}
              >
                {pannaOptions.map(panna => (
                  <Option key={panna} value={panna}>{panna}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Left Digit">
              <Input
                value={filters.leftDigit}
                disabled
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Right Digit">
              <Input
                value={filters.rightDigit}
                disabled
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

          <Col xs={24} sm={24} md={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit" >
                Search
              </Button>
            </Form.Item>
          </Col>
      </Form> 

      {/* Custom Layout for pagination and search filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <span>Show </span>
          <Select 
            defaultValue={pagination.pageSize} 
            style={{ width: 60 }} 
            onChange={(value) => setPagination({ ...pagination, pageSize: value })}
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
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Form.Item>
      </div>

      {/* Table with pagination */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}  // Disable default pagination, custom pagination is being used
        locale={{
          emptyText: 'No data available in table',
        }}
      />

      {/* Pagination Control */}
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={data.length}
     
        style={{ marginTop: '16px', textAlign: 'right' }}
      />
    </div>
  );
};

export default GalidisawerDeclareResults;
