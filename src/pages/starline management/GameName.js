import React, { useEffect, useState } from "react";
import EditGameModal from "../EditGameModal";
import AddGame from "../../components/AddGame"; // Import the AddGame component
import instance from "../../utils/axiosInstance";
import { apiUrl } from "../../utils/config";

const GameSchedule = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleSaveGame = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((game) => (game._id === updatedGame._id ? updatedGame : game))
    );
    setIsModalOpen(false);
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  const fetchGameList = async () => {
    try {
      const response = await instance.get(`${apiUrl}/api/starline/getGameList`);
      if (response.data.success) {
        setGames(response.data.data);
      } else {
        throw new Error("Failed to fetch game list");
      }
    } catch (error) {
      console.error("Error fetching game list:", error);
      setError("Failed to load game list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  return (
    <div className="p-4 max-w-screen mx-auto">
      {/* Add Game Section */}
      <AddGame onGameAdded={(newGame) => setGames((prevGames) => [...prevGames, newGame])} />

      {/* Game Schedule Table */}
      <h2 className="text-2xl font-bold mb-4 text-center">Game Schedule</h2>

      {loading && <p className="text-center">Loading games...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Game Name</th>
                <th className="py-2 px-4">Close Time</th>
                <th className="py-2 px-4">Active</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={game._id} className="border-b">
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4 text-center">{game.game_name}</td>
                  <td className="py-2 px-4 text-center">{game.close_time}</td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-md text-white ${game.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {game.is_active ? "ON" : "OFF"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center bg-blue-500 w-3">
                    <button onClick={() => openEditModal(game)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditGameModal isOpen={isModalOpen} gameData={selectedGame} onSave={handleSaveGame} onCancel={handleCancelEdit} />
    </div>
  );
};

export default GameSchedule;
