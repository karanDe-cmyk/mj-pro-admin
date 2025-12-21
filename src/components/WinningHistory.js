import React, { useState, useEffect } from "react";
import { Table } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";

const WinningHistory = ({ userId }) => {
  const [winningData, setWinningData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (userId) {
      fetchWinningData();
    }
  }, [userId]);

  const fetchWinningData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/api/winning/getTotalWinningamount/${userId}`
      );

      if (response.data.status) {
        formatWinningData(response.data.winningRecords);
      }
    } catch (error) {
      console.error("Error fetching winning history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatWinningData = (records) => {
    const formattedData = records.flatMap((record) =>
      record.winners.map((winner) => ({
        key: `${record._id}-${winner._id}`,
        market: record.marketName || "Starline",
        gameName: record.gameName || record.market,
        bidAmount: winner.points,
        gameType: winner.gameType,
        winningAmount: winner.winningAmount || winner.winningPoints,
        status: "Win",
        date: moment(record.createdAt).format("YYYY-MM-DD hh:mm:ss A"),
      }))
    );

    const sortedData = formattedData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const finalData = sortedData.map((item, index) => ({
      ...item,
      sNo: index + 1,
    }));

    setWinningData(finalData);
    setFilteredData(finalData);
  };

  const getTodaysWinningData = () => {
    const today = moment().format("YYYY-MM-DD");
    return winningData.filter(
      (record) => moment(record.date).format("YYYY-MM-DD") === today
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const dataToFilter = activeTab === "today" ? getTodaysWinningData() : winningData;

    const filtered = dataToFilter.filter((record) =>
      Object.values(record).some(
        (fieldValue) =>
          fieldValue &&
          fieldValue.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    if (tab === "today") {
      const todayData = getTodaysWinningData();
      const filtered = todayData.filter((record) =>
        Object.values(record).some(
          (fieldValue) =>
            fieldValue &&
            fieldValue.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      const filtered = winningData.filter((record) =>
        Object.values(record).some(
          (fieldValue) =>
            fieldValue &&
            fieldValue.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
      width: 60,
    },
    {
      title: "Market",
      dataIndex: "market",
      key: "market",
      width: 100,
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      width: 120,
    },
    {
      title: "Game Type",
      dataIndex: "gameType",
      key: "gameType",
      width: 100,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      key: "bidAmount",
      width: 100,
      render: (amount) => (
        <span className="font-bold text-blue-500">{amount}</span>
      ),
    },
    {
      title: "Winning Amount",
      dataIndex: "winningAmount",
      key: "winningAmount",
      width: 120,
      render: (amount) => (
        <span className="font-bold text-green-600">{amount}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: () => (
        <span className="px-2 py-1 rounded font-bold text-white bg-green-500 inline-block text-center min-w-20">
          Win
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
  ];

  const dataSource = filteredData.map((item) => ({
    ...item,
    key: item.key,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-5">
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange("all")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Winning History
          </button>
          <button
            onClick={() => handleTabChange("today")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "today"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Today's Winning History
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {activeTab === "all" ? "All Winning History" : "Today's Winning History"}
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2 text-sm text-gray-600">entries</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search winning history..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showSizeChanger: false,
          onChange: handlePageChange,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} entries`,
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default WinningHistory;