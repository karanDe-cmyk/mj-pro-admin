import React, { useEffect, useState } from "react";
import { Table, Button, Switch, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddGame from "../../components/AddGame";
import instance from "../../utils/axiosInstance";
import {  } from "../../utils/config";
import EditGameModal from "./EditGameModal";

const GameName = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [editingGame, setEditingGame] = useState(null);

  // Fetch game list
  const fetchGameList = async () => {
    try {
      const response = await instance.get(`/api/starline/getGameList`);
      if (response.data.success) {
        setGames(response.data.data);
      } else {
        throw new Error("Failed to fetch game list");
      }
    } catch (error) {
      message.error("Failed to load game list.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle game status
  const toggleGameStatus = async (gameId, currentStatus) => {
    setLoadingAction(`toggle-${gameId}`);
    try {
      const response = await instance.patch(`/api/starline/updateGameById/${gameId}`, {
        is_active: !currentStatus,
      });

      if (response.data.success) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game._id === gameId ? { ...game, is_active: !currentStatus } : game
          )
        );
        message.success("Game status updated.");
      }
    } catch (error) {
      message.error("Error updating game status.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle day status inside Edit Modal
  const toggleDayStatus = async (dayIndex, gameId) => {
    setLoadingAction(`toggle-day-${dayIndex}`);

    try {
      const updatedDays = [...editingGame.week_selection];
      updatedDays[dayIndex].is_open = !updatedDays[dayIndex].is_open;

      await instance.patch(`/api/starline/updateGameById/${gameId}`, {
        week_selection: updatedDays,
      });

      setEditingGame((prev) => ({
        ...prev,
        week_selection: updatedDays,
      }));

      message.success("Day status updated successfully!");
    } catch (error) {
      message.error("Failed to update day status.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Game Update
  const handleUpdateGame = async () => {
    setLoadingAction("update");

    try {
      const response = await instance.patch(
        `/api/starline/updateGameById/${editingGame._id}`,
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

        message.success("Game updated successfully!");
        setEditingGame(null);
      } else {
        message.error("Failed to update the game.");
      }
    } catch (error) {
      message.error("An error occurred while updating the game.");
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchGameList();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Game Schedule</h2>

      <AddGame onGameAdded={(newGame) => setGames((prevGames) => [...prevGames, newGame])} />

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
            { title: "Game Name", dataIndex: "game_name", key: "game_name" },
            { title: "Close Time", dataIndex: "close_time", key: "close_time" },
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
                </div>
              ),
            },
          ]}
          dataSource={games.map((game, index) => ({ ...game, key: index }))}
          pagination={{ pageSize: 5 }}
          className="mt-6"
        />
      )}

      {editingGame && (
        <EditGameModal
          editingGame={editingGame}
          setEditingGame={setEditingGame}
          handleUpdateGame={handleUpdateGame}
          closeEditPopup={() => setEditingGame(null)}
          toggleDayStatus={toggleDayStatus}
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
};

export default GameName;
