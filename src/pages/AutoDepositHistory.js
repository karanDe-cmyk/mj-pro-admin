import React, { useState, useEffect } from "react";
import { Table, DatePicker, Spin, Alert, Input, Tag, Statistic, Card, Row, Col } from "antd";
import axios from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const AutoDepositHistory = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [searchText, setSearchText] = useState("");
  const [successTotal, setSuccessTotal] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [failedTotal, setFailedTotal] = useState(0);

  // Calculate totals whenever filteredData changes
  useEffect(() => {
    let successSum = 0;
    let pendingSum = 0;
    let failedSum = 0;

    filteredData.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      const status = item.status ? item.status.toLowerCase() : "";

      if (status.includes("success") || status.includes("completed")) {
        successSum += amount;
      } else if (status.includes("pending")) {
        pendingSum += amount;
      } else if (status.includes("fail") || status.includes("reject")) {
        failedSum += amount;
      }
    });

    setSuccessTotal(successSum);
    setPendingTotal(pendingSum);
    setFailedTotal(failedSum);
  }, [filteredData]);

  // Fetch Deposit History
  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/userPayment/getpaymentResponse`);
        const allTransactions = response.data.data || [];
        setData(allTransactions);

        // Filter transactions only for today on load
        const todayStr = moment().utc().format("YYYY-MM-DD");
        const todayData = allTransactions.filter((item) =>
          moment.utc(item.date).format("YYYY-MM-DD") === todayStr
        );
        setFilteredData(todayData);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to fetch deposit history.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepositHistory();
  }, []);

  // Handle Date Change
  const handleDateChange = (date) => {
    if (!date) {
      const todayStr = moment().utc().format("YYYY-MM-DD");
      setSelectedDate(todayStr);
      const todayData = data.filter(
        (item) => moment.utc(item.createdAt).format("YYYY-MM-DD") === todayStr
      );
      setFilteredData(todayData);
      return;
    }

    const selectedDateStr = moment(date).format("YYYY-MM-DD");
    setSelectedDate(selectedDateStr);

    const filtered = data.filter((item) => {
      const itemDateStr = moment.utc(item.createdAt).format("YYYY-MM-DD");
      return itemDateStr === selectedDateStr;
    });

    setFilteredData(filtered);
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();

    const baseData = data.filter(
      (item) => moment.utc(item.createdAt).format("YYYY-MM-DD") === selectedDate
    );

    const filtered = baseData.filter(
      (item) =>
        item.username?.toLowerCase().includes(lowercasedValue) ||
        item.txnId?.toLowerCase().includes(lowercasedValue) ||
        item.number?.toString().includes(value) ||
        item.status?.toLowerCase().includes(lowercasedValue)
    );

    setFilteredData(filtered);
  };

  // Status Tag Color Mapping
  const getStatusColor = (status) => {
    if (!status) return "default";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("success") || statusLower.includes("completed")) return "green";
    if (statusLower.includes("fail") || statusLower.includes("reject")) return "red";
    if (statusLower.includes("pending")) return "orange";
    return "blue";
  };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
    {
      title: "User Name", dataIndex: "username", key: "username", render: (text, record) => (
        <span
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
          onClick={() => navigate(`/admin/user-management/user-details/${record.userId}`)}
        >
          {record.username}
        </span>
      ),
    },
    { title: "Mobile Number", dataIndex: "number", key: "number", render: (number) => number || "N/A" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount) => `₹ ${amount}` },
    { title: "Txn ID", dataIndex: "txnId", key: "txnId", render: (txnId) => txnId || "N/A" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Txn Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment.utc(date).local().format("DD-MM-YYYY hh:mm A"),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Auto Deposit History</h2>

        {/* Summary Cards */}
        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Card>
              <Statistic
                title="Successful Transactions"
                value={successTotal}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#52c41a' }}
                suffix={
                  <div className="text-xs text-gray-500 mt-1">
                    {filteredData.filter(item =>
                      item.status && item.status.toLowerCase().includes("success") ||
                      item.status && item.status.toLowerCase().includes("completed")
                    ).length} transactions
                  </div>
                }
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pending Transactions"
                value={pendingTotal}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#fa8c16' }}
                suffix={
                  <div className="text-xs text-gray-500 mt-1">
                    {filteredData.filter(item =>
                      item.status && item.status.toLowerCase().includes("pending")
                    ).length} transactions
                  </div>
                }
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Failed Transactions"
                value={failedTotal}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#f5222d' }}
                suffix={
                  <div className="text-xs text-gray-500 mt-1">
                    {filteredData.filter(item =>
                      item.status && (
                        item.status.toLowerCase().includes("fail") ||
                        item.status.toLowerCase().includes("reject")
                      )
                    ).length} transactions
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* Date Picker */}
          <DatePicker
            value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null}
            onChange={(date) => {
              handleDateChange(date ? date.format("YYYY-MM-DD") : null);
            }}
            format="DD-MM-YYYY"
            style={{ width: 180, padding: "10px" }}
            allowClear={false}
            defaultPickerValue={dayjs()}
            placeholder="Select Date"
          />

          {/* Search Bar */}
          <Search
            placeholder="Search by Mobile, Txn ID, Username or Status"
            onSearch={handleSearch}
            enterButton
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        {/* Display Loading, Error, or Table */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon className="mb-4" />
        ) : (
          <Table
            dataSource={filteredData.map((item, index) => ({ ...item, key: index }))}
            columns={columns}
            pagination={false}
            bordered
            scroll={{ x: 800 }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <strong>Grand Total (All Status):</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>₹ {(successTotal + pendingTotal + failedTotal).toFixed(2)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default AutoDepositHistory;