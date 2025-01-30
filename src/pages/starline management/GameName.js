import React, { useState } from "react";

const gameData = [
  { id: 1, gameTime: "12:00 am", gameName: "10:00 AM", isActive: false },
  { id: 2, gameTime: "01:00 am", gameName: "11:00 AM", isActive: false },
  { id: 3, gameTime: "02:00 am", gameName: "12:00 PM", isActive: false },
  { id: 4, gameTime: "03:00 am", gameName: "03:00:00", isActive: false },
  { id: 5, gameTime: "04:00 am", gameName: "04:00:00", isActive: false },
  { id: 6, gameTime: "05:00 am", gameName: "05:00:00", isActive: false },
  { id: 7, gameTime: "06:00 am", gameName: "06:00:00", isActive: false },
  { id: 8, gameTime: "07:00 am", gameName: "07:00:00", isActive: false },
  { id: 9, gameTime: "08:00 am", gameName: "08:00:00", isActive: false },
  { id: 10, gameTime: "09:00 am", gameName: "10:00 AM", isActive: false },
];

const GameSchedule = () => {
  const [games, setGames] = useState(gameData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleToggle = (id) => {
    setGames((prev) =>
      prev.map((game) =>
        game.id === id ? { ...game, isActive: !game.isActive } : game
      )
    );
  };

  const handleEdit = (game) => {
    setSelectedGame({ ...game });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setGames((prev) =>
      prev.map((game) =>
        game.id === selectedGame.id ? { ...selectedGame } : game
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Game Schedule</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Game Time</th>
              <th className="py-2 px-4">Game Name</th>
              <th className="py-2 px-4">Action</th>
              <th className="py-2 px-4">On / Off</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b">
                <td className="py-2 px-4 text-center">{game.id}</td>
                <td className="py-2 px-4 text-center">{game.gameTime}</td>
                <td className="py-2 px-4 text-center">{game.gameName}</td>
                <td className="py-2 px-4 text-center">
                  <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded" 
                    onClick={() => handleEdit(game)}
                  >
                    Edit
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={game.isActive}
                      onChange={() => handleToggle(game.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedGame && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Game</h3>
            <label className="block mb-2">Game Name:</label>
            <input
              type="text"
              className="border px-2 py-1 w-full mb-4"
              value={selectedGame.gameName}
              onChange={(e) => 
                setSelectedGame((prev) => ({ ...prev, gameName: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSchedule;
