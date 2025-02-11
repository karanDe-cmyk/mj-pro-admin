import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { apiUrl,  } from "../utils/config";
import { Table, Input, Button, Switch, Pagination, Spin } from "antd";
import { SearchOutlined,WhatsAppOutlined } from "@ant-design/icons";
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
        `/api/auth/userStatus?status=true`
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

 // Handle WhatsApp icon click to open WhatsApp chat
 const handleWhatsAppClick = (userWhatsappNumber) => {
  if (userWhatsappNumber) {
    window.open(`https://wa.me/+91${userWhatsappNumber}`, "_blank");
  }
};
  // ✅ Toggle Switch Function
  const toggleSwitch = async (record, type) => {
    setLoadingSwitch(record._id); // Show loading spinner for the switch being toggled
  
    // Compute the new value for the given type (e.g., status, betting, etc.)
    const newValue = !record[type];
  
    try {
      const response = await instance.post(
        `/api/auth/userStatusUpdate/${record._id}`,
        {
          type,
          value: newValue, // Toggle the value of the status
        }
      );
  
      if (response) {
        // console.log(`User ${type} updated successfully`);
  
        // If the status is toggled off, remove the user from the table instantly
        if (type === "status" && newValue === false) {
          // console.log("Status OFF - Removing user from table");
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== record._id)
          );
        } else {
          // For other switches (or if status is toggled on), update the local users state accordingly
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
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
      setLoadingSwitch(null); // Hide loading spinner for the individual switch after the operation
    }
  };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Member Mobile No", dataIndex: "phone", key: "phone" },
    {
      title: "Member Whatsapp No",
      dataIndex: "userWhatsappNumber",
      key: "userWhatsappNumber",
      render: (text, record) => (
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
      render: (_, record) =>  <Button type="link" onClick={() => handleViewClick(record._id)}>View</Button>,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      {/* Top Actions */}
      <div className="flex justify-end mb-4">
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
