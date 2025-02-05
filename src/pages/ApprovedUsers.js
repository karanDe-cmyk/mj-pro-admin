import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";
import { appiD } from "../utils/config";
import { Table, Input, Button, Switch, Pagination, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const UnapprovedUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "9785575373 (King)",
      mobile: "9785575373",
      walletBalance: 91,
      betting: false,
      transfer: false,
      active: false,
    },
    {
      id: 2,
      name: "9878789878 (Demo)",
      mobile: "9878789878",
      walletBalance: 1,
      betting: false,
      transfer: false,
      active: false,
    },
  ]);
  const [user, setUser] = useState(null);
  console.log("user", user);
  const fetchUser   = async () => {
    try {
      const response = await instance.get(
        `https://matka-admin-backend.onrender.com/api/auth/userStatus/${appiD}?status=true`
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
    fetchUser  ();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");


  const toggleSwitch = async (record) => {
    try {
      const response = await instance.post(
        `https://matka-admin-backend.onrender.com/api/auth/userStatusUpdate/${appiD}/${record?._id}`,
        {
          type: "status",
          value:false,
          // status: !user.find((item) => item.id === record?._id).betting,
        }
      );
      if (response) {
        console.log("User   status updated successfully");
        // Update the local state
        // setUser((prevUsers) =>
        //   prevUsers.map((user) =>
        //     user.id === record?._id ? { ...user, betting: !user.betting } : user
        //   )
        // );
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
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
      render: (text, record) => (
        <div>
          <p>{record?.userName}</p>
        </div>
      ),
    },
    {
      title: "Member Mobile No",
      dataIndex: "userNumber",
      key: "userNumber",
      render: (text, record) => (
        <div>
          <p>{record?.userNumber}</p>
        </div>
      ),
    },
    {
      title: "Member Whatsapp No",
      dataIndex: "userWhatsappNumber",
      key: "userWhatsappNumber",
      render: (text, record) => (
        <div>
          <p>{record?.userWhatsappNumber}</p>
        </div>
      ),
    },
    {
      title: "Wallet Balance",
      dataIndex: "walletBalance",
      key: "walletBalance",
      render: (text, record) => (
        <div>
          <p>{record?.walletBalance}</p>
        </div>
      ),
    },
    {
      title: "Betting",
      dataIndex: "betting",
      key: "betting",
      render: (text, record) => (
        <Switch
          checked={record?.betting ? true : false} 
          onChange={() => {
            toggleSwitch(record);
          }}
        />
      ),
    },
    {
      title: "Transfer",
      dataIndex: "transfer",
      key: "transfer",
      render: (text, record) => (
        <Switch
          checked={record?.transfer ? true : false} 
          onChange={() => {
            toggleSwitch(record);
          }}
        />
      ),
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          checked={record?.status ? true : false}
          onChange={() => {
            toggleSwitch(record);
          }}
        />
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
      <h2 className="text-xl font-bold mb-4">User   List</h2>

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
          Showing 1 to {users.length} of {users.length} entries
        </span>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  );
};

export default UnapprovedUsers;