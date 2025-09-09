import React, { useState, useEffect } from "react";
import { Table, DatePicker, Spin, Alert, Input } from "antd";
import axios from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";

const { Search } = Input;

const AutoDepositHistory = () => {
  const [data, setData] = useState([]); // Full Data from API
  const [filteredData, setFilteredData] = useState([]); // Filtered Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD")); // Default: Today
  const [searchText, setSearchText] = useState(""); // Search Input

  // ✅ Fetch Deposit History on Component Mount
  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/userPayment/getpaymentResponse`);
        // console.log("API Response:", response.data); // ✅ Debug: Check API data

        const allTransactions = response.data.data || [];
        setData(allTransactions);

        // ✅ Filter transactions only for today on load
        const todayStr = moment().utc().format("YYYY-MM-DD");
        const todayData = allTransactions.filter((item) =>
          moment.utc(item.createdAt).format("YYYY-MM-DD") === todayStr
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

  // ✅ Handle Date Change (Fix Timezone Issue)
  const handleDateChange = (date) => {
    if (!date) {
      console.warn("🚨 No date selected! Defaulting to today.");
      const todayStr = moment().utc().format("YYYY-MM-DD");
      setSelectedDate(todayStr);
      const todayData = data.filter(
        (item) => moment.utc(item.createdAt).format("YYYY-MM-DD") === todayStr
      );
      setFilteredData(todayData);
      return;
    }

    // ✅ Convert selected date properly
    const selectedDateStr = moment(date).format("YYYY-MM-DD");
    // console.log("📅 Selected Date:", selectedDateStr);

    setSelectedDate(selectedDateStr);

    // ✅ Convert and filter transactions
    const filtered = data.filter((item) => {
      const itemDateStr = moment.utc(item.createdAt).format("YYYY-MM-DD");
      // console.log(`📝 Checking ${itemDateStr} vs ${selectedDateStr}`);
      return itemDateStr === selectedDateStr;
    });

    // console.log("✅ Filtered Data:", filtered);
    setFilteredData(filtered);
  };

  // ✅ Search Functionality (Now includes Mobile Number)
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
        item.number?.toString().includes(value) // ✅ Added mobile number filtering
    );

    setFilteredData(filtered);
  };

  // ✅ Table Columns
  const columns = [
    { title: "#", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
    { title: "User Name", dataIndex: "username", key: "username", render: (username) => username || "N/A" },
    { title: "Mobile Number", dataIndex: "number", key: "number", render: (number) => number || "N/A" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (amount) => `₹ ${amount}` },
    { title: "Txn ID", dataIndex: "txnId", key: "txnId", render: (txnId) => txnId || "N/A" },
    {
      title: "Txn Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment.utc(date).local().format("DD-MM-YYYY hh:mm A"), // ✅ Convert UTC to Local Time
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Auto Deposit History</h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* ✅ Date Picker with Fix */}
          <DatePicker
            value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} // ✅ Ensure correct format
            onChange={(date) => {
              // console.log("🟢 DatePicker Selected:", date ? date.format("YYYY-MM-DD") : "None");
              handleDateChange(date ? date.format("YYYY-MM-DD") : null); // ✅ Pass only formatted date
            }}
            format="DD-MM-YYYY"
            style={{ width: 180, padding: "10px" }} // ✅ Improved UI
            allowClear={false} // ✅ Prevents clearing the default date
            defaultPickerValue={dayjs()} // ✅ Opens calendar in current month/year
            placeholder="Select Date"
          //suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />} // ✅ Adds a calendar icon
          />

          {/* ✅ Search Bar for Filtering - Updated placeholder */}
          
          <Search
            placeholder="Search by Mobile, Txn ID, or Username"
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
            pagination={false} // ✅ Removed pagination
            bordered
            scroll={{ x: 700 }} // ✅ Enables horizontal scrolling
          />
        )}
      </div>
    </div>
  );
};

export default AutoDepositHistory;