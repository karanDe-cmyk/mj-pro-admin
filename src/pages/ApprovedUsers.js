import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { Table, Input, Button, Switch, Pagination, Spin, Select } from "antd";
import { PhoneOutlined, SearchOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const UnapprovedUsers = () => {
  const [users, setUsers] = useState([]); // Original users data
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users data
  const [loading, setLoading] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default 10 entries per page
  const navigate = useNavigate();

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/api/auth/userStatus?status=true`);
      if (response?.data) {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search Filter (Live Search)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users); // If empty, show all users
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.userName?.toLowerCase().includes(lowercasedSearch) ||
            user.phone?.toLowerCase().includes(lowercasedSearch) ||
            user.userWhatsappNumber?.toLowerCase().includes(lowercasedSearch) ||
            user.walletBalance?.toString().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, users]);

  // ✅ Navigate to User Details
  const handleViewClick = (userId) => {
    navigate(`/admin/user-management/user-details/${userId}`);
  };

  const handleUserNumber = (userMobileNumber) => {
    if (userMobileNumber) {
      // Use window.location.href to trigger a phone call
      window.location.href = `tel:+91${userMobileNumber}`;
    }
  };
  // ✅ WhatsApp Click
  const handleWhatsAppClick = (userWhatsappNumber) => {
    if (userWhatsappNumber) {
      window.open(`https://wa.me/+91${userWhatsappNumber}`, "_blank");
    }
  };

  // ✅ Toggle Switch
  const toggleSwitch = async (record, type) => {
    setLoadingSwitch(record._id);
    const newValue = !record[type];
    try {
      const response = await instance.post(
        `/api/auth/userStatusUpdate/${record._id}`,
        { type, value: newValue }
      );
      if (response) {
        if (type === "status" && newValue === false) {
          setUsers((prev) => prev.filter((user) => user._id !== record._id));
        } else {
          setUsers((prev) =>
            prev.map((user) =>
              user._id === record._id ? { ...user, [type]: newValue } : user
            )
          );
        }
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setLoadingSwitch(null);
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    {
      title: "Member Mobile No",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <span>
          {text}
          {text && (
            <>
              &nbsp;
              <PhoneOutlined
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => handleUserNumber(text)}
              />
            </>
          )}
        </span>
      ),
    },
    {
      title: "Member Whatsapp No",
      dataIndex: "userWhatsappNumber",
      key: "userWhatsappNumber",
      render: (text) => (
        <span>
          {text}
          {text && (
            <>
              &nbsp;
              <WhatsAppOutlined
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => handleWhatsAppClick(text)}
              />
            </>
          )}
        </span>
      ),
    },
    { title: "Wallet Balance", dataIndex: "walletBalance", key: "walletBalance" },
    {
      title: "Betting",
      dataIndex: "betting",
      key: "betting",
      render: (_, record) => (
        <Spin spinning={loadingSwitch === record._id}>
          <Switch
            checked={record.betting}
            onChange={() => toggleSwitch(record, "betting")}
          />
        </Spin>
      ),
    },
    {
      title: "Transfer",
      dataIndex: "transfer",
      key: "transfer",
      render: (_, record) => (
        <Spin spinning={loadingSwitch === record._id}>
          <Switch
            checked={record.transfer}
            onChange={() => toggleSwitch(record, "transfer")}
          />
        </Spin>
      ),
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Spin spinning={loadingSwitch === record._id}>
          <Switch
            checked={record.status}
            onChange={() => toggleSwitch(record, "status")}
          />
        </Spin>
      ),
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      render: (_, record) => <Button type="link" onClick={() => handleViewClick(record._id)}>View</Button>,
    },
  ];

  // ✅ Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      {/* 🔎 Search Bar */}
      <div className="flex justify-between mb-4">
        {/* 🔽 Entries Per Page Selector */}
        <Select
          defaultValue={entriesPerPage}
          onChange={(value) => {
            setEntriesPerPage(value);
            setCurrentPage(1); // Reset to first page on change
          }}
          style={{ width: 100 }}
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
        </Select>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />


      </div>

      {/* 🔄 Global Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={currentUsers}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1000 }}
        />
      )}

      {/* 📜 Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>Showing {currentUsers.length} of {filteredUsers.length} entries</span>
        <Pagination
          current={currentPage}
          total={filteredUsers.length}
          pageSize={entriesPerPage}
          showSizeChanger={false}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default UnapprovedUsers;