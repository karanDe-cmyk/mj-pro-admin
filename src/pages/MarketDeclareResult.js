import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, message, Typography, Col, Row, Card, Divider, Pagination } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const { Title } = Typography;

const MarketDeclareResult = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [marketGameList, setMarketGameList] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedMarketGame, setSelectedMarketGame] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState(null);
  // const [digitValue, setDigitValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDeclareResult, setLoadingDeclareResult] = useState(false);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [winners, setWinners] = useState([]);
  const [gameResults, setGameResults] = useState([]); // Merged declared result history
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today
  const [gameResultDate, setGameResultDate] = useState(moment().format("DD-MM-YYYY"));

  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [declaredDigit, setDeclaredDigit] = useState(null);
  // console.log("declaredDigit:", declaredDigit);

  const pannaOptions = {
    0: ["127", "136", "145", "190", "235", "280", "370", "389", "460", "479", "569", "578", "118", "226", "244", "299", "334", "488", "668", "677", "000", "550"],
    1: ["137", "128", "146", "236", "245", "290", "380", "470", "489", "560", "678", "579", "119", "155", "227", "335", "344", "399", "588", "669", "777", "100"],
    2: ["129", "138", "147", "156", "237", "246", "345", "390", "480", "570", "589", "679", "110", "228", "255", "336", "499", "660", "688", "778", "200", "444"],
    3: ["120", "139", "148", "157", "238", "247", "256", "346", "490", "580", "670", "689", "166", "229", "337", "355", "445", "599", "779", "788", "300", "111"],
    4: ["130", "149", "158", "167", "239", "248", "257", "347", "356", "590", "680", "789", "112", "220", "266", "338", "446", "455", "699", "770", "400", "888"],
    5: ["140", "159", "168", "230", "249", "258", "267", "348", "357", "456", "690", "780", "113", "122", "177", "339", "366", "447", "799", "889", "500", "555"],
    6: ["123", "150", "169", "178", "240", "259", "268", "349", "358", "367", "457", "790", "114", "277", "330", "448", "466", "556", "880", "899", "600", "222"],
    7: ["124", "160", "179", "250", "269", "278", "340", "359", "368", "458", "467", "890", "115", "133", "188", "223", "377", "449", "557", "566", "700", "999"],
    8: ["125", "134", "170", "189", "260", "279", "350", "369", "378", "459", "468", "567", "116", "224", "233", "288", "440", "477", "558", "990", "800", "666"],
    9: ["126", "135", "180", "234", "270", "289", "360", "379", "450", "469", "478", "568", "117", "144", "199", "225", "388", "559", "577", "667", "900", "333"],
  };


  const [selectedPanna, setSelectedPanna] = useState(null);
  const [digitValue, setDigitValue] = useState(null);
  const allPannaNumbers = Object.values(pannaOptions).flat();
  const handlePannaChange = (value) => {
    if (!value) return;

    // Calculate sum of digits
    const sum = value.split("").reduce((acc, num) => acc + parseInt(num, 10), 0);

    // Get last digit of the sum
    const lastDigit = sum % 10;

    // Update state and form values as a string
    setSelectedPanna(value);
    setDigitValue(lastDigit.toString());
    form.setFieldsValue({ digit: lastDigit.toString() });
  };


  const { Search } = Input;
  const fetchMarketGameList = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/marketManagement/getMarketGames`);
      if (response?.data) {
        const uniqueMarkets = [
          ...new Set(
            response.data
              .map((item) => item.marketName)
              .filter((name) => name && name.trim() !== "")
          ),
        ];
        setMarketGameList(uniqueMarkets);
        setAllGames(response.data);
      }
    } catch (error) {
      console.error("Error fetching market and game list:", error);
      message.error("Failed to fetch market & game names.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMarketGameList();
  }, []);

  const handleEdit = (record) => {
    setEditingWinner(record);
    editForm.setFieldsValue({
      points: record.points,
      digit: record.digit,
      gameType: record.open ? "open" : "close" // Convert boolean to string
    });
    setIsEditModalVisible(true);
  };
  const fetchDeclaredResults = async (date) => {
    if (!date) return;

    try {
      setLoading(true);
      // Format the date for API call: "YYYY-MM-DD"
      const formattedDate = date.format("YYYY-MM-DD");

      // 1) Fetch all possible games for "Main Market"
      const gameResponse = await instance.get(`/api/marketManagement/getMarketGames`);
      const mainMarketGames = gameResponse.data
        .filter((game) => game.marketName === "Main Market")
        .map((game) => game.gameName);

      // 2) Fetch declared results
      let results = [];
      try {
        const resultResponse = await instance.get(`/api/mainmarketdeclareResult/getDeclareResult`);
        results = resultResponse?.data?.results || [];
      } catch (err) {
        console.error("No declared results found or API error:", err);
      }

      // 3) Build a map with keys in the format: "gameName_DD-MM-YYYY"
      const resultMap = {};
      results.forEach((item) => {
        if (item.marketName === "Main Market" && item.date === formattedDate) {
          // Convert the API date to "DD-MM-YYYY" using dayjs
          const key = `${item.gameName}_${dayjs(item.date).format("DD-MM-YYYY")}`;
          if (!resultMap[key]) {
            resultMap[key] = {
              gameName: item.gameName,
              date: dayjs(item.date).format("DD-MM-YYYY"),
              open: null,
              close: null,
            };
          }
          // Store open/close based on gameType
          if (item.gameType === "open") {
            resultMap[key].open = {
              value: `${item.panna}-${item.digit}`,
              id: item._id,
            };
          }
          if (item.gameType === "close") {
            resultMap[key].close = {
              value: `${item.digit}-${item.panna}`,
              id: item._id,
            };
          }
        }
      });

      // 4) Merge the known game list with the resultMap
      const mergedResults = mainMarketGames.map((gameName, index) => {
        // Format the selected date as "DD-MM-YYYY" for display & key lookup
        const displayDate = date.format("DD-MM-YYYY");
        const exactKey = `${gameName}_${displayDate}`;
        const resultData = resultMap[exactKey] || {};
        return {
          sNo: index + 1,
          gameName,
          date: displayDate,
          open: resultData.open || null,
          close: resultData.close || null,
        };
      });

      setGameResults(mergedResults);
      setFilteredResults(mergedResults);
    } catch (error) {
      console.error("Error fetching declared results:", error);
      message.error("Failed to fetch declared results.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedDate) {
      setWinners([]); // ✅ Reset winners before fetching new results
      fetchDeclaredResults(selectedDate);
    }
  }, [selectedDate, refresh]); // ✅ Runs when `selectedDate` or `refresh` changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = gameResults.filter((item) =>
      item.gameName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  // Handle Date Change
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };


  const onChangeDate = (date) => {
    setDate(date);
    handleDateChange(date.format("DD-MM-YYYY")); // Send formatted date to parent component
  };
  const fetchWinners = async () => {
    const values = form.getFieldsValue();
    if (!values.marketGame || !values.gameName || !values.gameType || !values.panna) {
      message.error("Please select all required fields to show winners.");
      return;
    }
    try {
      setLoading(true);
      const response = await instance.post(`/api/showwinners/getWinningBids`, {
        marketName: values.marketGame,
        gameName: values.gameName,
        date: values.resultDate
          ? values.resultDate.format("DD-MM-YYYY")
          : moment().format("DD-MM-YYYY"),
        gameType: values.gameType,
        digit: String(values.digit), // converting here
        panna: values.panna,
      });

      // console.log(response.data);

      if (response?.data?.winners && Array.isArray(response.data.winners)) {
        setWinners(response.data.winners);
      } else {
        setWinners([]);
      }

      setDeclaredDigit(response?.data?.declaredResult?.digit || null);

      setIsWinnerModalVisible(true);
    } catch (error) {
      console.error("Error fetching winners:", error);
      message.error("Failed to fetch winner data.");
      setWinners([]);
      setIsWinnerModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // DECLARE WINNER
  // ---------------------------

  // const [tokenform, setTokenForm] = useState({
  //   token: "cfyIWN79TqSlNu6LvX2DO8:APA91bEIHDeCvIityVbhn7u_Ce9ZNQMiQC99wA5bCAbN0hHs95PZDUaOA5egBEVcPst0cue8rkchjvZK6mZDEoQSJYUB5c2avIsRn2MSNhlhDW3bexZKTD8", // Get this from your database
  //   title: "Hello",
  //   body: "karan this side",
  //   customData: JSON.stringify({ key: "value" }), // Optional
  // });

  // const sendNotification = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5001/api/notification/send-notification", {
  //       token: tokenform.token,
  //       title: tokenform.title,
  //       body: tokenform.body,
  //       data: JSON.parse(tokenform.customData),
  //     });
  //     alert("Notification sent!");
  //   } catch (error) {
  //     alert("Error: " + error.message);
  //   }
  // };

  // useEffect(() => {
  //   sendNotification();
  // }, [])

  const declareWinner = async () => {
    const values = form.getFieldsValue();
    try {
      setLoadingDeclareResult(true);

      // Normalize gameName
      const normalizedGameName = values.gameName.trim();

      // Format date
      const declaredDateStr = values.resultDate
        ? values.resultDate.format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY");

      const declaredDateMoment = moment(declaredDateStr, "DD-MM-YYYY");

      // API call to declare result
      const response = await instance.post(
        `/api/mainmarketdeclareResult/declareResult`,
        {
          marketName: values.marketGame,
          gameName: normalizedGameName,
          date: declaredDateStr,
          gameType: values.gameType,
          digit: values.digit,
          panna: values.panna,
          winners: winners.length > 0 ? winners : [],
        }
      );

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        message.success("Result declared successfully!");
        toast.success("Result declared successfully!");
        setIsWinnerModalVisible(false);

        // Create new result object
        const newResult = {
          sNo: gameResults.length + 1,
          gameName: normalizedGameName,
          date: declaredDateStr,
          open: values.gameType === "open" ? {
            value: `${values.panna}-${values.digit}`,
            id: response.data.resultId || new Date().getTime(),
          } : null,
          close: values.gameType === "close" ? {
            value: `${values.digit}-${values.panna}`,
            id: response.data.resultId || new Date().getTime(),
          } : null,
        };

        // Update local state
        setGameResults(prev => [...prev, newResult].map((item, i) => ({ ...item, sNo: i + 1 })));
        setFilteredResults(prev => [...prev, newResult].map((item, i) => ({ ...item, sNo: i + 1 })));

        setSelectedDate(declaredDateMoment);
        fetchDeclaredResults(declaredDateMoment);

        // Send push notification after successful declaration
        try {
          const notificationResponse = await axios.post('https://maya-api.kglame.com/api/notification', {
            token: "cfyIWN79TqSlNu6LvX2DO8:APA91bEIHDeCvIityVbhn7u_Ce9ZNQMiQC99wA5bCAbN0hHs95PZDUaOA5egBEVcPst0cue8rkchjvZK6mZDEoQSJYUB5c2avIsRn2MSNhlhDW3bexZKTD8",
            market: values.marketGame,
            gameType: values.gameType,
            gameName: normalizedGameName,
            result: values.gameType === "open"
              ? `${values.panna}-${values.digit}`
              : `${values.digit}-${values.panna}`,
            declaredAt: new Date().toISOString()
          });

          if (!notificationResponse.data.success) {
            console.warn("Notification sent but API reported failure");
          } else {
            toast.success(notificationResponse.data.message);
          }
        } catch (notificationError) {
          toast.error("Failed to send notification:", notificationError);
          // Don't show this error to user as the main operation succeeded
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to declare winner.");
    } finally {
      setLoadingDeclareResult(false);
    }
  };

  // console.log("winner:", winners);

  // ---------------------------
  // DELETE DECLARED RESULT BY ID
  // ---------------------------
  const handleDeleteDeclaredResult = async (declaredId) => {
    if (!declaredId) {
      message.error("Invalid data. Please refresh and try again.");
      return;
    }

    // Look up the result row and determine which result type (open/close) is being deleted
    let deletedRow = null;
    let deletedType = "";
    gameResults.forEach((result) => {
      if (result.open?.id === declaredId) {
        deletedRow = result;
        deletedType = "Open";
      } else if (result.close?.id === declaredId) {
        deletedRow = result;
        deletedType = "Close";
      }
    });

    try {
      await instance.delete(`/api/mainmarketdeclareResult/delete/${declaredId}`);

      // Build the alert message
      let alertMessage = "";
      if (deletedRow) {
        alertMessage = `${deletedType} result for ${deletedRow.gameName} deleted successfully!`;
      } else {
        alertMessage = "Declared result deleted successfully!";
      }

      // Show both an Ant Design message and a native browser alert
      message.success(alertMessage);
      alert(alertMessage);

      setGameResults((prevResults) =>
        prevResults.map((result) => {
          if (result.open?.id === declaredId) {
            return { ...result, open: null };
          } else if (result.close?.id === declaredId) {
            return { ...result, close: null };
          }
          return result;
        })
      );

      setFilteredResults((prevResults) =>
        prevResults.map((result) => {
          if (result.open?.id === declaredId) {
            return { ...result, open: null };
          } else if (result.close?.id === declaredId) {
            return { ...result, close: null };
          }
          return result;
        })
      );

      // Force a UI refresh if needed
      setRefresh((prev) => !prev);
    } catch (error) {
      message.error("Failed to delete declared result.");
    }
  };
  const handleMarketChange = (selectedMarket) => {
    const filteredGames = allGames
      .filter((game) => game.marketName === selectedMarket)
      .map((game) => game.gameName);
    setGameOptions([...new Set(filteredGames)]);
    setSelectedMarketGame(selectedMarket);
    form.setFieldsValue({ gameName: undefined });
  };

  const handleDelete = async (record) => {
    if (!record || !record._id) {
      message.error("Invalid bid data. Please refresh and try again.");
      return;
    }

    try {
      setIsDeleting(true);
      await instance.delete(`/api/bid/deleteBid/${record._id}`, {
        data: { bidId: record.bidId },
      });
      message.success("Bid deleted successfully!");

      const updatedWinners = winners.filter((winner) => winner._id !== record._id);
      setWinners(updatedWinners);

      // ✅ Close modal if no winners left
      if (updatedWinners.length === 0) {
        setIsWinnerModalVisible(false);
      }

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting bid:", error);
      message.error("Failed to delete bid.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------------------
  // UPDATE BID (For Winner List)
  // ---------------------------
  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
      // Get new values from the edit form
      const { points: newPoints, digit: newDigit } = editForm.getFieldsValue();
      await instance.put(`/api/bid/updateBid/${editingWinner._id}`, {
        bidId: editingWinner.bidId,
        newPoints,
        newbidvalue: newDigit,
      });
      message.success("Bid updated successfully!");
      setWinners((prev) =>
        prev.map((winner) =>
          winner._id === editingWinner._id ? { ...winner, points: newPoints, digit: newDigit } : winner
        )
      );
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating bid:", error);
      message.error("Failed to update bid.");
    } finally {
      setIsSavingEdit(false);
    }
  };
  const winnerColumns = [
    { title: "Member Name", dataIndex: "userName", key: "userName" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    { title: "Game Type", dataIndex: "gameType", key: "gameType" },
    { title: "Digit/Pana", dataIndex: "digit", key: "digit" },
    { title: "Bid Amount", dataIndex: "points", key: "points" },
    { title: "Winning Amount", dataIndex: "winningPoints", key: "winningPoints" },
  ];
  const gameResultColumns = [
    { title: "#", dataIndex: "sNo", key: "sNo", width: 50 },
    { title: "Game Name", dataIndex: "gameName", key: "gameName", width: 200 },

    // Open Pana Column
    {
      title: "Open Pana",
      key: "open",
      render: (_, record) => (record.open ? <span>{record.open.value}</span> : "━━"),
    },

    {
      title: "Action",
      key: "openAction",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDeleteDeclaredResult(record.open?.id || record.key)}
          style={{ fontWeight: "bold", color: "#1677ff" }} // Blue link style
        >
          Delete Result
        </Button>
      ),
    },


    {
      title: "Close Pana",
      key: "close",
      render: (_, record) => (record.close ? <span>{record.close.value}</span> : "━━"),
    },

    // Action Column for Close Pana
    {
      title: "Action",
      key: "closeAction",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDeleteDeclaredResult(record.close?.id || record.key)}
          style={{ fontWeight: "bold", color: "#1677ff" }} // Blue link style
        >
          Delete Result
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card scroll={{ x: 1000 }}
        title={<Title level={4} style={{ marginBottom: 0 }}>Select Market Game</Title>}
        bordered={false}
        style={{ maxWidth: "92%", margin: "auto", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "10px" }}
      >
        <Form form={form} layout="vertical">

          {/* Date Picker Section */}
          <div style={{ marginBottom: "12px" }}>
            <Title level={5} style={{ marginBottom: "4px" }}>Select Date</Title>
            <Form.Item
              name="resultDate"
              rules={[{ required: true }]}
              style={{ marginBottom: "8px" }}
              initialValue={moment()} // ✅ Set default date
            >
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: "150px" }}
                allowClear={false} // Prevent clearing the default date
                defaultPickerValue={dayjs()} // Ensures the calendar opens on the correct month and year
                placeholder="Select Date" // ✅ Display today's date in the box
              />
            </Form.Item>
          </div>


          <Divider style={{ margin: "10px 0" }} />

          {/* Market & Game Selection */}
          <div>
            <Title level={5} style={{ marginBottom: "4px" }}>Market & Game Selection</Title>
            <Row gutter={12} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
              {/* Market Name */}
              <Col xs={24} sm={12} md={6} lg={5} xl={4}>
                <Form.Item name="marketGame" label="Market Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select
                    onChange={handleMarketChange}
                    placeholder="Select Market"
                    loading={loading}
                    style={{ width: "100%" }}
                  >
                    {marketGameList.map((market, index) => (
                      <Select.Option key={index} value={market}>
                        {market}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Name */}
              <Col xs={24} sm={12} md={6} lg={5} xl={4}>
                <Form.Item name="gameName" label="Game Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select
                    onChange={(value) => setSelectedGameName(value)}
                    placeholder="Select Game"
                    disabled={!gameOptions.length}
                    style={{ width: "100%" }}
                  >
                    {gameOptions.map((game, index) => (
                      <Select.Option key={index} value={game}>
                        {game}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Game Type */}
              <Col xs={24} sm={12} md={6} lg={5} xl={4}>
                <Form.Item name="gameType" label="Game Type" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select placeholder="Select Type" style={{ width: "100%" }}>
                    <Select.Option value="open">Open</Select.Option>
                    <Select.Option value="close">Close</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Panna */}
              <Col xs={24} sm={12} md={6} lg={5} xl={4}>
                <Form.Item name="panna" label="Panna" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
                  <Select
                    onChange={handlePannaChange}
                    placeholder="Select Panna"
                    showSearch
                    filterOption={(input, option) => option.children.includes(input)}
                    style={{ width: "100%" }}
                  >
                    {allPannaNumbers.map((panna) => (
                      <Select.Option key={panna} value={panna}>
                        {panna}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Digit Output */}
              <Col xs={24} sm={12} md={6} lg={5} xl={4}>
                <Form.Item name="digit" label="Digit">
                  <Input value={digitValue} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </div>


          <Divider style={{ margin: "10px 0" }} />

          {/* Buttons Section */}
          <Row gutter={12} justify="center" style={{ width: "100%" }}>
            <Col span={12} style={{ padding: "10px" }}>
              <Button
                type="primary"
                onClick={fetchWinners}
                style={{
                  width: "100%",  // Ensures button takes full width of its column
                  backgroundColor: "#EEA529", // Custom background color
                  borderColor: "#EEA529", // Ensures border matches background
                  height: "50px", // Adjust height for better appearance
                  fontSize: "16px", // Improve readability
                }}
              >
                Show Winners
              </Button>
            </Col>

            <Col span={12} style={{ padding: "10px" }}>
              <Button
                type="primary"
                loading={loadingDeclareResult}
                onClick={declareWinner}
                style={{
                  width: "100%",
                  backgroundColor: "#556EE6",
                  borderColor: "#556EE6",
                  height: "50px",
                  fontSize: "16px",
                }}
              >
                Declare Result
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Modal
        title="Show Winner List"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        width="80%"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
        footer={null}
      >
        {winners.length > 0 ? (
          <Table

            columns={[
              { title: "User Name", dataIndex: "userName" },
              { title: "Game Name", dataIndex: "gameName" },
              {
                title: "Game Type", // or "Game Category"
                dataIndex: "gameType",
                render: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) || "N/A"
              },
              { title: "Date", dataIndex: "createdAt" },
              { title: "Digit/Pana", dataIndex: "digit" },
              {
                title: "Status",
                render: (_, record) => {
                  // if (record.open) {
                  //   return <span style={{ color: "green", fontWeight: "bold" }}>Running</span>;
                  // }
                  return record.close ? "Declared" : "Running";
                },
              }
              ,
              { title: "Bid Amount", dataIndex: "points" },
              {
                title: "Winning Amount",
                render: (_, record) => {
                  const renderPoints = () => (
                    <span style={{ color: "green", fontWeight: "bold" }}>{record.winningPoints}</span>
                  );

                  const renderNA = () => <span>{record.winningPoints || "N/A"}</span>;

                  const closingDigit = record.digit?.[1];

                  // ✅ Show winning points for jodi if conditions match
                  if (
                    record.gameType === "jodi" &&
                    record.close &&
                    closingDigit === declaredDigit?.toString()
                  ) {
                    return renderPoints();
                  }

                  // ✅ Show winning points for sangam games if closed
                  if (
                    ["fullSangam", "halfSangamA", "halfSangamB"].includes(record.gameType) &&
                    record.close
                  ) {
                    return renderPoints();
                  }

                  // ✅ Show winning points for all other games (like SingleDigits)
                  if (
                    !["jodi", "fullSangam", "halfSangamA", "halfSangamB"].includes(record.gameType)
                  ) {
                    return renderPoints(); // 🎯 This fixes your issue
                  }

                  // Show "Running" only for jodi or sangam if still open
                  if (
                    record.open &&
                    ["jodi", "fullSangam", "halfSangamA", "halfSangamB"].includes(record.gameType)
                  ) {
                    return <span style={{ color: "green", fontWeight: "bold" }}>Running</span>;
                  }

                  return renderNA();
                },
              },
              {
                title: "Action",
                render: (_, record) => (
                  <div>
                    <Button type="primary" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => handleDelete(record)}
                      loading={isDeleting}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            dataSource={winners}
            rowKey="_id"
          />
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              padding: "20px",
              color: "#ff4d4f",
            }}
          >
            No winners found.
          </p>
        )}
      </Modal>
      <Modal
        title="Edit Bid"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleSaveEdit}
        confirmLoading={isSavingEdit}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Bid Amount"
            name="points"
            rules={[{ required: true, message: "Please enter bid amount" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Bid Number"
            name="digit"
            rules={[{ required: true, message: "Please enter bid number" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ maxWidth: "92%" }} className="max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
        <h2 className="text-lg font-bold mb-4">Game Result History</h2>

        {/* Search Box & Date Picker */}
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Ant Design Date Picker */}
          {/* DatePicker for filtering the table */}
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="DD-MM-YYYY"
            style={{ width: 160 }}
            allowClear={false}
            defaultPickerValue={dayjs()}
            placeholder="Select Date"
          />

          {/* Search Box */}
          <Search
            placeholder="Search by Game Name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Table
          columns={gameResultColumns}
          dataSource={[...filteredResults]} // ✅ Merged Data
          scroll={{ x: 1000 }}
          pagination={false} // ✅ Removes pagination for a cleaner look
          rowClassName={(record, index) => (index % 2 === 0 ? "light-blue-row" : "white-row")} // ✅ Alternating row colors
          bordered // ✅ Adds table borders for a cleaner design
          style={{ border: "1px solid #ddd", borderRadius: "8px", marginTop: "10px" }} // ✅ Better spacing and design
        />

        <ToastContainer />

      </div>
    </div>
  );
};

export default MarketDeclareResult;
