import React, { useState, useEffect, useMemo } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "../utils/axiosInstance";
import dayjs from "dayjs";

const gameTypeOptions = [
  "Triple Pana",
  "Panel Group",
  "SP DP TP",
  "Choice Panna SP DP",
  "SP Motor",
  "DP Motor",
  "Odd Even",
  "Two Digits Panel",
  "Group Jodi",
  "Digit Based Jodi",
  "Red Bracket",
  "Half Sangam A",
  "Half Sangam B",
  "Full Sangam",
  "Single Digits",
  "Single Digits Bulk",
  "Jodi",
  "Jodi Bulk",
  "Single Pana",
  "Single Pana Bulk",
  "Double Pana",
  "Double Pana Bulk",
];

// 12-hour format time options generator
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // Every 30 minutes
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const time12 = dayjs(`2000-01-01 ${time24}`).format('hh:mm A');
      times.push({
        value24: time24,
        value12: time12,
        display: time12
      });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const GameManagement = () => {
  const [fetchedGames, setFetchedGames] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedGameTypes, setSelectedGameTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [marketStatus, setMarketStatus] = useState("active");
  const [formData, setFormData] = useState({
    marketName: "Main Market",
    gameName: "",
    gameType: [],
    openTime: "",
    closeTime: "",
    marketStatus: "active", // Changed from marketOnOff: false to marketStatus: "active"
  });
  const [editFormData, setEditFormData] = useState({
    gameName: "",
    gameType: [],
    openTime: "",
    closeTime: "",
    weekends: [],
  });

  const sortedGameTypeOptionsAsc = [...gameTypeOptions].sort((a, b) =>
    a.localeCompare(b)
  );

  const sortedGames = useMemo(() => {
    return [...fetchedGames].sort((a, b) => {
      const timeA = dayjs(a.openTime, "hh:mm A").valueOf();
      const timeB = dayjs(b.openTime, "hh:mm A").valueOf();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [fetchedGames, sortOrder]);

  const filteredGames = sortedGames
    .filter((game) => {
      if (marketStatus === "active") {
        return game.isActive === true;
      } else if (marketStatus === "inactive") {
        return game.isActive === false;
      }
      return true;
    })
    .filter((game) =>
      game?.gameName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/marketManagement/getMarketGames`);
      if (response.data) {
        setFetchedGames(response.data || []);
      } else {
        alert("Failed to fetch market games.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      alert("Failed to fetch games.");
    } finally {
      setLoading(false);
      setFirstLoad(false);
    }
  };

  const handleGameTypeChange = (selectedValues) => {
    if (
      selectedValues.includes("Select All") ||
      selectedValues.length === sortedGameTypeOptionsAsc.length
    ) {
      setSelectedGameTypes(sortedGameTypeOptionsAsc);
      setFormData({ ...formData, gameType: sortedGameTypeOptionsAsc });
    } else {
      const filteredValues = selectedValues.filter(
        (val) => val !== "Select All"
      );
      setSelectedGameTypes(filteredValues);
      setFormData({ ...formData, gameType: filteredValues });
    }
  };

  const handleEditGameTypeChange = (selectedValues) => {
    if (
      selectedValues.includes("Select All") ||
      selectedValues.length === sortedGameTypeOptionsAsc.length
    ) {
      setEditFormData({ ...editFormData, gameType: sortedGameTypeOptionsAsc });
    } else {
      setEditFormData({
        ...editFormData,
        gameType: selectedValues.filter((val) => val !== "Select All"),
      });
    }
  };

  const handleAddGame = async () => {
    try {
      const newGame = {
        marketName: "Main Market",
        gameName: formData.gameName,
        gameType: sortedGameTypeOptionsAsc,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        isActive: formData.marketStatus === "active", // Convert to boolean
      };

      await axios.post(`/api/marketManagement/addMarketGame`, newGame);
      alert("Game added successfully!");
      fetchGames();
      setFormData({
        marketName: "Main Market",
        gameName: "",
        gameType: [],
        openTime: "",
        closeTime: "",
        marketStatus: "active", // Reset to active
      });
      setSelectedGameTypes([]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game.");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.put(`/api/marketManagement/updateMarketGame/${id}`, {
        isActive: !isActive,
      });
      alert("Market status updated!");
      fetchGames();
    } catch (error) {
      console.error("Error updating market status:", error);
      alert("Failed to update market status.");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedGame = {
        gameName: editFormData.gameName,
        gameType: editFormData.gameType,
        openTime: editFormData.openTime,
        closeTime: editFormData.closeTime,
        weekends: editFormData.weekends.map((day) => ({
          ...day,
          openTime: day.openTime,
          closeTime: day.closeTime,
          is_open: day.is_open,
        })),
      };

      await axios.put(
        `/api/marketManagement/updateMarketGame/${editingGame._id}`,
        updatedGame
      );
      alert("Game updated successfully!");
      setIsEditModalOpen(false);
      fetchGames();
    } catch (error) {
      console.error("Error updating game:", error);
      alert("Failed to update game.");
    }
  };

  const handleEdit = (record) => {
    setEditingGame(record);
    setIsEditModalOpen(true);
    setEditFormData({
      gameName: record.gameName,
      gameType: record.gameType || [],
      openTime: record.openTime || "",
      closeTime: record.closeTime || "",
      weekends: record.weekends.map((day) => ({
        ...day,
        openTime: day.openTime || "",
        closeTime: day.closeTime || "",
        is_open: day.is_open,
      })),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await axios.delete(`/api/marketManagement/deleteMarketGameById/${id}`);
        alert("Game deleted successfully!");
        fetchGames();
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game.");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleWeekendChange = (index, field, value) => {
    const updatedWeekends = [...editFormData.weekends];
    updatedWeekends[index] = {
      ...updatedWeekends[index],
      [field]: value,
    };
    setEditFormData({
      ...editFormData,
      weekends: updatedWeekends,
    });
  };

  // Function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12) => {
    if (!time12) return '';
    return dayjs(`2000-01-01 ${time12}`).format('HH:mm');
  };

  // Function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    return dayjs(`2000-01-01 ${time24}`).format('hh:mm A');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Game Market
          </h2>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
                  Game List
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  <PlusOutlined />
                  Add Game
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by:
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asc">Old to New</option>
                    <option value="desc">New to Old</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Show Entries:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Games..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchOutlined className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setMarketStatus("active")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        marketStatus === "active"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Active Market
                    </button>
                    <button
                      onClick={() => setMarketStatus("inactive")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        marketStatus === "inactive"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Inactive Market
                    </button>
                  </nav>
                </div>
              </div>

              <div className="overflow-x-auto">
                {firstLoad ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredGames.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-5xl mb-4">📊</div>
                    <p className="text-gray-500">No Games Available</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Game Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Open Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Close Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGames.map((game, index) => (
                        <tr key={game._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {game.gameName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {convertTo12Hour(game.openTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {convertTo12Hour(game.closeTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                handleToggle(game._id, game.isActive)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                game.isActive
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  game.isActive
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(game)}
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2"
                            >
                              <EditOutlined />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(game._id)}
                              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                            >
                              <DeleteOutlined />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {!firstLoad && filteredGames.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing {Math.min(filteredGames.length, pageSize)} of{" "}
                      {filteredGames.length} games
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Game Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Game
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Game Name
                    </label>
                    <input
                      type="text"
                      name="gameName"
                      value={formData.gameName}
                      onChange={handleFormChange}
                      placeholder="Enter Game Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Open Time
                    </label>
                    <select
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Open Time</option>
                      {timeOptions.map((time) => (
                        <option key={time.value24} value={time.value24}>
                          {time.display}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Close Time
                    </label>
                    <select
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Close Time</option>
                      {timeOptions.map((time) => (
                        <option key={time.value24} value={time.value24}>
                          {time.display}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Changed from checkbox to dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Status
                    </label>
                    <select
                      name="marketStatus"
                      value={formData.marketStatus}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active (On)</option>
                      <option value="inactive">Inactive (Off)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGame}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Game</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Name
                  </label>
                  <input
                    type="text"
                    name="gameName"
                    value={editFormData.gameName}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Type
                  </label>
                  <select
                    multiple
                    value={editFormData.gameType}
                    onChange={(e) =>
                      handleEditGameTypeChange(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  >
                    <option value="Select All">Select All</option>
                    {sortedGameTypeOptionsAsc.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Time
                    </label>
                    <select
                      name="openTime"
                      value={editFormData.openTime}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Open Time</option>
                      {timeOptions.map((time) => (
                        <option key={time.value24} value={time.value24}>
                          {time.display}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Close Time
                    </label>
                    <select
                      name="closeTime"
                      value={editFormData.closeTime}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Close Time</option>
                      {timeOptions.map((time) => (
                        <option key={time.value24} value={time.value24}>
                          {time.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {editingGame?.weekends?.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Weekends Schedule
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...editingGame.weekends]
                        .sort(
                          (a, b) =>
                            dayjs(a.openTime, "hh:mm A").valueOf() -
                            dayjs(b.openTime, "hh:mm A").valueOf()
                        )
                        .map((day, index) => (
                          <div
                            key={day.day}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <h5 className="font-medium text-center text-gray-900">
                              {day.day}
                            </h5>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Open Time
                              </label>
                              <select
                                value={
                                  editFormData.weekends[index]?.openTime || ""
                                }
                                onChange={(e) =>
                                  handleWeekendChange(
                                    index,
                                    "openTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Open Time</option>
                                {timeOptions.map((time) => (
                                  <option key={time.value24} value={time.value24}>
                                    {time.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Close Time
                              </label>
                              <select
                                value={
                                  editFormData.weekends[index]?.closeTime || ""
                                }
                                onChange={(e) =>
                                  handleWeekendChange(
                                    index,
                                    "closeTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Close Time</option>
                                {timeOptions.map((time) => (
                                  <option key={time.value24} value={time.value24}>
                                    {time.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    editFormData.weekends[index]?.is_open ||
                                    false
                                  }
                                  onChange={(e) =>
                                    handleWeekendChange(
                                      index,
                                      "is_open",
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Active Status
                                </span>
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Update Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameManagement;