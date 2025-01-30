import React from "react";

const DeclareResult = () => {
  // Example dynamic data for tables
  const winMembers = [
    {
      id: 1,
      member: "John Doe",
      gameName: "Game A",
      betDigit: "123",
      betAmount: 500,
      winningAmount: 1000,
    },
    {
      id: 2,
      member: "Jane Smith",
      gameName: "Game B",
      betDigit: "456",
      betAmount: 300,
      winningAmount: 800,
    },
  ];

  const gameResults = [
    {
      id: 1,
      gameName: "Kalyan Morning",
      openPana: "-",
      closePana: "-",
    },
    {
      id: 2,
      gameName: "Sridevi",
      openPana: "-",
      closePana: "-",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
        {/* Select Game Section */}
        <div className="mb-8">
          <h1 className="text-lg font-bold mb-4">Select Game</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result Date</label>
              <input
                type="date"
                className="block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Game Name</label>
              <select className="block w-full border border-gray-300 rounded-md p-2">
                <option>Select Game</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select className="block w-full border border-gray-300 rounded-md p-2">
                <option>Select Session</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
              <select className="block w-full border border-gray-300 rounded-md p-2">
                <option>Select Number</option>
              </select>
            </div>
          </div>
          {/* Buttons in a Separate Row */}
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full">
              Declare Result
            </button>
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 w-full">
              Show Winner List
            </button>
          </div>
        </div>

        {/* Win Member Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Win Member</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Member</th>
                <th className="border border-gray-300 p-2">Game Name</th>
                <th className="border border-gray-300 p-2">Bet Digit</th>
                <th className="border border-gray-300 p-2">Bet Amount</th>
                <th className="border border-gray-300 p-2">Winning Amount</th>
              </tr>
            </thead>
            <tbody>
              {winMembers.map((member) => (
                <tr key={member.id}>
                  <td className="border border-gray-300 p-2 text-center">{member.id}</td>
                  <td className="border border-gray-300 p-2 text-center">{member.member}</td>
                  <td className="border border-gray-300 p-2 text-center">{member.gameName}</td>
                  <td className="border border-gray-300 p-2 text-center">{member.betDigit}</td>
                  <td className="border border-gray-300 p-2 text-center">{member.betAmount}</td>
                  <td className="border border-gray-300 p-2 text-center">{member.winningAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Game Result History Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Game Result History - 27-01-2025</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Game Name</th>
                <th className="border border-gray-300 p-2">Open Pana</th>
                <th className="border border-gray-300 p-2">Open Action</th>
                <th className="border border-gray-300 p-2">Close Pana</th>
                <th className="border border-gray-300 p-2">Close Action</th>
              </tr>
            </thead>
            <tbody>
              {gameResults.map((result) => (
                <tr key={result.id}>
                  <td className="border border-gray-300 p-2 text-center">{result.id}</td>
                  <td className="border border-gray-300 p-2 text-center">{result.gameName}</td>
                  <td className="border border-gray-300 p-2 text-center">{result.openPana}</td>
                  <td className="border border-gray-300 p-2 text-center text-blue-500 cursor-pointer">
                    Delete Result
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{result.closePana}</td>
                  <td className="border border-gray-300 p-2 text-center text-blue-500 cursor-pointer">
                    Delete Result
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeclareResult;
