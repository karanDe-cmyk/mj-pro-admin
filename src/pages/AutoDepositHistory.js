import React, { useState, useEffect } from "react";
import { Table, DatePicker, Spin, Alert, Input, Tag } from "antd";
import axios from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";

const { Search } = Input;

const AutoDepositHistory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [searchText, setSearchText] = useState("");

  const fetchTransactions = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `/api/userPayment/allTransaction?date=${date}`
      );

      const transactions = response.data.transactions || [];

      setData(transactions);
      setFilteredData(transactions);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch transaction history.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load (Today)
  useEffect(() => {
    fetchTransactions(selectedDate);
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date
      ? dayjs(date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");

    setSelectedDate(formattedDate);
    setSearchText("");
    fetchTransactions(formattedDate);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const keyword = value.toLowerCase();

    const filtered = data.filter(
      (item) =>
        item.username?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.txnId?.toLowerCase().includes(keyword) ||
        item.requestNumber?.toLowerCase().includes(keyword)
    );

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "User",
      key: "user",
      render: (_, record) =>
        record.username || record.email || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹ ${amount}`,
    },
    {
      title: "Mode",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === "payment" ? (
          <Tag color="green">AUTO</Tag>
        ) : (
          <Tag color="orange">MANUAL</Tag>
        ),
    },
    {
      title: "Txn / Request ID",
      key: "txn",
      render: (_, record) =>
        record.txnId || record.requestNumber || "N/A",
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        moment.utc(date).local().format("DD-MM-YYYY hh:mm A"),
    },
  ];
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">
          All Deposit History
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          {/* DATE PICKER */}
          <DatePicker
            value={dayjs(selectedDate, "YYYY-MM-DD")}
            onChange={handleDateChange}
            format="DD-MM-YYYY"
            allowClear={false}
            style={{ width: 180 }}
          />

          {/* SEARCH */}
          <Search
            placeholder="Search by user / email / txn id"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            className="w-full md:w-72"
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Table
            dataSource={filteredData.map((item, index) => ({
              ...item,
              key: index,
            }))}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 800 }}
          />
        )}
      </div>
    </div>
  );
};

export default AutoDepositHistory;
