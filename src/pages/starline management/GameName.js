import React, { useEffect, useState } from "react";
import EditGameModal from "../EditGameModal"; // Import the modal component
import instance from "../../utils/axiosInstance";
import { apiUrl, dummyUrl } from "../../utils/config";


const gameData = [
  { id: 1, gameTime: "12:00 am", gameName: "10:00 AM", isActive: false },
  { id: 2, gameTime: "01:00 am", gameName: "11:00 AM", isActive: false },
  { id: 3, gameTime: "02:00 am", gameName: "12:00 PM", isActive: false },
  { id: 4, gameTime: "03:00 am", gameName: "03:00:00", isActive: false },
  { id: 5, gameTime: "04:00 am", gameName: "04:00:00", isActive: false },
];



const GameSchedule = () => {
  const [posts, setPosts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null)
  const [games, setGames] = useState(gameData);
  const [selectedGame, setSelectedGame] = useState(null); // To store selected game for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [formData, setFormData] = useState({
    marketName: "",
    marketOpenTime: "",
    marketCloseTime: "",
    isMarketActive: false,
  });

  const openEditModal = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleSaveGame = (updatedGame) => {
    const updatedGames = games.map((game) =>
      game.id === updatedGame.id ? updatedGame : game
    );
    setGames(updatedGames);
    setIsModalOpen(false); // Close modal after save
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false); // Close modal without saving
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({ ...prev, isMarketActive: !prev.isMarketActive }));
  };

  const handleAddMarket = () => {
    if (!formData.marketName || !formData.marketOpenTime || !formData.marketCloseTime) {
      alert("Please fill in all fields before adding a market.");
      return;
    }

    const newMarket = {
      id: games.length + 1,
      gameTime: `${formData.marketOpenTime} - ${formData.marketCloseTime}`,
      gameName: formData.marketName,
      isActive: formData.isMarketActive,
    };

    setGames([...games, newMarket]);
    setFormData({
      marketName: "",
      marketOpenTime: "",
      marketCloseTime: "",
      isMarketActive: false,
    });
  };
  useEffect(() => {
    const getCategory = async () => {
      try {
       
        const response = await instance.get(apiUrl);
         if (response && response.data) {
          console.log("Response data:", response.data); 
          setCategories(response.data);  }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories"); 
      }
    };

    getCategory();
  }, []); 
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="p-4 max-w-screen mx-auto">
      {/* Add Market Section */}
      <div className="mb-6 p-4 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Add Market</h2>
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
            <label className="block mb-1 font-medium">Market On/Off</label>
            <div className="flex items-center justify-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMarketActive}
                  onChange={handleToggleChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300 ease-in-out">
                  <div className="w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:transform peer-checked:translate-x-6"></div>
                </div>
              </label>
            </div>
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

      {/* Game Schedule Table */}
  
      <h2 className="text-2xl font-bold mb-4 text-center">Game Schedule</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Game Time</th>
              <th className="py-2 px-4">Game Name</th>
              <th className="py-2 px-4">On / Off</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b">
                <td className="py-2 px-4 text-center">{game.id}</td>
                <td className="py-2 px-4 text-center">{game.gameTime}</td>
                <td className="py-2 px-4 text-center">{game.gameName}</td>
                <td className="py-2 px-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={game.isActive}
                      readOnly
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600"></div>
                  </label>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => openEditModal(game)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <EditGameModal
        isOpen={isModalOpen}
        gameData={selectedGame}
        onSave={handleSaveGame}
        onCancel={handleCancelEdit}
      />
    </div>
  );
};

export default GameSchedule;
