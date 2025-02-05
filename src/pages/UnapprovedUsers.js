import React, { useState, useEffect } from "react";
import instance from "../utils/axiosInstance";
import { apiUrl } from "../utils/config";
import { appiD } from "../utils/config";
import { Table, Input, Button, Switch, Pagination, Spin } from "antd";
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

  const [searchTerm, setSearchTerm] = useState("");

  const toggleSwitch = (id, field) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: !user[field] } : user
      )
    );
  };

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
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Member Name</th>
            <th className="border border-gray-300 px-4 py-2">Member Mobile No</th>
            <th className="border border-gray-300 px-4 py-2">Wallet Balance</th>
            <th className="border border-gray-300 px-4 py-2">Betting</th>
            <th className="border border-gray-300 px-4 py-2">Transfer</th>
            <th className="border border-gray-300 px-4 py-2">Active</th>
            <th className="border border-gray-300 px-4 py-2">Option</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user, index) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.mobile}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.walletBalance}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.betting}
                      onChange={() => toggleSwitch(user.id, "betting")}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full ${
                        user.betting ? "bg-green-400" : "bg-yellow-500"
                      }`}
                    ></div>
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        user.betting ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </label>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.transfer}
                      onChange={() => toggleSwitch(user.id, "transfer")}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full ${
                        user.transfer ? "bg-green-400" : "bg-yellow-500"
                      }`}
                    ></div>
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        user.transfer ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </label>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.active}
                      onChange={() => toggleSwitch(user.id, "active")}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full ${
                        user.active ? "bg-green-400" : "bg-yellow-500"
                      }`}
                    ></div>
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        user.active ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </label>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

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