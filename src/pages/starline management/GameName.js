import React, { useEffect, useState } from "react";
import { Table, Button, Switch, message, Spin, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddGame from "../../components/AddGame";
import instance from "../../utils/axiosInstance";
import EditGameModal from "./EditGameModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const GameName = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]); // Filtered Data
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [filterStatus, setFilterStatus] = useState("all"); // Filter state
  const [pageSize, setPageSize] = useState(5); // Entries state

  // Fetch game list
  const fetchGameList = async () => {
    try {
      const response = await instance.get(`/api/starline/getGameList`);
      if (response.data.success) {
        setGames(response.data.data);
        setFilteredGames(response.data.data); // Initialize filtered list
      } else {
        throw new Error("Failed to fetch game list");
      }
    } catch (error) {
      message.error("Failed to load game list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  // Search Handler
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterGames(value, filterStatus, games);
  };

  // Filter Handler
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    filterGames(searchTerm, value, games);
  };

  // Function to filter games based on search and status.
  // Accept an optional gamesData parameter (defaulting to the current games state)
  const filterGames = (search, status, gamesData = games) => {
    let updatedGames = gamesData;

    if (search) {
      updatedGames = updatedGames.filter((game) =>
        game.game_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      updatedGames = updatedGames.filter((game) =>
        status === "active" ? game.is_active : !game.is_active
      );
    }

    setFilteredGames(updatedGames);
  };

  // Toggle game status and update the list immediately
  const toggleGameStatus = async (gameId, currentStatus) => {
    setLoadingAction(`toggle-${gameId}`);
    try {
      const response = await instance.patch(
        `/api/starline/updateGameById/${gameId}`,
        {
          is_active: !currentStatus,
        }
      );

      if (response.data.success) {
        // Create an updated games list
        const updatedGames = games.map((game) =>
          game._id === gameId ? { ...game, is_active: !currentStatus } : game
        );
        setGames(updatedGames);
        // Use the updated list when reapplying filters
        filterGames(searchTerm, filterStatus, updatedGames);
        message.success("Game status updated.");
      }
    } catch (error) {
      message.error("Error updating game status.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete game function
  const deleteGame = async (gameId) => {
    setLoadingAction(`delete-${gameId}`);
    try {
      const response = await instance.delete(`/api/starline/deleteGameById/${gameId}`);
      if (response.data.success) {
        // Remove the deleted game from the state
        const updatedGames = games.filter((game) => game._id !== gameId);
        setGames(updatedGames);
        filterGames(searchTerm, filterStatus, updatedGames);
        toast.success("Game deleted successfully.");
      }
    } catch (error) {
      toast.error("Error deleting game.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Game Schedule
      </h2>
      {/* Add Game Component */}
      <AddGame
        onGameAdded={(newGame) => {
          const newGames = [...games, newGame];
          setGames(newGames);
          filterGames(searchTerm, filterStatus, newGames);
        }}
      />

      {/* Search, Filter & Entries Options */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 mb-4">
        {/* Search Input */}
        <Input
          placeholder="Search Game Name..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
        />

        {/* Filter Dropdown */}
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          className="w-40"
        >
          <Option value="all">All Games</Option>
          <Option value="active">Active Games</Option>
          <Option value="inactive">Inactive Games</Option>
        </Select>

        {/* Entries Dropdown */}
        <Select
          value={pageSize}
          onChange={(value) => setPageSize(value)}
          className="w-24"
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={50}>50</Option>
        </Select>
      </div>

      {/* Game Table */}
      {loading ? (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={[
            {
              title: "#",
              dataIndex: "index",
              key: "index",
              render: (_, __, index) => index + 1,
            },
            {
              title: "Game Name",
              dataIndex: "game_name",
              key: "game_name",
            },
            {
              title: "Close Time",
              dataIndex: "close_time",
              key: "close_time",
            },
            {
              title: "Active",
              dataIndex: "is_active",
              key: "is_active",
              render: (isActive, record) => (
                <Switch
                  checked={isActive}
                  onChange={() => toggleGameStatus(record._id, isActive)}
                  loading={loadingAction === `toggle-${record._id}`}
                />
              ),
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <div className="flex space-x-2">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditingGame(record)}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteGame(record._id)}
                  loading={loadingAction === `delete-${record._id}`}
                >
                  Delete
                </Button>
              </div>
              
              ),
            },
          ]}
          dataSource={filteredGames.map((game, index) => ({
            ...game,
            key: index,
          }))}
          pagination={{ pageSize }}
          className="mt-6"
        />
      )}

      {/* Edit Game Modal */}
      {editingGame && (
        <EditGameModal
          editingGame={editingGame}
          setEditingGame={setEditingGame}
          handleUpdateGame={() => {
            fetchGameList(); // Refresh game list after update
            setEditingGame(null);
          }}
          closeEditPopup={() => setEditingGame(null)}
        />
      )}
    </div>
  );
};

export default GameName;
