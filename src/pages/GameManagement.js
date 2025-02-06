import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal, Input, Select, Switch } from "antd";
import EditModal from "./EditModal";
import instance from "../utils/axiosInstance";

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
    games: "",
  });

  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
console.log("editModalData",editModalData)
  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);
  const handleAddMarket = async (values) => {
    console.log(values);
    if (
      !values.market_name ||
      !values.market_type ||
      !values.open_time ||
      !values.close_time ||
      !values.games
    ) {
      Modal.error({
        title: "Error",
        content: "Please fill in all fields before adding a market.",
      });
      return;
    }

    // Check for duplicate market names
    if (
      games.some(
        (game) => game.name.toLowerCase() === values.market_name.toLowerCase()
      )
    ) {
      Modal.error({
        title: "Error",
        content:
          "A market with this name already exists. Please use a unique name.",
      });
      return;
    }

    try {
      const response = await instance.post(
        "http://localhost:5001/api/marketManagement/addMarketGame/3d88dae8-5904-40e9-b314-4906bc064bed",
        {
          market_name: values.market_name,
          market_type: values.market_type,
          open_time: values.open_time,
          close_time: values.close_time,
          games: values.games,
          openActivity: values.open_activity,
          closeActivity: false,
          actions: {
            edit_market: true,
            edit_timings: false,
            edit_games: true,
          },
        }
      );

      if (response.status === 200) {
        console.log("Market added successfully");
        // Add the new market to the local state
        const newGame = {
          id: games.length + 1,
          name: values.market_name,
          open: values.open_time,
          close: values.close_time,
          status: "Active",
        };
        setGames([...games, newGame]);
        setFormData({
          marketName: "",
          marketType: "",
          marketOpenTime: "",
          marketCloseTime: "",
          games: "",
        });
      } else {
        throw new Error("Failed to add market");
      }
    } catch (error) {
      console.error("Error adding market:", error);
      Modal.error({
        title: "Error",
        content: "Failed to add market. Please try again.",
      });
    }
  };
  const handleDeleteGame = (record) => {
    instance
      .delete(
        `http://localhost:5001/api/marketManagement/deleteMarketGameById/3d88dae8-5904-40e9-b314-4906bc064bed/${record._id}`
      )
      .then((response) => {
        console.log(response.data);
        setGames(games.filter((game) => game.id !== record.id));
      })
      .catch((error) => {
        console.error(error);
      });
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
  const [gameSingleMarketList, setGameSingleMarketList] = useState(null);
  console.log("gameSingleMarketList", gameSingleMarketList?.data);
  const handleEditChange = async (record, e = {}) => {
    const { name, value } = e.target || {};
    setEditModalData({ ...editModalData, [name]: value });   try {
      const response = await instance.get(
        `http://localhost:5001/api/marketManagement/getSingleMarketGame/3d88dae8-5904-40e9-b314-4906bc064bed/${record?._id}`
      );
      if (response) {
        console.log("gameSingleMarketList", response);
        setGameSingleMarketList(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSaveEdit = () => {
    setGames(
      games.map((game) =>
        game.id === editModalData.id ? { ...editModalData } : game
      )
    );
    setEditModalData(null);
  };
  const [gameMarketList, setGameMarketList] = useState(null);
  console.log("gooVibesaaaaaaa", gameMarketList?.data);
  const fetchMarketGameList = async () => {
    try {
      const response = await instance.get(
        `http://localhost:5001/api/marketManagement/getMarketGames/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response) {
        console.log("goodVibeedsdsdds", response);
        setGameMarketList(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchMarketGameList();
  }, []);
  





  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Market Name",
      dataIndex: "MarketName",
      key: "MarketName",
      render: (text, record) => record?.market_name,
    },
    {
      title: "Today Open",
      dataIndex: "todayOpen",
      key: "todayOpen",
      render: (text, record) => record?.open_time,
    },
    {
      title: "Today Close",
      dataIndex: "todayClose",
      key: "todayClose",
      render: (text, record) => record?.close_time,
    },
    {
      title: "Market Status",
      dataIndex: "openActivity",
      key: "openActivity",
      render: (text, record) => record?.openActivity ? "Open" : "Close",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => handleEditChange(record)}
            style={{ marginRight: 16 }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDeleteGame(record)}>
            Remove
          </Button>
        </span>
      ),
    },
  ];
  const [gameList, setGameList] = useState(null);
  console.log("gooVibesaaaaaaa", gameList?.data);
  const fetchGameList = async () => {
    try {
      const response = await instance.get(
        `http://localhost:5001/api/gameRoutes/getGameList/3d88dae8-5904-40e9-b314-4906bc064bed`
      );
      if (response) {
        console.log("goodVibeedsdsdds", response);
        setGameList(response?.data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchGameList();
  }, []);
  return (
    <div className="p-6">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleAddMarket}
        autoComplete="off"
      >
        <Form.Item
          label="Market Name"
          name="market_name"
          rules={[
            { required: true, message: "Please input your market name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Market Type"
          name="market_type"
          rules={[
            { required: true, message: "Please select your market type!" },
          ]}
        >
          <Select>
            <Select.Option value="">Select</Select.Option>
            <Select.Option value="Main">Main</Select.Option>
            <Select.Option value="Starline">Starline</Select.Option>
            <Select.Option value="King Jackpot">King Jackpot</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Market Open Time"
          name="open_time"
          rules={[
            { required: true, message: "Please input your market open time!" },
          ]}
        >
          <Input type="time" />
        </Form.Item>

        <Form.Item
          label="Market Close Time"
          name="close_time"
          rules={[
            { required: true, message: "Please input your market close time!" },
          ]}
        >
          <Input type="time" />
        </Form.Item>

        <Form.Item
          label="Select Game"
          name="games"
          rules={[{ required: true, message: "Please select your game!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select Games"
          >
            <Select.Option value="">Select Game</Select.Option>
            <Select.Option value="singleDigit">Single Digit</Select.Option>
            <Select.Option value="singlePanna">Single Paana</Select.Option>
            <Select.Option value="doubleDigit">Double Digit</Select.Option>
            <Select.Option value="doublePanna">Double Paana</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Open Activity"
          name="open_activity"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Add Market
          </Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={gameMarketList?.data} />

      {isConfirmDelete && (
        <Modal
          title="Are you sure you want to delete?"
          visible={true}
          onOk={confirmDelete}
          onCancel={cancelDelete}
        >
          <p>Are you sure you want to delete this game?</p>
        </Modal>
      )}

      {editModalData && (
        <EditModal
        gameSingleMarketList={gameSingleMarketList}
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
