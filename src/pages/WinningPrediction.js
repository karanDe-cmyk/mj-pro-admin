import React, { useState, useEffect } from "react";
import { Input, Select, Table, Button, message,Modal } from "antd";
import instance from "../utils/axiosInstance"; // ✅ Import Axios instance
import dayjs from "dayjs"; // ✅ For date formatting

const { Option } = Select;
// ✅ Numbers Object
const numbers = {
  0: [
    "127",
    "136",
    "145",
    "190",
    "235",
    "280",
    "370",
    "389",
    "460",
    "479",
    "569",
    "578",
    "118",
    "226",
    "244",
    "299",
    "334",
    "488",
    "668",
    "677",
    "000",
    "550",
  ],
  1: [
    "137",
    "128",
    "146",
    "236",
    "245",
    "290",
    "380",
    "470",
    "489",
    "560",
    "678",
    "579",
    "119",
    "155",
    "227",
    "335",
    "344",
    "399",
    "588",
    "669",
    "777",
    "100",
  ],
  2: [
    "129",
    "138",
    "147",
    "156",
    "237",
    "246",
    "345",
    "390",
    "480",
    "570",
    "589",
    "679",
    "110",
    "228",
    "255",
    "336",
    "499",
    "660",
    "688",
    "778",
    "200",
    "444",
  ],
  3: [
    "120",
    "139",
    "148",
    "157",
    "238",
    "247",
    "256",
    "346",
    "490",
    "580",
    "670",
    "689",
    "166",
    "229",
    "337",
    "355",
    "445",
    "599",
    "779",
    "788",
    "300",
    "111",
  ],
  4: [
    "130",
    "149",
    "158",
    "167",
    "239",
    "248",
    "257",
    "347",
    "356",
    "590",
    "680",
    "789",
    "112",
    "220",
    "266",
    "338",
    "446",
    "455",
    "699",
    "770",
    "400",
    "888",
  ],
  5: [
    "140",
    "159",
    "168",
    "230",
    "249",
    "258",
    "267",
    "348",
    "357",
    "456",
    "690",
    "780",
    "113",
    "122",
    "177",
    "339",
    "366",
    "447",
    "799",
    "889",
    "500",
    "555",
  ],
  6: [
    "123",
    "150",
    "169",
    "178",
    "240",
    "259",
    "268",
    "349",
    "358",
    "367",
    "457",
    "790",
    "114",
    "277",
    "330",
    "448",
    "466",
    "556",
    "880",
    "899",
    "600",
    "222",
  ],
  7: [
    "124",
    "160",
    "179",
    "250",
    "269",
    "278",
    "340",
    "359",
    "368",
    "458",
    "467",
    "890",
    "115",
    "133",
    "188",
    "223",
    "377",
    "449",
    "557",
    "566",
    "700",
    "999",
  ],
  8: [
    "125",
    "134",
    "170",
    "189",
    "260",
    "279",
    "350",
    "369",
    "378",
    "459",
    "468",
    "567",
    "116",
    "224",
    "233",
    "288",
    "440",
    "477",
    "558",
    "990",
    "800",
    "666",
  ],
  9: [
    "126",
    "135",
    "180",
    "234",
    "270",
    "289",
    "360",
    "379",
    "450",
    "469",
    "478",
    "568",
    "117",
    "144",
    "199",
    "225",
    "388",
    "559",
    "577",
    "667",
    "900",
    "333",
  ],
};

// ✅ Flatten & Sort Numbers in Descending Order
const sortedNumbers = Object.values(numbers)
  .flat()
  .sort((a, b) => a - b);

const WinningPrediction = ({ initialData }) => {
  const today = dayjs().format("YYYY-MM-DD"); // ✅ Current date in date picker format

  const [formData, setFormData] = useState({
    date: initialData?.date || today,
    marketName: initialData?.marketName || "Main Market",
    gameName: initialData?.gameName || "",
    gameType: initialData?.gameType || "",
    number: initialData?.number || "",
  });

  const [gameNames, setGameNames] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); // ✅ Track if no data is found
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    newPoints: "",
    newbidvalue: "",
  });
  // ✅ Fetch game names from API using Axios
  useEffect(() => {
    const fetchGameNames = async () => {
      try {
        const response = await instance.get(
          "/api/marketManagement/getMarketGames"
        );

        const mainMarketGames = response.data
          .filter((game) => game.marketName === "Main Market")
          .map((game) => game.gameName);

        setGameNames(mainMarketGames);
      } catch (error) {
        console.error("Error fetching game names:", error);
        message.error("Failed to load game names.");
      }
    };

    fetchGameNames();
  }, []);

  // ✅ Fetch winning predictions only when submit button is clicked
  const fetchWinningPredictions = async () => {
    if (
      !formData.date ||
      !formData.gameName ||
      !formData.gameType ||
      !formData.number
    ) {
      message.error("Please fill all fields before submitting.");
      return;
    }

    const formattedDate = dayjs(formData.date).format("DD-MM-YYYY");

    const panna = formData.number;
    const digit = String(panna)
      .split("")
      .reduce((sum, num) => sum + parseInt(num), 0)
      .toString()
      .slice(-1);
    setWinners([]);
    setNoData(false);
    setLoading(true);

    try {
      const response = await instance.post("/api/showwinners/getWinningBids", {
        date: formattedDate,
        marketName: formData.marketName,
        gameName: formData.gameName,
        gameType: formData.gameType,
        panna,
        digit,
      });

      if (response.data.success) {
        setWinners(response.data.winners);
        message.success("Winning predictions fetched successfully!");
      } else {
        setWinners([]);
        message.warning("No matching results found.");
      }
    } catch (error) {
      console.error("Error fetching winning predictions:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE API Call
  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/showwinners/deleteBid/${id}`);
      setWinners(winners.filter((winner) => winner._id !== id));
      message.success("Bet deleted successfully!");
    } catch (error) {
      message.error("Failed to delete bet.");
    }
  };

  // ✅ EDIT API Call
  const handleEdit = async () => {
    try {
      await instance.put(`/api/showwinners/updateBid/${editData.id}`, {
        bidId: editData.bidId, // ✅ Sending bidId from GET API
        newPoints: editData.newPoints,
        newbidvalue: editData.newbidvalue,
      });
  
      // ✅ Update Table Data
      setWinners(
        winners.map((winner) =>
          winner._id === editData.id
            ? {
                ...winner,
                points: editData.newPoints,
                digit: editData.newbidvalue,
              }
            : winner
        )
      );
  
      message.success("Bet updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      message.error("Failed to update bet.");
    }
  };
  
  // ✅ Table Columns Configuration
  const columns = [
    { title: "#", key: "serial", render: (_, __, index) => index + 1 }, // ✅ Serial Number
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Bet Digit", dataIndex: "digit", key: "digit" },
    { title: "Bet Amount", dataIndex: "points", key: "points" },
    { title: "Game Name", dataIndex: "gameName", key: "gameName" },
    {
      title: "Winning Amount",
      dataIndex: "winningPoints",
      key: "winningPoints",
    },
    {
      title: "Edit Bet",
      key: "edit",
      render: (text, record) => (
        <Button
        onClick={() => {
          setEditData({
            id: record._id,
            bidId: record.bidId, // ✅ Get bidId from GET API response
            newPoints: record.points,
            newbidvalue: record.digit,
          });
          setEditModalVisible(true);
        }}
        
          style={{ backgroundColor: "#556EE6", color: "white", width: "100px" }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete Bet",
      key: "delete",
      render: (text, record) => (
        <Button
          onClick={() => handleDelete(record._id)}
          danger
          style={{ backgroundColor: "#F14646", color: "white", width: "100px" }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Filter Section */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px #ddd",
          width: "100%",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          Select Game
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            width: "100%",
          }}
        >
          <div>
            <label>Result Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label>Game Name</label>
            <select
              name="gameName"
              value={formData.gameName}
              onChange={(e) =>
                setFormData({ ...formData, gameName: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">Select Name</option>
              {gameNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Session</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={(e) =>
                setFormData({ ...formData, gameType: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="">-Select Session-</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
          <div style={{ width: "100%" }}>
            <label>Number</label>

            <Select
              value={formData.number}
              onChange={(value) => setFormData({ ...formData, number: value })}
              style={{ width: "100%", height: "40px", borderRadius: "4px" }}
              placeholder="Select Number"
              showSearch
            >
              {/* ✅ Heading inside the dropdown - non-selectable */}
              <Option value="" disabled style={{ color: "black" }}>
                Select Number
              </Option>

              {sortedNumbers.map((num, index) => (
                <Option key={index} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={fetchWinningPredictions}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "gray" : "#556EE6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "200px",
            }}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Winners Table */}
      <div style={{ width: "100%", marginTop: "20px" }}>
        <Table
          dataSource={winners}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }} // ✅ Pagination: 10 records per page
          locale={{ emptyText: noData ? "No Data Found!" : "No Data Found!" }}
        />
      </div>


      {/* Edit Modal */}
      <Modal
  title="Edit Bet"
  visible={editModalVisible}
  onCancel={() => setEditModalVisible(false)}
  onOk={handleEdit}
>
  <div style={{ marginBottom: "10px" }}>
    <label style={{ fontWeight: "bold" }}>New Points:</label>
    <Input
      placeholder="Enter New Points"
      value={editData.newPoints}
      onChange={(e) => setEditData({ ...editData, newPoints: e.target.value })}
      style={{ marginTop: "5px" }}
    />
  </div>

  <div>
    <label style={{ fontWeight: "bold" }}>New Bet Value:</label>
    <Input
      placeholder="Enter New Bet Value"
      value={editData.newbidvalue}
      onChange={(e) => setEditData({ ...editData, newbidvalue: e.target.value })}
      style={{ marginTop: "5px" }}
    />
  </div>
</Modal>


    </div>
  );
};

export default WinningPrediction;
