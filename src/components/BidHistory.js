import React, { useState, useEffect } from "react";
import { Table } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";

const BidHistory = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/bid/bids/${userId}`);
      if (response.data.status) {
        formatData(response.data);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (responseData) => {
    const allBids = [
      ...responseData.mainMarketBids,
      ...responseData.starLineBids,
    ];

    const formattedData = allBids.map((bid, index) => {
      const isStarline = bid.market === "Starline";
      let digitValue = "";
      let closeDigitValue = "";
      let sessionValue = "";

      if (isStarline) {
        digitValue = bid.digit;
      } else {
        if (bid.open) {
          digitValue = bid.digit;
          sessionValue = "Open";
        }
        if (bid.close) {
          closeDigitValue = bid.digit;
          sessionValue = "Close";
        }
        if (!bid.open && !bid.close) {
          digitValue = bid.digit;
        }
      }

      return {
        key: index + 1,
        sNo: index + 1,
        gameName: bid.gameName || bid.gamename,
        market: bid.market,
        gameType: bid.gameType || bid.gametype,
        session: sessionValue || "━━━━",
        digit: digitValue || closeDigitValue,
        points: bid.points,
        date: moment(bid.createdAt).format("YYYY-MM-DD hh:mm:ss A"),
        createdAt: moment(bid.createdAt),
      };
    });

    // Sort by date descending
    const sortedData = formattedData.sort((a, b) => b.createdAt - a.createdAt);
    setData(sortedData);
    setPagination(prev => ({ ...prev, total: sortedData.length }));
  };

  useEffect(() => {
    if (userId) {
      fetchBids();
    }
  }, [userId]);

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
      width: 120,
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      width: 100,
      render: (session) => (
        <span className="text-center block">{session}</span>
      ),
    },
    {
      title: "Digit/Pana",
      dataIndex: "digit",
      key: "digit",
      width: 120,
    },
    {
      title: "Points ₹",
      dataIndex: "points",
      key: "points",
      width: 100,
      render: (points) => (
        <span className="font-bold text-blue-600">{points}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 180,
    },
  ];

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Bid History</h3>
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <select
            className="border border-gray-300 px-3 py-1 rounded"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination(prev => ({ 
                ...prev, 
                pageSize: Number(e.target.value),
                current: 1
              }))
            }
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded w-64"
          placeholder="Search bid history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} entries`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
        rowKey="key"
      />
    </div>
  );
};

export default BidHistory;