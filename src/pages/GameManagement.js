import React, { useState, useEffect } from "react";
import EditModal from "./EditModal"; 

const GameManagement = () => {
  const [games, setGames] = useState(() => {

    const savedGames = localStorage.getItem("games");
    return savedGames ? JSON.parse(savedGames) : [];
  });

  const [formData, setFormData] = useState({
    marketName: "",
    marketType: "",
    marketOpenTime: "",
    marketCloseTime: "",
    selectedGame: "",
  });

  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [editModalData, setEditModalData] = useState(null);


  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMarket = () => {
  
    if (
      !formData.marketName ||
      !formData.marketType ||
      !formData.marketOpenTime ||
      !formData.marketCloseTime ||
      !formData.selectedGame
    ) {
      alert("Please fill in all fields before adding a market.");
      return;
    }

    const newGame = {
      id: games.length + 1,
      name: formData.marketName,
      open: formData.marketOpenTime,
      close: formData.marketCloseTime,
      status: "Active",
    };

    setGames([...games, newGame]);
    setFormData({
      marketName: "",
      marketType: "",
      marketOpenTime: "",
      marketCloseTime: "",
      selectedGame: "",
    });
  };

  const handleDeleteGame = (game) => {
    setGameToDelete(game);
    setIsConfirmDelete(true);
  };

  const confirmDelete = () => {
    setGames(games.filter((game) => game.id !== gameToDelete.id));
    setIsConfirmDelete(false);
    setGameToDelete(null);
  };

  const cancelDelete = () => {
    setIsConfirmDelete(false);
    setGameToDelete(null);
  };

  const handleEditGame = (game) => {
    setEditModalData(game);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditModalData({ ...editModalData, [name]: value });
  };

  const handleSaveEdit = () => {
    setGames(
      games.map((game) =>
        game.id === editModalData.id ? { ...editModalData } : game
      )
    );
    setEditModalData(null);
  };

  return (
    <div className="p-6">

      <div className="mb-6 p-4 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Select Game</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Market Name</label>
            <input
              type="text"
              name="marketName"
              value={formData.marketName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Market Name"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Market Type</label>
            <select
              name="marketType"
              value={formData.marketType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Market Open Time</label>
            <input
              type="time"
              name="marketOpenTime"
              value={formData.marketOpenTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Market Close Time</label>
            <input
              type="time"
              name="marketCloseTime"
              value={formData.marketCloseTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Select Game</label>
            <select
              name="selectedGame"
              value={formData.selectedGame}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Game</option>
              <option value="Game 1">Game 1</option>
              <option value="Game 2">Game 2</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleAddMarket}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Market
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Game Name</th>
              <th className="border p-2">Today Open</th>
              <th className="border p-2">Today Close</th>
              <th className="border p-2">Market Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={game.id} className={`text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{game.name}</td>
                <td className="border p-2">{game.open}</td>
                <td className="border p-2">{game.close}</td>
                <td className="border p-2">{game.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditGame(game)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isConfirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete?</h3>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-4"
            >
              Yes
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              No
            </button>
          </div>
        </div>
      )}

      {editModalData && (
        <EditModal
          gameData={editModalData}
          onChange={handleEditChange}
          onSave={handleSaveEdit}
          onClose={() => setEditModalData(null)}
        />
      )}
    </div>
  );
};

export default GameManagement;
