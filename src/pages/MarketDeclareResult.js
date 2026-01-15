import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form, Select, DatePicker, Input, message, Typography, Col, Row, Card, Divider, Pagination } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Tabs } from "antd";

const { Title } = Typography;

const MarketDeclareResult = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [marketGameList, setMarketGameList] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedMarketGame, setSelectedMarketGame] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeclareResult, setLoadingDeclareResult] = useState(false);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [winners, setWinners] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [gameResultDate, setGameResultDate] = useState(moment().format("DD-MM-YYYY"));
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [declaredDigit, setDeclaredDigit] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isGameModalVisible, setIsGameModalVisible] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [isGameTypeModalVisible, setIsGameTypeModalVisible] = useState(false);



  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const [currentSessionType, setCurrentSessionType] = useState(null);
  const [selectedPanna, setSelectedPanna] = useState(null);
  const [digitValue, setDigitValue] = useState(null);
  const allPannaNumbers = Object.values(pannaOptions).flat();

  const handlePannaChange = (value) => {
    if (!value) return;

    const sum = value.split("").reduce((acc, num) => acc + parseInt(num, 10), 0);
    const lastDigit = sum % 10;

    setSelectedPanna(value);
    setDigitValue(lastDigit.toString());
    form.setFieldsValue({ digit: lastDigit.toString() });
  };

  const { Search } = Input;

  const fetchMarketGameList = async () => {
    try {
      setLoading(true);

      const response = await instance.get(
        "/api/marketManagement/market_games"
      );

      if (Array.isArray(response?.data)) {
        // sirf gameName nikaalo
        const gameNames = response.data
          .map(item => item.gameName)
          .filter(Boolean);

        setGameOptions(gameNames);
      }
    } catch (error) {
      console.error("Error fetching game list:", error);
      message.error("Failed to fetch game names.");
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
      gameType: record.open ? "open" : "close"
    });
    setIsEditModalVisible(true);
  };

  const fetchDeclaredResults = async (date) => {
    if (!date) return;

    try {
      setLoading(true);
      const formattedDate = date.format("YYYY-MM-DD");

      const gameResponse = await instance.get(`/api/marketManagement/getMarketGames`);
      const mainMarketGames = gameResponse.data
        .filter((game) => game.marketName === "Main Market")
        .map((game) => game.gameName);

      let results = [];
      try {
        const resultResponse = await instance.get(`/api/mainmarketdeclareResult/getDeclareResult`);
        results = resultResponse?.data?.results || [];
      } catch (err) {
        console.error("No declared results found or API error:", err);
      }

      const resultMap = {};
      results.forEach((item) => {
        if (item.marketName === "Main Market" && item.date === formattedDate) {
          const key = `${item.gameName}_${dayjs(item.date).format("DD-MM-YYYY")}`;
          if (!resultMap[key]) {
            resultMap[key] = {
              gameName: item.gameName,
              date: dayjs(item.date).format("DD-MM-YYYY"),
              open: null,
              close: null,
            };
          }
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

      // Only show games that have been declared (have open or close results)
      const mergedResults = Object.values(resultMap).map((resultData, index) => ({
        sNo: index + 1,
        gameName: resultData.gameName,
        date: resultData.date,
        open: resultData.open || null,
        close: resultData.close || null,
      }));

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
      setWinners([]);
      fetchDeclaredResults(selectedDate);
    }
  }, [selectedDate, refresh]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = gameResults.filter((item) =>
      item.gameName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const onChangeDate = (date) => {
    setDate(date);
    handleDateChange(date.format("DD-MM-YYYY"));
  };

  const fetchWinners = async () => {
    const values = form.getFieldsValue();
    if (!values.marketGame || !values.gameName || !values.gameType || !values.panna) {
      message.error("Please select all required fields to show winners.");
      return;
    }
    try {
      setLoading(true);
      setCurrentSessionType(values.gameType);
      const response = await instance.post(`/api/showwinners/getShowWinnerBids`, {
        marketName: values.marketGame,
        gameName: values.gameName,
        date: values.resultDate
          ? values.resultDate.format("DD-MM-YYYY")
          : moment().format("DD-MM-YYYY"),
        gameType: values.gameType,
        digit: String(values.digit),
        panna: values.panna,
      });

      const openWinners = response.data.openSessionWins || [];
      const jodiWinners = response.data.jodiSessionWins || [];
      const jodiOpenWinners = jodiWinners.filter(j => j.open || j.opensession);
      const jodiCloseWinners = jodiWinners.filter(j => j.close || j.closesession);

      setWinners({
        openWinners: [...openWinners, ...jodiOpenWinners],
        closeWinners: response.data.closeSessionWins || [],
        jodiWinners: jodiWinners
      });

      setDeclaredDigit(response?.data?.declaredResult?.digit || null);
      setIsWinnerModalVisible(true);

    } catch (error) {
      console.error("Error fetching winners:", error);
      message.error("Failed to fetch winner data.");
      setWinners({
        openWinners: [],
        closeWinners: [],
        jodiWinners: []
      });
      setIsWinnerModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const declareWinner = async () => {
    const values = form.getFieldsValue();
    try {
      setLoadingDeclareResult(true);

      const normalizedGameName = values.gameName.trim();
      const declaredDateStr = values.resultDate
        ? values.resultDate.format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY");

      const declaredDateMoment = moment(declaredDateStr, "DD-MM-YYYY");

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

        // Refresh the results to show the newly declared game
        setSelectedDate(declaredDateMoment);
        fetchDeclaredResults(declaredDateMoment);

        try {
          const storedToken = localStorage.getItem("fcmToken");

          if (storedToken) {
            const notificationResponse = await instance.post('/api/notification', {
              token: storedToken,
              market: values.marketGame,
              gameType: values.gameType,
              gameName: normalizedGameName,
              result: values.gameType === "open"
                ? `${values.panna}-${values.digit}`
                : `${values.digit}-${values.panna}`,
              declaredAt: new Date().toISOString()
            });

            if (!notificationResponse.data.success) {
              console.warn("Notification API call failed");
            } else {
              toast.success(notificationResponse.data.message);
            }
          } else {
            console.warn("No 'fcmToken' found in local storage.");
          }

        } catch (notificationError) {
          toast.error("Failed to send notification");
          console.error("Notification error:", notificationError);
        }

      }

      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to declare winner.");
    } finally {
      setLoadingDeclareResult(false);
    }
  };

  const handleDeleteDeclaredResult = async (declaredId) => {
    if (!declaredId) {
      message.error("Invalid data. Please refresh and try again.");
      return;
    }

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

      let alertMessage = "";
      if (deletedRow) {
        alertMessage = `${deletedType} result for ${deletedRow.gameName} deleted successfully!`;
      } else {
        alertMessage = "Declared result deleted successfully!";
      }

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
        }).filter(result => result.open !== null || result.close !== null) // Remove if both are null
      );

      setFilteredResults((prevResults) =>
        prevResults.map((result) => {
          if (result.open?.id === declaredId) {
            return { ...result, open: null };
          } else if (result.close?.id === declaredId) {
            return { ...result, close: null };
          }
          return result;
        }).filter(result => result.open !== null || result.close !== null) // Remove if both are null
      );

      setRefresh((prev) => !prev);
    } catch (error) {
      message.error("Failed to delete declared result.");
    }
  };

  // const handleMarketChange = (selectedMarket) => {
  //   const filteredGames = allGames
  //     .filter((game) => game.marketName === selectedMarket)
  //     .map((game) => game.gameName);
  //   setGameOptions([...new Set(filteredGames)]);
  //   setSelectedMarketGame(selectedMarket);
  //   form.setFieldsValue({ gameName: undefined });
  // };

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

  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
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

  const calculateSummary = (data = []) => {
    return data.reduce(
      (acc, item) => {
        acc.totalUsers += 1;
        acc.totalBid += Number(item.points || 0);
        acc.totalWin += Number(item.winningPoints || 0);
        return acc;
      },
      {
        totalUsers: 0,
        totalBid: 0,
        totalWin: 0,
      }
    );
  };


  // Enhanced Game Result Columns - No Horizontal Scrolling
  const gameResultColumns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
      width: 50,
      align: 'center'
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      width: 120,
      render: (text) => (
        <div style={{
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '500'
        }}>
          {text}
        </div>
      )
    },
    {
      title: "Session",
      key: "session",
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Open Session */}
          <div style={{
            padding: '4px 8px',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            border: '1px solid #d0e8ff'
          }}>
            <div style={{
              fontSize: isMobile ? '10px' : '12px',
              fontWeight: 'bold',
              color: '#1890ff',
              marginBottom: '2px'
            }}>
              OPEN
            </div>
            <div style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '600',
              color: '#000'
            }}>
              {record.open ? record.open.value : "━━"}
            </div>
            {record.open && (
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleDeleteDeclaredResult(record.open?.id)}
                style={{
                  fontSize: '10px',
                  padding: '0',
                  height: 'auto',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </Button>
            )}
          </div>

          {/* Close Session */}
          <div style={{
            padding: '4px 8px',
            backgroundColor: '#fff0f0',
            borderRadius: '6px',
            border: '1px solid #ffd0d0'
          }}>
            <div style={{
              fontSize: isMobile ? '10px' : '12px',
              fontWeight: 'bold',
              color: '#ff4d4f',
              marginBottom: '2px'
            }}>
              CLOSE
            </div>
            <div style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '600',
              color: '#000'
            }}>
              {record.close ? record.close.value : "━━"}
            </div>
            {record.close && (
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleDeleteDeclaredResult(record.close?.id)}
                style={{
                  fontSize: '10px',
                  padding: '0',
                  height: 'auto',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  // Mobile optimized columns
  const mobileGameResultColumns = [
    {
      title: "#",
      dataIndex: "sNo",
      key: "sNo",
      width: 40,
      align: 'center'
    },
    {
      title: "Game",
      dataIndex: "gameName",
      key: "gameName",
      width: 80,
      render: (text) => (
        <div style={{ fontSize: '12px', fontWeight: '500' }}>{text}</div>
      )
    },
    {
      title: "Results",
      key: "results",
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Open */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1890ff' }}>OPEN</div>
            <div style={{ fontSize: '11px', fontWeight: '600' }}>
              {record.open ? record.open.value : "━━"}
            </div>
            {record.open && (
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleDeleteDeclaredResult(record.open?.id)}
                style={{ fontSize: '9px', padding: '0', height: 'auto' }}
              >
                Delete
              </Button>
            )}
          </div>
          {/* Close */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ff4d4f' }}>CLOSE</div>
            <div style={{ fontSize: '11px', fontWeight: '600' }}>
              {record.close ? record.close.value : "━━"}
            </div>
            {record.close && (
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleDeleteDeclaredResult(record.close?.id)}
                style={{ fontSize: '9px', padding: '0', height: 'auto' }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 md:p-4 bg-gray-100 min-h-screen">
      {/* Main Card - 2 Columns Layout */}
      <Card
        title={
          <Title level={isMobile ? 5 : 4} style={{ marginBottom: 0, fontSize: isMobile ? '16px' : '20px' }}>
            Select Market Game
          </Title>
        }
        bordered={false}
        style={{
          width: "100%",
          margin: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: isMobile ? "8px" : "16px",
          marginBottom: "16px"
        }}
        bodyStyle={{ padding: isMobile ? "8px" : "16px" }}
      >
        <Form form={form} layout="vertical">
          {/* Date Picker Section */}
          <div style={{ marginBottom: isMobile ? "12px" : "16px" }}>
            <Title level={isMobile ? 5 : 5} style={{ marginBottom: "8px", fontSize: isMobile ? '14px' : '16px' }}>
              Select Date
            </Title>
            <Form.Item
              name="resultDate"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
              initialValue={moment()}
            >
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: isMobile ? "100%" : "200px" }}
                allowClear={false}
                defaultPickerValue={dayjs()}
                placeholder="Select Date"
                size={isMobile ? "small" : "middle"}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />

          {/* Market & Game Selection - 2 Columns Layout */}
          <div>
            <Title level={isMobile ? 5 : 5} style={{ marginBottom: "12px", fontSize: isMobile ? '14px' : '16px' }}>
              Market & Game Selection
            </Title>

            {/* Hidden Market Field - Set to Main Market by default */}
            <Form.Item
              name="marketGame"
              hidden
              initialValue="Main Market"
            >
              <Input />
            </Form.Item>

            {/* First Row - Game Name only (full width) */}
            <Row gutter={isMobile ? 8 : 16} style={{ marginBottom: isMobile ? "12px" : "16px" }}>
              {/* Game Name - 100% width */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="gameName"
                  label={isMobile ? "Game" : "Game Name"}
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Select Game"
                    readOnly
                    onClick={() => setIsGameModalVisible(true)}
                    style={{ cursor: "pointer" }}
                    size={isMobile ? "small" : "middle"}
                  />
                </Form.Item>

              </Col>
            </Row>

            {/* Second Row - Type, Panna, Digit */}
            <Row gutter={isMobile ? 8 : 16}>
              {/* Game Type - 33% width */}
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="gameType"
                  label={isMobile ? "Type" : "Game Type"}
                  rules={[{ required: true, message: "Please select game type" }]}
                >
                  <Input
                    placeholder="Select Game Type"
                    readOnly
                    onClick={() => setIsGameTypeModalVisible(true)}
                    style={{ cursor: "pointer" }}
                    size={isMobile ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>

              {/* Panna - 33% width - Now accepts manual typing */}
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="panna"
                  label="Panna"
                  rules={[
                    { required: true, message: "Please enter panna" },
                    {
                      pattern: /^[0-9]{3}$/,
                      message: "Panna must be 3 digits"
                    }
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="Enter Panna"
                    maxLength={3}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length === 3 && /^[0-9]{3}$/.test(value)) {
                        handlePannaChange(value);
                      }
                    }}
                    style={{ width: "100%" }}
                    size={isMobile ? "small" : "middle"}
                  />
                </Form.Item>
              </Col>

              {/* Digit Output - 33% width */}
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Form.Item name="digit" label="Digit" style={{ marginBottom: 0 }}>
                  <Input
                    value={digitValue}
                    readOnly
                    size={isMobile ? "small" : "middle"}
                    style={{
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: isMobile ? "16px 0" : "20px 0" }} />

          {/* Buttons Section */}
          <Row gutter={isMobile ? 8 : 16} justify="center" style={{ width: "100%" }}>
            <Col xs={12} style={{ padding: isMobile ? "4px" : "8px" }}>
              <Button
                type="primary"
                onClick={fetchWinners}
                style={{
                  width: "100%",
                  backgroundColor: "#EEA529",
                  borderColor: "#EEA529",
                  height: isMobile ? "40px" : "45px",
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: "600"
                }}
                size={isMobile ? "small" : "middle"}
              >
                Show Winners
              </Button>
            </Col>

            <Col xs={12} style={{ padding: isMobile ? "4px" : "8px" }}>
              <Button
                type="primary"
                loading={loadingDeclareResult}
                onClick={declareWinner}
                style={{
                  width: "100%",
                  backgroundColor: "#556EE6",
                  borderColor: "#556EE6",
                  height: isMobile ? "40px" : "45px",
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: "600"
                }}
                size={isMobile ? "small" : "middle"}
              >
                Declare Result
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Winner Modal */}
      <Modal
        title="Winner List"
        open={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        width={isMobile ? "95%" : "80%"}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          top: isMobile ? "10px" : "50px"
        }}
        bodyStyle={{ padding: isMobile ? "8px" : "16px" }}
        footer={null}
      >
        {(winners.openWinners?.length > 0 || winners.closeWinners?.length > 0 || winners.jodiWinners?.length > 0) ? (
          <>
            {/* Open Winners */}
            {winners.openWinners?.length > 0 && (
              <div style={{ marginBottom: isMobile ? "16px" : "24px" }}>
                <Title level={5} style={{ fontSize: isMobile ? '14px' : '16px', marginBottom: '8px' }}>
                  Open Session Winners
                </Title>
                <div style={{ overflowX: 'auto' }}>
                  <Table
                    columns={[
                      { title: "User", dataIndex: "userName", key: "userName", width: 80 },
                      { title: "Game", dataIndex: "gameName", key: "gameName", width: 80 },
                      { title: "Type", dataIndex: "gameType", key: "gameType", width: 60 },
                      { title: "Digit", dataIndex: "digit", key: "digit", width: 60 },
                      { title: "Bid", dataIndex: "points", key: "points", width: 60 },
                      { title: "Win", dataIndex: "winningPoints", key: "winningPoints", width: 70 },
                      {
                        title: "Action",
                        key: "action",
                        width: 100,
                        render: (_, record) => (
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleDelete(record)}
                            loading={isDeleting}
                            style={{ padding: 0, fontSize: '12px' }}
                          >
                            Delete Bid
                          </Button>
                        ),
                      }
                    ]}
                    dataSource={winners.openWinners.filter(w => !["jodi", "jodiBulk", "digitBasedJodi", "groupJodi", "redBracket", "halfSangamA", "halfSangamB", "fullSangma"].includes(w.gameType))}
                    rowKey="_id"
                    size={isMobile ? "small" : "middle"}
                    scroll={isMobile ? { x: 500 } : {}}
                    pagination={false}
                  />
                </div>
              </div>
            )}

            {winners.closeWinners?.length > 0 && (
              <div style={{ marginBottom: isMobile ? "16px" : "24px" }}>
                <Title level={5} style={{ fontSize: isMobile ? '14px' : '16px', marginBottom: '8px' }}>
                  Close Session Winners
                </Title>
                <div style={{ overflowX: 'auto' }}>
                  <Table
                    columns={[
                      { title: "User", dataIndex: "userName", key: "userName", width: 80 },
                      { title: "Game", dataIndex: "gameName", key: "gameName", width: 80 },
                      { title: "Type", dataIndex: "gameType", key: "gameType", width: 60 },
                      { title: "Digit", dataIndex: "digit", key: "digit", width: 60 },
                      { title: "Bid", dataIndex: "points", key: "points", width: 60 },
                      { title: "Win", dataIndex: "winningPoints", key: "winningPoints", width: 70 },
                      {
                        title: "Action",
                        key: "action",
                        width: 100,
                        render: (_, record) => (
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleDelete(record)}
                            loading={isDeleting}
                            style={{ padding: 0, fontSize: '12px' }}
                          >
                            Delete Bid
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={winners.closeWinners}
                    rowKey="_id"
                    size={isMobile ? "small" : "middle"}
                    scroll={isMobile ? { x: 500 } : {}}
                    pagination={false}
                  />
                </div>
              </div>
            )}

            {winners.jodiWinners?.length > 0 && (
              <div>
                <Title level={5} style={{ fontSize: isMobile ? '14px' : '16px', marginBottom: '8px' }}>
                  Jodi Winners
                </Title>
                <div style={{ overflowX: 'auto' }}>
                  <Table
                    columns={[
                      { title: "User", dataIndex: "userName", key: "userName", width: 80 },
                      { title: "Game", dataIndex: "gameName", key: "gameName", width: 80 },
                      { title: "Type", dataIndex: "gameType", key: "gameType", width: 60 },
                      { title: "Digit", dataIndex: "digit", key: "digit", width: 60 },
                      { title: "Bid", dataIndex: "points", key: "points", width: 60 },
                      { title: "Win", dataIndex: "winningPoints", key: "winningPoints", width: 70 },
                      {
                        title: "Action",
                        key: "action",
                        width: 100,
                        render: (_, record) => (
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleDelete(record)}
                            loading={isDeleting}
                            style={{ padding: 0, fontSize: '12px' }}
                          >
                            Delete Bid
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={winners.jodiWinners}
                    rowKey="_id"
                    size={isMobile ? "small" : "middle"}
                    scroll={isMobile ? { x: 500 } : {}}
                    pagination={false}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", fontSize: isMobile ? "14px" : "16px", padding: "20px", color: "#ff4d4f" }}>
            {winners.closeWinners?.length == 0 ? "Open result not declared for that game." : "No Winners Found"}
          </p>
        )}

        {winners.openWinners?.length > 0 && (() => {
          const summary = calculateSummary(winners.openWinners);
          return (
            <Card
              size="small"
              style={{ marginTop: 8, background: "#f6ffed", border: "1px solid #b7eb8f" }}
            >
              <Row justify="space-between">
                <Col><b>Total Users:</b> {summary.totalUsers}</Col>
                <Col><b>Total Bid:</b> ₹{summary.totalBid}</Col>
                <Col><b>Total Winning:</b> ₹{summary.totalWin}</Col>
              </Row>
            </Card>
          );
        })()}

        {winners.closeWinners?.length > 0 && (() => {
          const summary = calculateSummary(winners.closeWinners);
          return (
            <Card
              size="small"
              style={{ marginTop: 8, background: "#fff7e6", border: "1px solid #ffd591" }}
            >
              <Row justify="space-between">
                <Col><b>Total Users:</b> {summary.totalUsers}</Col>
                <Col><b>Total Bid:</b> ₹{summary.totalBid}</Col>
                <Col><b>Total Winning:</b> ₹{summary.totalWin}</Col>
              </Row>
            </Card>
          );
        })()}

        {winners.jodiWinners?.length > 0 && (() => {
          const summary = calculateSummary(winners.jodiWinners);
          return (
            <Card
              size="small"
              style={{ marginTop: 8, background: "#e6f7ff", border: "1px solid #91d5ff" }}
            >
              <Row justify="space-between">
                <Col><b>Total Users:</b> {summary.totalUsers}</Col>
                <Col><b>Total Bid:</b> ₹{summary.totalBid}</Col>
                <Col><b>Total Winning:</b> ₹{summary.totalWin}</Col>
              </Row>
            </Card>
          );
        })()}

      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Bid"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleSaveEdit}
        confirmLoading={isSavingEdit}
        width={isMobile ? "90%" : "520px"}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Bid Amount"
            name="points"
            rules={[{ required: true, message: "Please enter bid amount" }]}
          >
            <Input type="number" size={isMobile ? "small" : "middle"} />
          </Form.Item>
          <Form.Item
            label="Bid Number"
            name="digit"
            rules={[{ required: true, message: "Please enter bid number" }]}
          >
            <Input type="number" size={isMobile ? "small" : "middle"} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Game Result History - Improved Design */}
      <Card
        title={
          <Title level={4} style={{ fontSize: isMobile ? '16px' : '18px', marginBottom: 0 }}>
            Game Result History
          </Title>
        }
        bordered={false}
        style={{
          width: "100%",
          margin: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: isMobile ? "12px" : "16px" }}
      >
        {/* Search Box & Date Picker */}
        <div style={{
          marginBottom: "16px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "8px" : "0",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="DD-MM-YYYY"
            style={{ width: isMobile ? "100%" : "160px" }}
            allowClear={false}
            defaultPickerValue={dayjs()}
            placeholder="Select Date"
            size={isMobile ? "small" : "middle"}
          />

          <Search
            placeholder="Search by Game Name"
            allowClear
            onSearch={handleSearch}
            style={{ width: isMobile ? "100%" : "300px" }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size={isMobile ? "small" : "middle"}
          />
        </div>

        {/* Table - No Horizontal Scrolling Needed */}
        <Table
          columns={isMobile ? mobileGameResultColumns : gameResultColumns}
          dataSource={filteredResults}
          pagination={false}
          rowClassName={(record, index) => (index % 2 === 0 ? "light-blue-row" : "white-row")}
          bordered
          size={isMobile ? "small" : "middle"}
          style={{
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
          }}
          scroll={isMobile ? { x: 240 } : { x: 400 }}
          locale={{
            emptyText: "No declared results found for this date"
          }}
        />

        <ToastContainer />
      </Card>
      <Modal
        title="Select Game"
        open={isGameModalVisible}
        onCancel={() => setIsGameModalVisible(false)}
        footer={null}
        width={isMobile ? "100%" : "600px"}
        centered
      >
        {/* Search */}
        <Input
          placeholder="Search game..."
          value={gameSearch}
          onChange={(e) => setGameSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {/* Game List */}
        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {gameOptions
            .filter(game =>
              game.toLowerCase().includes(gameSearch.toLowerCase())
            )
            .map((game, index) => (
              <div
                key={index}
                onClick={() => {
                  form.setFieldsValue({ gameName: game });
                  setSelectedGameName(game);
                  setIsGameModalVisible(false);
                  setGameSearch("");
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  fontWeight: 600,
                  fontSize: "35px"
                }}
              >
                {game}
              </div>
            ))}

          {gameOptions.length === 0 && (
            <p style={{ textAlign: "center", color: "#999" }}>
              No games found
            </p>
          )}
        </div>
      </Modal>
      <Modal
        title="Select Game Type"
        open={isGameTypeModalVisible}
        onCancel={() => setIsGameTypeModalVisible(false)}
        footer={null}
        width={isMobile ? "80%" : "500px"}
        centered
      >
        <div>
          {["open", "close"].map((type) => (
            <div
              key={type}
              onClick={() => {
                form.setFieldsValue({ gameType: type });
                setCurrentSessionType(type);
                setIsGameTypeModalVisible(false);
              }}
              style={{
                padding: "12px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                fontWeight: 500,
                textTransform: "capitalize"
              }}
            >
              {type}
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default MarketDeclareResult;