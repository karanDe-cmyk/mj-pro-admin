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

// Time format validation and conversion utilities
const validateTimeFormat = (timeString) => {
  if (!timeString) return false;

  // Accept multiple formats
  const formats = [
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour: HH:mm
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, // 24-hour: HH:mm:ss
    /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM|am|pm)$/, // 12-hour: hh:mm AM/PM
    /^(1[0-2]|0?[1-9]):[0-5][0-9]:[0-5][0-9]\s?(AM|PM|am|pm)$/, // 12-hour: hh:mm:ss AM/PM
  ];

  return formats.some(format => format.test(timeString.trim()));
};

const normalizeTo24Hour = (timeString) => {
  if (!timeString) return '';

  const trimmedTime = timeString.trim().toUpperCase();

  // If already in 24-hour format
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(trimmedTime)) {
    const parts = trimmedTime.split(':');
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Convert 12-hour to 24-hour
  const match = trimmedTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2].padStart(2, '0');
    const period = match[4] || '';

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return '';
};

const formatTo12Hour = (time24) => {
  if (!time24) return '';

  try {
    return dayjs(`2000-01-01 ${time24}`).format('hh:mm A');
  } catch (error) {
    return time24;
  }
};

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
    marketStatus: "active",
  });
  const [editFormData, setEditFormData] = useState({
    gameName: "",
    gameType: [],
    openTime: "",
    closeTime: "",
    weekends: [],
  });

  const [timeErrors, setTimeErrors] = useState({
    addOpenTime: "",
    addCloseTime: "",
    editOpenTime: "",
    editCloseTime: "",
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
    // Validate time formats
    if (!validateTimeFormat(formData.openTime)) {
      setTimeErrors(prev => ({ ...prev, addOpenTime: "Invalid time format. Use HH:mm or hh:mm AM/PM" }));
      return;
    }

    if (!validateTimeFormat(formData.closeTime)) {
      setTimeErrors(prev => ({ ...prev, addCloseTime: "Invalid time format. Use HH:mm or hh:mm AM/PM" }));
      return;
    }

    try {
      const newGame = {
        marketName: "Main Market",
        gameName: formData.gameName,
        gameType: sortedGameTypeOptionsAsc,
        openTime: normalizeTo24Hour(formData.openTime),
        closeTime: normalizeTo24Hour(formData.closeTime),
        isActive: formData.marketStatus === "active",
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
        marketStatus: "active",
      });
      setSelectedGameTypes([]);
      setTimeErrors({
        addOpenTime: "",
        addCloseTime: "",
        editOpenTime: "",
        editCloseTime: "",
      });
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
    // Validate time formats
    if (!validateTimeFormat(editFormData.openTime)) {
      setTimeErrors(prev => ({ ...prev, editOpenTime: "Invalid time format. Use HH:mm or hh:mm AM/PM" }));
      return;
    }

    if (!validateTimeFormat(editFormData.closeTime)) {
      setTimeErrors(prev => ({ ...prev, editCloseTime: "Invalid time format. Use HH:mm or hh:mm AM/PM" }));
      return;
    }

    try {
      const updatedGame = {
        gameName: editFormData.gameName,
        gameType: sortedGameTypeOptionsAsc, // Always use all game types
        openTime: normalizeTo24Hour(editFormData.openTime),
        closeTime: normalizeTo24Hour(editFormData.closeTime),
        weekends: editFormData.weekends.map((day) => ({
          ...day,
          openTime: day.openTime ? normalizeTo24Hour(day.openTime) : "",
          closeTime: day.closeTime ? normalizeTo24Hour(day.closeTime) : "",
          is_open: day.is_open,
        })),
      };

      await axios.put(
        `/api/marketManagement/updateMarketGame/${editingGame._id}`,
        updatedGame
      );
      alert("Game updated successfully!");
      setIsEditModalOpen(false);
      setTimeErrors({
        addOpenTime: "",
        addCloseTime: "",
        editOpenTime: "",
        editCloseTime: "",
      });
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
      openTime: formatTo12Hour(record.openTime) || "",
      closeTime: formatTo12Hour(record.closeTime) || "",
      weekends: record.weekends.map((day) => ({
        ...day,
        openTime: day.openTime ? formatTo12Hour(day.openTime) : "",
        closeTime: day.closeTime ? formatTo12Hour(day.closeTime) : "",
        is_open: day.is_open,
      })),
    });
    setTimeErrors({
      addOpenTime: "",
      addCloseTime: "",
      editOpenTime: "",
      editCloseTime: "",
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

    // Clear error when user starts typing
    if (name === 'openTime') {
      setTimeErrors(prev => ({ ...prev, addOpenTime: "" }));
    }
    if (name === 'closeTime') {
      setTimeErrors(prev => ({ ...prev, addCloseTime: "" }));
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (name === 'openTime') {
      setTimeErrors(prev => ({ ...prev, editOpenTime: "" }));
    }
    if (name === 'closeTime') {
      setTimeErrors(prev => ({ ...prev, editCloseTime: "" }));
    }
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

  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    try {
      return formatTo12Hour(time24);
    } catch (error) {
      return time24;
    }
  };

  const handleTimeInputBlur = (field, value, isEdit = false) => {
    if (value && validateTimeFormat(value)) {
      // Auto-format the time
      const formattedTime = formatTo12Hour(normalizeTo24Hour(value));
      if (isEdit) {
        setEditFormData(prev => ({ ...prev, [field]: formattedTime }));
      } else {
        setFormData(prev => ({ ...prev, [field]: formattedTime }));
      }
    }
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
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${marketStatus === "active"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      Active Market
                    </button>
                    <button
                      onClick={() => setMarketStatus("inactive")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${marketStatus === "inactive"
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
                            {formatTimeDisplay(game.openTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTimeDisplay(game.closeTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                handleToggle(game._id, game.isActive)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${game.isActive
                                ? "bg-blue-600"
                                : "bg-gray-200"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${game.isActive
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
                    <input
                      type="text"
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleFormChange}
                      onBlur={() => handleTimeInputBlur('openTime', formData.openTime, false)}
                      placeholder="e.g., 09:30 AM or 14:45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {timeErrors.addOpenTime && (
                      <p className="mt-1 text-sm text-red-600">{timeErrors.addOpenTime}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: HH:mm (24-hour) or hh:mm AM/PM (12-hour)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Market Close Time
                    </label>
                    <input
                      type="text"
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleFormChange}
                      onBlur={() => handleTimeInputBlur('closeTime', formData.closeTime, false)}
                      placeholder="e.g., 06:00 PM or 18:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {timeErrors.addCloseTime && (
                      <p className="mt-1 text-sm text-red-600">{timeErrors.addCloseTime}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: HH:mm (24-hour) or hh:mm AM/PM (12-hour)
                    </p>
                  </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Time
                    </label>
                    <input
                      type="text"
                      name="openTime"
                      value={editFormData.openTime}
                      onChange={handleEditFormChange}
                      onBlur={() => handleTimeInputBlur('openTime', editFormData.openTime, true)}
                      placeholder="e.g., 09:30 AM or 14:45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {timeErrors.editOpenTime && (
                      <p className="mt-1 text-sm text-red-600">{timeErrors.editOpenTime}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: HH:mm (24-hour) or hh:mm AM/PM (12-hour)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Close Time
                    </label>
                    <input
                      type="text"
                      name="closeTime"
                      value={editFormData.closeTime}
                      onChange={handleEditFormChange}
                      onBlur={() => handleTimeInputBlur('closeTime', editFormData.closeTime, true)}
                      placeholder="e.g., 06:00 PM or 18:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {timeErrors.editCloseTime && (
                      <p className="mt-1 text-sm text-red-600">{timeErrors.editCloseTime}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: HH:mm (24-hour) or hh:mm AM/PM (12-hour)
                    </p>
                  </div>
                </div>

                {/* Apply to All Weekends Checkbox */}
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="applyToAllWeekends"
                    onChange={(e) => {
                      if (e.target.checked && editFormData.openTime && editFormData.closeTime) {
                        const updatedWeekends = editFormData.weekends.map(day => ({
                          ...day,
                          openTime: editFormData.openTime,
                          closeTime: editFormData.closeTime,
                          is_open: true
                        }));
                        setEditFormData({
                          ...editFormData,
                          weekends: updatedWeekends
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="applyToAllWeekends" className="ml-2 text-sm font-medium text-gray-700">
                    Apply main times to all weekends
                  </label>
                  <span className="ml-2 text-xs text-gray-500">
                    (Check this to copy main open/close times to all weekends)
                  </span>
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
                              <input
                                type="text"
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
                                onBlur={() => {
                                  const value = editFormData.weekends[index]?.openTime;
                                  if (value && validateTimeFormat(value)) {
                                    const formattedTime = formatTo12Hour(normalizeTo24Hour(value));
                                    handleWeekendChange(index, "openTime", formattedTime);
                                  }
                                }}
                                placeholder="e.g., 09:00 AM"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Close Time
                              </label>
                              <input
                                type="text"
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
                                onBlur={() => {
                                  const value = editFormData.weekends[index]?.closeTime;
                                  if (value && validateTimeFormat(value)) {
                                    const formattedTime = formatTo12Hour(normalizeTo24Hour(value));
                                    handleWeekendChange(index, "closeTime", formattedTime);
                                  }
                                }}
                                placeholder="e.g., 06:00 PM"
                                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
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