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
import axiosInstance from "../../utils/axiosInstance";

const { Option } = Select;

const GalidisawerDeclareResults = () => {
  const [filters, setFilters] = useState({
    // Set the current date by default in moment format (DD-MM-YYYY)
    date: moment(),
    game: '',
    pana: '',
    leftDigit: '',
    rightDigit: ''
  });

  // Main "Declare Results" table data
  const [data, setData] = useState([]);

  // Show Winners table data (with your requested fields)
  const [winnersData, setWinnersData] = useState([]);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');

  // Game options fetched from API
  const [gameOptions, setGameOptions] = useState([]);

  // Pana options remains same
  const pannaOptions = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  // State for edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();



  // Fetch declare results from API
  const fetchDeclareResults = async () => {
    try {
      const response = await axiosInstance.get('/api/GaliDisawarDeclareResult/getResult');
      // console.log("Fetch declare results response:", response.data);
      // Assuming the response data is { results: [ ... ] }
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching declare results:", error);
    }
  };

  useEffect(() => {
    fetchDeclareResults();
  }, []);

   // Delete handler: calls DELETE API and refreshes data.
   const handleDeleteDeclareResult = async (record) => {
    if (window.confirm("Are you sure you want to delete this declare result?")) {
      try {
        const response = await axiosInstance.delete(`/api/GaliDisawarDeclareResult/delete/${record._id}`);
        // console.log("Delete response:", response.data);
        alert("Declare result deleted successfully. The winning amount has been deducted from the user's wallet.");
        fetchDeclareResults();
      } catch (error) {
        console.error("Error deleting declare result:", error);
        alert("Error deleting declare result");
      }
    }
  };



  // Fetch game options from API when component mounts
  useEffect(() => {
    axiosInstance.get('/api/GaliDisawar/getAllMarket')
      .then(response => {
        // Assuming the response data is an array of objects
        setGameOptions(response.data);
      })
      .catch(error => {
        console.error("Error fetching game options:", error);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (value, key) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePannaChange = (value) => {
    // Automatically split the Panna value into Left and Right Digits
    setFilters((prev) => ({
      ...prev,
      pana: value,
      leftDigit: value[0] || '',
      rightDigit: value[1] || ''
    }));
  };

  // Show Winners API call
  const handleShowWinnersClick = async () => {
    // console.log('Show Winners button clicked');
    try {
      // Prepare request body using filters (ensure date is formatted as "DD-MM-YYYY")
      const reqBody = {
        date: filters.date.format("DD-MM-YYYY"),
        game: filters.game,
        pana: filters.pana,
        leftDigit: filters.leftDigit,
        rightDigit: filters.rightDigit
      };
      // console.log("Sending reqBody:", reqBody);
      const response = await axiosInstance.post(
        "/api/GaliDisawarWinners/showwinners",
        reqBody
      );
      // console.log("API Response:", response.data);
      setWinnersData(response.data.winners);
    } catch (error) {
      console.error("Error calling show winners API:", error);
    }
  };

  // Declare Result button handler
  const handleDeclareResultClick = async () => {
    // console.log('Declare Result button clicked');
    try {
      // Build the request body. MarketName is static.
      const reqBody = {
        marketName: "Gali Disawar",
        date: filters.date.format("DD-MM-YYYY"),  // e.g., "17-02-2025"
        game: filters.game,                       // from the input box
        pana: filters.pana,                       // from the input box
        leftDigit: filters.leftDigit,             // auto-populated based on pana
        rightDigit: filters.rightDigit            // auto-populated based on pana
      };
      // console.log("Sending declare reqBody:", reqBody);
      
      // Call the API.
      const response = await axiosInstance.post(
        "/api/GaliDisawarDeclareResult/declare",
        reqBody
      );
      // console.log("Declare API response:", response.data);
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
  

  // Edit handler: Open modal and set editing record.
  const handleEdit = (record) => {
    // console.log("Edit clicked for:", record);
    setEditingRecord(record);
    // Compute bid number based on priority: pana, then leftDigit, then rightDigit.
    const computedBidNum =
      record.pana && record.pana !== "false"
        ? record.pana
        : record.leftDigit && record.leftDigit !== "false"
        ? record.leftDigit
        : record.rightDigit && record.rightDigit !== "false"
        ? record.rightDigit
        : "";
    // Pre-fill the form with current values.
    editForm.setFieldsValue({
      bidPoints: record.bidPoints,
      bidNumber: computedBidNum
    });
    setIsEditModalVisible(true);
  };
  
  

  // Delete handler: Confirm and then call delete API.
  const handleDelete = async (record) => {
    // console.log("Delete clicked for:", record);
    if (window.confirm("Are you sure you want to delete this bid?")) {
      try {
        const response = await axiosInstance.delete(
          `/api/GaliDisawarWinners/deletewinner/${record._id}`
        );
        // console.log("Delete response:", response.data);
        // Refresh winners data
        handleShowWinnersClick();
      } catch (error) {
        console.error("Error deleting bid:", error);
      }
    }
  };

  // Handle edit modal form submission.
  const handleEditFinish = async (values) => {
    try {
      // Build update payload. We allow updating bid points and the specific bid number field.
      let updatePayload = { points: Number(values.bidPoints) };
      // Use editingRecord.bidType to determine which digit field to update.
      // It should be one of: "pana", "leftDigit", or "rightDigit".
      if (editingRecord.bidType === "pana") {
        updatePayload.pana = values.bidNumber;
      } else if (editingRecord.bidType === "leftDigit") {
        updatePayload.leftdigit = values.bidNumber;
      } else if (editingRecord.bidType === "rightDigit") {
        updatePayload.rightdigit = values.bidNumber;
      }
      // console.log("Update payload:", updatePayload);
      const response = await axiosInstance.put(
        `/api/GaliDisawarWinners/updatewinner/${editingRecord._id}`,
        updatePayload
      );
      // console.log("Update response:", response.data);
      setIsEditModalVisible(false);
      setEditingRecord(null);
      // Refresh winners data
      handleShowWinnersClick();
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };
  

  // Define table columns.
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

  // Updated columns for the Winners table:
  // - Removed the Profile column.
  // - Removed separate columns for Pana, Left Digit, and Right Digit.
  // - The Bid Number column now shows a value from Pana, Left Digit, or Right Digit (in that order)
  //   if the value is truthy (and not "false").
  // - Added an Action column with Edit and Delete buttons.
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
        // Priority: pana, then leftDigit, then rightDigit, if truthy and not "false".
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
        Galidisawer Declare Results
      </h1>

      {/* Filter Section */}
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
                    // Format open_time to show only hh:mm AM/PM using moment
                    const formattedTime = moment(option.open_time, "hh:mm:ssA").format("hh:mm A");
                    return (
                      <Option
                        key={option._id}
                        value={`${option.game_name} ${formattedTime}`}
                      >
                        {`${option.game_name} ${formattedTime}`}
                      </Option>
                    );
                  })}
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

      {/* Buttons Section */}
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

      {/* Winners Table */}
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
  rowKey="_id" // changed from "bidNumber" to "_id"
  pagination={false}
  locale={{ emptyText: 'No winners available' }}
  scroll={{ x: '100%' }}
/>

      </Card>

      {/* Pagination and Search for Declare Results Table */}
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
                setPagination((prev) => ({ ...prev, pageSize: value }))
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
              setPagination((prev) => ({ ...prev, current: page }))
            }
          />
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Bid"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditFinish}
        >
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
  rules={[{ required: true, message: "Please enter bid number" }]}>
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
