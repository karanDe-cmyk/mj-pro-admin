import React, { useState, useEffect } from "react";

const ApprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Mock fetching user data dynamically
  useEffect(() => {
    const fetchUsers = async () => {
      const response = [
        {
          id: 1,
          name: "9785575353 (King)",
          whatsapp: true,
          mobile: "9785575353",
          walletBalance: 1,
          betting: true,
          transfer: true,
          active: true,
        },
        {
          id: 2,
          name: "9951489926 (Test)",
          whatsapp: true,
          mobile: "9951489926",
          walletBalance: 1,
          betting: true,
          transfer: true,
          active: true,
        },
        {
          id: 3,
          name: "7023600277 (Ram)",
          whatsapp: true,
          mobile: "7023600277",
          walletBalance: 1,
          betting: true,
          transfer: true,
          active: true,
        },
        {
          id: 4,
          name: "9785575373 (King)",
          whatsapp: false,
          mobile: "9785575373",
          walletBalance: 91,
          betting: false,
          transfer: false,
          active: false,
        },
        {
          id: 5,
          name: "9878789878 (Demo)",
          whatsapp: false,
          mobile: "9878789878",
          walletBalance: 1,
          betting: false,
          transfer: false,
          active: false,
        },
        {
          id: 6,
          name: "1234567890 (User)",
          whatsapp: true,
          mobile: "1234567890",
          walletBalance: 50,
          betting: false,
          transfer: true,
          active: false,
        },
      ];
      setUsers(response);
    };
    fetchUsers();
  }, []);

  // Toggle the switch for a specific field
  const toggleSwitch = (id, field) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: !user[field] } : user
      )
    );
  };

  // Filter and Paginate users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      {/* Top Actions */}
      <div className="flex flex-col items-end gap-2 mb-4">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Un-approved Users List
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded focus:outline-blue-400"
        />
      </div>


      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Member Name</th>
            <th className="border border-gray-300 px-4 py-2">WhatsApp</th>
            <th className="border border-gray-300 px-4 py-2">Member Mobile No</th>
            <th className="border border-gray-300 px-4 py-2">Wallet Balance</th>
            <th className="border border-gray-300 px-4 py-2">Betting</th>
            <th className="border border-gray-300 px-4 py-2">Transfer</th>
            <th className="border border-gray-300 px-4 py-2">Active</th>
            <th className="border border-gray-300 px-4 py-2">Option</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {indexOfFirstItem + index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.whatsapp ? "Yes" : "No"}
              </td>
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
                    className={`w-10 h-5 rounded-full transition-colors duration-300 ${user.betting ? "bg-green-400" : "bg-yellow-500"
                      }`}
                  ></div>
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${user.betting ? "translate-x-5" : "translate-x-0"
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
                  {/* Toggle Track */}
                  <div
                    className={`w-10 h-5 rounded-full transition-colors duration-300 ${user.transfer ? "bg-green-400" : "bg-yellow-500"
                      }`}
                  ></div>
                  {/* Toggle Knob */}
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${user.transfer ? "translate-x-5" : "translate-x-0"
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
                  {/* Toggle Track */}
                  <div
                    className={`w-10 h-5 rounded-full transition-colors duration-300 ${user.active ? "bg-green-400" : "bg-yellow-500"
                      }`}
                  ></div>
                  {/* Toggle Knob */}
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${user.active ? "translate-x-5" : "translate-x-0"
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
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovedUsers;
