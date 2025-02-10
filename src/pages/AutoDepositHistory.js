import React, { useState, useEffect } from "react";
import { Table, DatePicker, Spin, Alert, Input } from "antd";
import axios from "../utils/axiosInstance";
import moment from "moment";

const { Search } = Input;

const AutoDepositHistory = () => {
  const [data, setData] = useState([]); // Original Data
  const [filteredData, setFilteredData] = useState([]); // Filtered Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Selected Date
  const [searchText, setSearchText] = useState(""); // Search Input

  // ✅ Fetch Deposit History on Component Mount
  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/userPayment/getpaymentResponse`);
        setData(response.data.data || []);
        setFilteredData(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch deposit history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepositHistory();
  }, []);

  const handleDateChange = (date) => {
    if (!date) {
        setFilteredData(data);
        setSelectedDate(null);
        return;
    }

    // ✅ Convert selected date to "YYYY-MM-DD" without shifting timezones
    const selectedDateStr = moment(date).format("YYYY-MM-DD");
    setSelectedDate(selectedDateStr);

    // console.log("Selected Date (Final Fixed):", selectedDateStr); // Debugging

    // ✅ Convert `createdAt` timestamps to the same "YYYY-MM-DD" format
    const filtered = data.filter((item) => {
        const txnDateStr = moment(item.createdAt).format("YYYY-MM-DD"); // Convert to "Txn Date"
        // console.log(`Txn Date: ${txnDateStr} | Selected Date: ${selectedDateStr}`); // Debugging
        return txnDateStr === selectedDateStr;
    });

    // console.log("Final Filtered Data:", filtered); // Debugging

    setFilteredData(filtered);
};






  // ✅ Search Functionality (Filters by Username or Txn ID)
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();

    const filtered = data.filter((item) => {
      const matchesSearch =
        item.username.toLowerCase().includes(lowercasedValue) ||
        item.txnId.toLowerCase().includes(lowercasedValue);

      if (selectedDate) {
        const itemDateStr = moment(item.createdAt).format("YYYY-MM-DD");
        return matchesSearch && itemDateStr === selectedDate;
      }

      return matchesSearch;
    });

    setFilteredData(filtered);
  };

  // ✅ Table Columns
  const columns = [
    { title: "#", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
    { title: "User Name", dataIndex: "username", key: "username" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount) => `₹ ${amount}` },
    { title: "Txn ID", dataIndex: "txnId", key: "txnId", render: (txnId) => txnId || "N/A" },
    {
      title: "Txn Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Auto Deposit History</h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* ✅ Date Picker for Filtering */}
          <DatePicker
            onChange={handleDateChange}
            className="mb-2 md:mb-0"
            format="DD-MM-YYYY"
          />

          {/* ✅ Search Bar for Filtering */}
          <Search
            placeholder="Search by Username or Txn ID"
            onSearch={handleSearch}
            enterButton
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        {/* ✅ Display Loading, Error, or Table */}
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
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 700 }} // ✅ Enables horizontal scrolling
          />
        )}
      </div>
    </div>
  );
};

export default AutoDepositHistory;
