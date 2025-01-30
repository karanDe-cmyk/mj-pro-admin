import React, { useState, useEffect } from "react";

const WinningPrediction = () => {
  const [formData, setFormData] = useState({
    resultDate: "",
    gameName: "",
    session: "",
    number: "",
  });

  const [winningList, setWinningList] = useState([]);
  const [gameNames, setGameNames] = useState(["Game 1", "Game 2", "Game 3"]); // Mock data
  const [sessions, setSessions] = useState(["Morning", "Evening"]); // Mock data

  useEffect(() => {
    // Simulate API call to fetch winning list when form data changes
    if (formData.resultDate && formData.gameName && formData.session) {
      const mockWinningList = [
        { id: 1, username: "John", betDigit: 5, betAmount: 100, winningAmount: 500 },
        { id: 2, username: "Alice", betDigit: 3, betAmount: 200, winningAmount: 800 },
      ];
      setWinningList(mockWinningList);
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (id) => {
    alert(`Edit Bet ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    alert(`Delete Bet ID: ${id}`);
    setWinningList(winningList.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Select Game</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Result Date */}
          <div>
            <label className="block text-gray-700 mb-2">Result Date</label>
            <input
              type="date"
              name="resultDate"
              value={formData.resultDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Game Name */}
          <div>
            <label className="block text-gray-700 mb-2">Game Name</label>
            <select
              name="gameName"
              value={formData.gameName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Name</option>
              {gameNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Session */}
          <div>
            <label className="block text-gray-700 mb-2">Session</label>
            <select
              name="session"
              value={formData.session}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-Select Session-</option>
              {sessions.map((session, index) => (
                <option key={index} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>

          {/* Number */}
          <div>
            <label className="block text-gray-700 mb-2">Number</label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Select Number"
            />
          </div>
        </div>
        <button className="bg-blue-500 text-white mt-4 px-4 py-2 rounded shadow hover:bg-blue-600">
          Submit
        </button>
      </div>

      {/* Winning Member List */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Winning Member List</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">User Name</th>
              <th className="border border-gray-300 px-4 py-2">Bet Digit</th>
              <th className="border border-gray-300 px-4 py-2">Bet Amount</th>
              <th className="border border-gray-300 px-4 py-2">Winning Amount</th>
              <th className="border border-gray-300 px-4 py-2">Edit Bet</th>
              <th className="border border-gray-300 px-4 py-2">Delete Bet</th>
            </tr>
          </thead>
          <tbody>
            {winningList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No Records Found
                </td>
              </tr>
            ) : (
              winningList.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.betDigit}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.betAmount}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.winningAmount}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WinningPrediction;
