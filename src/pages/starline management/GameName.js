import React, { useEffect, useState } from "react";
import AddGame from "../../components/AddGame";
import instance from "../../utils/axiosInstance";
import { appiD } from "../../utils/config";
import EditGameModal from "./EditGameModal"; // Import the modal component

const GameSchedule = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch game list from API
  const fetchGameList = async () => {
    try {
      const response = await instance.get(`/api/starline/getGameList/${appiD}`);
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

  // Fetch game details by ID for editing
  const fetchGameDetails = async (gameId) => {
    setLoadingAction(`edit-${gameId}`);
    setModalLoading(true);
    try {
      const response = await instance.get(`/api/starline/getGameListById/${appiD}/${gameId}`);
      if (response.data.success) {
        setEditingGame(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching game details:", error);
    } finally {
      setLoadingAction(null);
      setModalLoading(false);
    }
  };

  // Toggle Active Status for main game
  const toggleGameStatus = async (gameId, currentStatus) => {
    setLoadingAction(`toggle-${gameId}`);
    try {
      const response = await instance.patch(`/api/starline/updateGameById/${appiD}/${gameId}`, {
        is_active: !currentStatus,
      });

      if (response.data.success) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game._id === gameId ? { ...game, is_active: !currentStatus } : game
          )
        );
      }
    } catch (error) {
      console.error("Error updating game status:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle Active/Inactive Status for Each Day
  const toggleDayStatus = async (dayIndex, gameId) => {
    setLoadingAction(`toggle-day-${dayIndex}`);
    try {
      const updatedDays = [...editingGame.week_selection];
      updatedDays[dayIndex].is_open = !updatedDays[dayIndex].is_open;

      await instance.patch(`/api/starline/updateGameById/${appiD}/${gameId}`, {
        week_selection: updatedDays,
      });

      setEditingGame((prev) => ({
        ...prev,
        week_selection: updatedDays,
      }));
    } catch (error) {
      console.error("Error updating day status:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Update for Each Day
  const handleDayChange = (index, field, value) => {
    setEditingGame((prev) => {
      const updatedDays = [...prev.week_selection];
      updatedDays[index][field] = value;
      return { ...prev, week_selection: updatedDays };
    });
  };

  // Delete Game
  const deleteGame = async (gameId) => {
    setLoadingAction(`delete-${gameId}`);
    try {
      const response = await instance.delete(`/api/starline/deleteGameById/${appiD}/${gameId}`);
      if (response.data.success) {
        setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  // Open Edit Popup
  const openEditPopup = (gameId) => {
    fetchGameDetails(gameId);
  };

  // Close Edit Popup
  const closeEditPopup = () => {
    setEditingGame(null);
  };

  // Update Game Details
  const handleUpdateGame = async () => {
    setModalLoading(true);
    try {
      const response = await instance.patch(
        `/api/starline/updateGameById/${appiD}/${editingGame._id}`,
        {
          game_name: editingGame.game_name,
          close_time: editingGame.close_time,
          week_selection: editingGame.week_selection,
        }
      );

      if (response.data.success) {
        setGames((prevGames) =>
          prevGames.map((game) => (game._id === editingGame._id ? response.data.data : game))
        );
        closeEditPopup();
      }
    } catch (error) {
      console.error("Error updating game:", error);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  return (
    <div className="p-4 max-w-screen mx-auto">
      <AddGame onGameAdded={(newGame) => setGames((prevGames) => [...prevGames, newGame])} />

      <h2 className="text-2xl font-bold mb-4 text-center">Game Schedule</h2>

      {loading && <p className="text-center">Loading games...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto p-2">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th>#</th>
                <th>Game Name</th>
                <th>Close Time</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={game._id} className="border-b">
                  <td>{index + 1}</td>
                  <td>{game.game_name}</td>
                  <td>{game.close_time}</td>
                  <td>
                    <button
                      onClick={() => toggleGameStatus(game._id, game.is_active)}
                      disabled={loadingAction === `toggle-${game._id}`}
                      className={`px-3 py-1 rounded-md text-white ${
                        game.is_active ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {loadingAction === `toggle-${game._id}` ? "Updating..." : game.is_active ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => openEditPopup(game._id)} className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">
                      {loadingAction === `edit-${game._id}` ? "Loading..." : "Edit"}
                    </button>
                    <button onClick={() => deleteGame(game._id)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                      {loadingAction === `delete-${game._id}` ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Popup */}
      {editingGame && (
        <EditGameModal
          editingGame={editingGame}
          setEditingGame={setEditingGame}
          handleUpdateGame={handleUpdateGame}
          closeEditPopup={closeEditPopup}
          toggleDayStatus={toggleDayStatus}
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
};

export default GameSchedule;
