import React, { useState, useEffect } from "react";
import { Table, Button, Input, Card, Space, Select, Modal, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axiosInstance";

const { Option } = Select;

const WalletAllDepositeHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState("");

  // Fetch all deposit transactions on component mount
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/manualDeposit");
      // Assuming API response is an array of deposit transactions
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch deposit transactions");
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Update deposit status via API
  const updateDepositStatus = async (id, newStatus) => {
    try {
      // Only call update API if the deposit is currently pending
      const deposit = data.find((item) => item._id === id);
      if (deposit && deposit.status !== "Pending") return;
      await axiosInstance.put(`/api/manualDeposit/${id}`, { status: newStatus });
      message.success(`Deposit status updated to ${newStatus}`);
      // Update the state locally (or refetch deposits)
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      message.error("Failed to update deposit status");
    }
  };

  // Handle modal open for image view
  const handleViewImage = (image) => {
    setModalImage(image);
    setModalVisible(true);
  };

  // Define table columns
  const columns = [
    {
      title: "#",
      key: "serial",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Member Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Member Mobile",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Screenshot",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewImage(image)}
        >
          View
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
        title: "Action",
        key: "action",
        render: (text, record) => {
          if (record.status === "Pending") {
            return (
              <div style={{ marginLeft: "20px" }}>
                <Space direction="vertical">
                  <Button
                    style={{
                      width: "250px",
                      backgroundColor: "#556ee6",
                      color: "white",
                      fontWeight: "500",
                    }}
                    onClick={() => updateDepositStatus(record._id, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    style={{
                      width: "250px",
                      backgroundColor: "#f46a6a",
                      color: "white",
                      fontWeight: "500",
                    }}
                    onClick={() => updateDepositStatus(record._id, "Canceled")}
                  >
                    Cancel
                  </Button>
                </Space>
              </div>
            );
          } else if (record.status === "Accepted") {
            return (
              <div style={{ marginLeft: "20px" }}>
                <Button
                  style={{
                    width: "250px",
                    backgroundColor: "#34c38f",
                    color: "white",
                    cursor: "not-allowed",
                    fontWeight: "500",
                  }}
                  disabled
                >
                  Accepted
                </Button>
              </div>
            );
          } else if (record.status === "Canceled") {
            return (
              <div style={{ marginLeft: "20px" }}>
                <Button
                  style={{
                    width: "250px",
                    backgroundColor: "#f1b44c",
                    color: "white",
                    cursor: "not-allowed",
                    fontWeight: "500",
                  }}
                  disabled
                >
                  Canceled
                </Button>
              </div>
            );
          }
          return null;
        },
      }
      
      
  ];

  // Filter and search
  const filteredData = data.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchText.toLowerCase()) &&
      (!statusFilter || item.status === statusFilter)
  );

  return (
    <Card title="All Fund Request List">
      {/* Search and Filters */}
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search Member Name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter Status"
          allowClear
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 150 }}
        >
          <Option value="">All</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Accepted">Accepted</Option>
          <Option value="Canceled">Canceled</Option>
        </Select>
        <Select
          defaultValue={10}
          onChange={(value) => setPageSize(value)}
          style={{ width: 100 }}
        >
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={30}>30</Option>
          <Option value={40}>40</Option>
          <Option value={50}>50</Option>
        </Select>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize }}
        rowKey="_id"
        scroll={{ x: 800 }} // Enables horizontal scroll on mobile
      />

      {/* Modal for image view */}
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {modalImage ? (
          <img
            src={modalImage}
            alt="Deposit Screenshot"
            style={{ width: "100%" }}
          />
        ) : (
          <p>No image found</p>
        )}
      </Modal>
    </Card>
  );
};

export default WalletAllDepositeHistory;
