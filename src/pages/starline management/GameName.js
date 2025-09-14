import React, { useEffect, useState } from "react";
import { Table, Button, Switch, message, Spin, Input, Select, Popconfirm, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddGame from "../../components/AddGame";
import instance from "../../utils/axiosInstance";
import EditGameModal from "./EditGameModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";

const { Option } = Select;

const GameName = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]); // Filtered Data
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [filterStatus, setFilterStatus] = useState("all"); // Filter state

  // Function to sort games by close_time
  const sortGamesByTime = (gamesList) => {
    return [...gamesList].sort((a, b) => {
      const timeA = moment(a.close_time, "hh:mm A");
      const timeB = moment(b.close_time, "hh:mm A");
      return timeA.diff(timeB);
    });
  };

  // Fetch game list
  const fetchGameList = async () => {
    try {
      const response = await instance.get(`/api/starline/getGameList`);
      if (response.data.success) {
        // Sort the games by close time immediately after fetching
        const sortedGames = sortGamesByTime(response.data.data);
        setGames(sortedGames);
        setFilteredGames(sortedGames); // Initialize filtered list with sorted data
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
      } else {
        toast.error(response.data.message || "Failed to delete game.");
      }
    } catch (error) {
      toast.error("Error deleting game.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Handler for adding a new game
  const handleGameAdded = (newGame) => {
    // Create a new array with the new game
    const updatedGames = [...games, newGame];
    // Sort the new array by time
    const sortedGames = sortGamesByTime(updatedGames);
    setGames(sortedGames);
    // Re-apply filters to the newly sorted list
    filterGames(searchTerm, filterStatus, sortedGames);
    toast.success("Game added successfully!");
  };

  const handleUpdateGame = async () => {
    setLoadingAction(`update-${editingGame._id}`);
    try {
      const response = await instance.patch(
        `/api/starline/updateGameById/${editingGame._id}`,
        {
          game_name: editingGame.game_name,
          close_time: editingGame.close_time,
          is_active: editingGame.is_active,
          week_selection: editingGame.week_selection,
        }
      );

      if (response.data.success) {
        toast.success("Game updated successfully!");
        fetchGameList(); // Re-fetch the entire list to ensure data consistency
        setEditingGame(null); // Close the modal
      } else {
        toast.error(response.data.message || "Failed to update game.");
      }
    } catch (error) {
      console.error("Error updating game:", error);
      toast.error("An error occurred while updating the game.");
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
      <AddGame onGameAdded={handleGameAdded} />

      {/* Search, Filter Options */}
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
                  <Popconfirm
                    title="Are you sure to delete this game?"
                    onConfirm={() => deleteGame(record._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      loading={loadingAction === `delete-${record._id}`}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>

              ),
            },
          ]}
          dataSource={filteredGames.map((game, index) => ({
            ...game,
            key: index,
          }))}
          pagination={false} // Disable pagination
          className="mt-6"
        />
      )}

      {/* Edit Game Modal - Full Screen */}
      <Modal
        title=""
        open={!!editingGame}
        onCancel={() => setEditingGame(null)}
        footer={null}
        width="100%"
        style={{ top: 0 }}
        bodyStyle={{ height: "90vh" }}
        className="full-screen-modal"
      >
        {editingGame && (
          <EditGameModal
            editingGame={editingGame}
            setEditingGame={setEditingGame}
            handleUpdateGame={handleUpdateGame}
            closeEditPopup={() => setEditingGame(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default GameName;