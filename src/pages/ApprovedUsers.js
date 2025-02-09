import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { apiUrl,  } from "../utils/config";
import { Table, Input, Button, Switch, Pagination, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const UnapprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // For global loading
  const [loadingSwitch, setLoadingSwitch] = useState(null); // For loading spinner on individual switch
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // React Router navigation

  // ✅ Fetch Users with Spinner
  const fetchUsers = async () => {
    setLoading(true); // Show global loading spinner while fetching users
    try {
      const response = await instance.get(
        `${apiUrl}/api/auth/userStatus?status=true`
      );
      if (response?.data) {
        setUsers(response.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Hide global loading spinner after fetching data
    }
  };

  

  useEffect(() => {
    fetchUsers();
  }, []);


   // Navigate to User Details Page
   const handleViewClick = (userId) => {
    navigate(`/user-details/${userId}`);
  };


  // ✅ Toggle Switch Function
  const toggleSwitch = async (record, type) => {
    setLoadingSwitch(record._id); // Show loading spinner for the switch being toggled

    try {
      const response = await instance.post(
        `${apiUrl}/api/auth/userStatusUpdate/${record._id}`,
        {
          type,
          value: !record[type], // Toggle the value of the status
        }
      );

      if (response) {
        console.log(`User ${type} updated successfully`);

        // ✅ Refresh table when "Active" (status) is toggled OFF
        if (type === "status" && !record.status) {
          console.log("Status OFF - Refreshing table");
          await fetchUsers(); // Re-fetch users when status is toggled off
        } else {
          // ✅ Update the local users state correctly for other switches (Betting, Transfer)
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === record._id ? { ...user, [type]: !user[type] } : user
            )
          );
        }
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setLoadingSwitch(null); // Hide loading spinner for the individual switch after the operation
    }
  };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Member Mobile No", dataIndex: "userNumber", key: "userNumber" },
    { title: "Member Whatsapp No", dataIndex: "userWhatsappNumber", key: "userWhatsappNumber" },
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
      render: (_, record) =>  <Button type="link" onClick={() => handleViewClick(record._id)}>View</Button>,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      {/* Top Actions */}
      <div className="flex justify-end mb-4">
        <Button type="primary">Approved Users List</Button>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200, marginLeft: 10 }}
        />
      </div>

      {/* Global Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={users} pagination={false} rowKey="_id" />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>Showing {users.length} entries</span>
        <Pagination defaultCurrent={1} total={users.length} />
      </div>
    </div>
  );
};

export default UnapprovedUsers;
