import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";
import { appiD } from "../utils/config";
import { Table, Input, Button, Switch, Pagination, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const UnapprovedUsers = () => {
  const [user, setUser] = useState(null);
  console.log("user", user);
  const fetchUser  = async () => {
    try {
      const response = await instance.get(
        `http://localhost:5001/api/auth/userStatus/3d88dae8-5904-40e9-b314-4906bc064bed?status=false`
      );
      if (response) {
        console.log("goodVibees", response.data);
        setUser(response.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUser ();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedId, setSelectedId] = useState({});
  console.log("setSelectedId", selectedId);

  const [loading, setLoading] = useState(false);

  const toggleSwitch =  (record) => {
    setLoading(true);
    setSelectedId(record._id);
    try {
      const response =  instance.post(
        `http://localhost:5001/api/auth/userStatusUpdate/${appiD}/${record._id}`,
        {
          type: "status",
          value: !record.status, // toggle the status
        }
      );
      if (response) {
        console.log("User   status updated successfully", response);
        // Refresh the table
        fetchUser ();
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Member Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Member Mobile No",
      dataIndex: "userNumber",
      key: "userNumber",
    },
    {
      title: "Member Whatsapp No",
      dataIndex: "userWhatsappNumber",
      key: "userWhatsappNumber",
    },
    {
      title: "Wallet Balance",
      dataIndex: "walletBalance",
      key: "walletBalance",
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Spin spinning={loading && selectedId === record._id}>
          <Switch
            checked={text}
            onChange={() => toggleSwitch(record)}
          />
        </Spin>
      ),
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      render: () => (
        <Button type="link" onClick={() => console.log("View button clicked")}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">User  List</h2>

      {/* Top Actions */}
      <div className="flex justify-end mb-4">
        <div className="text-right">
          <Button type="primary" onClick={() => console.log("Approved Users List button clicked")}>
            Approved Users List
          </Button>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} dataSource={user} pagination={false} />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing 1 to 10 of 50 entries
        </span>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  );
};

export default UnapprovedUsers;