import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { Table, Input, Button, Switch, Pagination, Spin, Select } from "antd";
import { SearchOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const UnapprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search filtering
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5); // Default entries per page
  const [currentPage, setCurrentPage] = useState(1); // Default page number
  const navigate = useNavigate();

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/auth/userStatus?status=false`);
      if (response?.data) {
        setUsers(response.data);
        setFilteredUsers(response.data); // ✅ Initialize filtered users
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

  // ✅ Search Functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users); // Show all users when search is empty
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.userName.toLowerCase().includes(lowercasedSearch) ||
            user.phone.includes(lowercasedSearch) ||
            (user.userWhatsappNumber && user.userWhatsappNumber.includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, users]);

  // ✅ Toggle User Status
  const toggleSwitch = async (record) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === record._id ? { ...user, status: !record.status } : user
      )
    );

    setSelectedId(record._id);

    try {
      const response = await instance.post(`/api/auth/userStatusUpdate/${record._id}`, {
        type: "status",
        value: !record.status,
      });

      if (response) {
        fetchUsers(); // ✅ Refresh table after toggle
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setSelectedId(null);
    }
  };

  // ✅ Navigate to User Details
  const handleViewClick = (userId) => {
    navigate(`/admin/user-management/user-details/${userId}`);
  };

  // ✅ Open WhatsApp Chat
  const handleWhatsAppClick = (userWhatsappNumber) => {
    if (userWhatsappNumber) {
      window.open(`https://wa.me/+91${userWhatsappNumber}`, "_blank");
    }
  };

  // ✅ Handle Pagination Change
  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // ✅ Table Columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
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
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Spin spinning={selectedId === record._id}>
          <Switch checked={record.status} onChange={() => toggleSwitch(record)} />
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

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Unapproved Users</h2>

      {/* ✅ Top Actions (Show Entries & Search) */}
      <div className="flex justify-between mb-4">
        {/* Show Entries Dropdown */}
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <Select value={pageSize} onChange={(value) => handlePaginationChange(1, value)} style={{ width: 80 }}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
          <span className="ml-2">entries</span>
        </div>

        {/* Search Bar */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      {/* ✅ Table with Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1000 }}
        />
      )}

      {/* ✅ Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entries
        </span>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredUsers.length}
          showSizeChanger={false} // Size controlled by dropdown
          onChange={handlePaginationChange}
        />
      </div>
    </div>
  );
};

export default UnapprovedUsers;
