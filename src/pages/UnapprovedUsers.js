import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { Table, Input, Button, Switch, Pagination, Spin } from "antd";
import { SearchOutlined,WhatsAppOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UnapprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Spinner for initial data loading
  const [selectedId, setSelectedId] = useState(null); // Store selected user ID for switch spinner
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // React Router navigation

  // ✅ Fetch Users with Spinner
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/api/auth/userStatus?status=false`
      );
      if (response?.data) {
        // console.log("Fetched Users:", response.data);
        setUsers(response.data);
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

  // ✅ Toggle Switch Function for Active Status
  const toggleSwitch = async (record) => {
    // Optimistic UI Update: Immediately toggle the status
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === record._id ? { ...user, status: !record.status } : user
      )
    );

    setSelectedId(record._id); // Show spinner on switch

    try {
      const response = await instance.post(
        `/api/auth/userStatusUpdate/${record._id}`,
        {
          type: "status",
          value: !record.status, // Toggle the status
        }
      );

      if (response) {
        // console.log("User status updated successfully", response);
        fetchUsers(); // ✅ Refresh table after toggle
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setSelectedId(null); // Hide spinner on switch after completion
    }
  };

  // Table Columns
  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", render: (_, __, index) => index + 1 },
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Member Mobile No", dataIndex: "phone", key: "phone" },
    { title: "Member Whatsapp No", dataIndex: "userWhatsappNumber", key: "userWhatsappNumber" },
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
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Spin spinning={selectedId === record._id}>
          <Switch
            checked={record.status}
            onChange={() => toggleSwitch(record)} // Call toggle on switch change
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
      <h2 className="text-xl font-bold mb-4">Unapproved Users</h2>

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

      {/* Table with Spinner */}
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
