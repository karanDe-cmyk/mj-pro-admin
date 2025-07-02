// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   DatePicker,
//   Select,
//   Button,
//   Table,
//   Typography,
//   Card,
//   message,
//   Modal,
// } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Title } = Typography;
// const { Option } = Select;

// const GaliDisawarBidRevert = () => {
//   const [form] = Form.useForm();
//   const [gameOptions, setGameOptions] = useState([]);
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchGameOptions();
//   }, []);

//   const fetchGameOptions = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const res = await axios.get(
//         "https://maya-api.kglame.com/api/GaliDisawar/getAllMarket",
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       setGameOptions(res.data.data || []);
//     } catch (err) {
//       message.error("Failed to load game list");
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);

//       const payload = {
//         date: dayjs(values.date).format("DD-MM-YYYY"),
//         gamename: values.gamename.split(" [")[0].trim(),
//         gametype: values.gametype.trim(),
//         market: "Gali Disawar",
//       };

//       const accessToken = localStorage.getItem("accessToken");
//       const res = await axios.post(
//         "https://maya-api.kglame.com/api/GaliDisawarbid/filterBids",
//         payload,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       // 👇 Filter out reverted bids (handle boolean & string cases)
//       const filtered = (res.data.bids || []).filter(
//         (bid) => String(bid.reverted).toLowerCase() !== "true"
//       );

//       setBids(filtered);
//     } catch (err) {
//       message.error("Error while filtering bids");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRevert = async (bidId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       await axios.put(
//         `https://maya-api.kglame.com/api/galiDisawarBid/revertBid/${bidId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       message.success("Bid reverted");
//       handleSearch();
//     } catch (err) {
//       message.error(err.response?.data?.message || "Failed to revert bid");
//     }
//   };

//   const handleRevertAll = () => {
//     Modal.confirm({
//       title: "Are you sure?",
//       content: "This will revert all bids listed below.",
//       okText: "Yes, Revert All",
//       onOk: async () => {
//         try {
//           const accessToken = localStorage.getItem("accessToken");
//           const revertPromises = bids.map((bid) =>
//             axios.put(
//               `https://maya-api.kglame.com/api/galiDisawarBid/revertBid/${bid.bidId}`,
//               {},
//               {
//                 headers: { Authorization: `Bearer ${accessToken}` },
//               }
//             )
//           );
//           await Promise.all(revertPromises);
//           message.success("All bids reverted");
//           handleSearch();
//         } catch (err) {
//           message.error("Error reverting all bids");
//         }
//       },
//     });
//   };

//   const columns = [
//     { title: "#", render: (_, __, i) => i + 1 },
//     { title: "User", dataIndex: "username" },
//     { title: "Email", dataIndex: "email" },
//     { title: "Left Digit", dataIndex: "leftdigit" },
//     { title: "Right Digit", dataIndex: "rightdigit" },
//     { title: "Pana", dataIndex: "jodi" },
//     { title: "Points", dataIndex: "points" },
//     { title: "Bid ID", dataIndex: "bidId" },
//     {
//       title: "Status",
//       render: (_, record) =>
//         record.reverted ? (
//           <span style={{ color: "red" }}>Reverted</span>
//         ) : (
//           <span style={{ color: "green" }}>Active</span>
//         ),
//     },
//     {
//       title: "Action",
//       render: (_, record) => (
//         <Button
//           type="dashed"
//           danger
//           disabled={record.reverted}
//           onClick={() => handleRevert(record.bidId)}
//         >
//           {record.reverted ? "Reverted" : "Revert"}
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Title level={3}>Gali Disawar Bid Revert Panel</Title>
//       <Card>
//         <Form form={form} layout="inline">
//           <Form.Item
//             label="Date"
//             name="date"
//             rules={[{ required: true, message: "Select date" }]}
//           >
//             <DatePicker format="DD-MM-YYYY" />
//           </Form.Item>

//           <Form.Item
//             label="Game Name"
//             name="gamename"
//             rules={[{ required: true, message: "Select game" }]}
//           >
//             <Select placeholder="Select game" style={{ width: 250 }} showSearch>
//               {gameOptions.map((g) => (
//                 <Option
//                   key={g._id}
//                   value={`${g.game_name} [ ${dayjs(
//                     g.open_time,
//                     "hh:mm:ssA"
//                   ).format("hh:mm A")} ]`}
//                 >
//                   {g.game_name} [{" "}
//                   {dayjs(g.open_time, "hh:mm:ssA").format("hh:mm A")} ]
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Game Type"
//             name="gametype"
//             rules={[{ required: true, message: "Select game type" }]}
//           >
//             <Select placeholder="Select type" style={{ width: 150 }}>
//               <Option value="left_digit">Left Digit</Option>
//               <Option value="right_digit">Right Digit</Option>
//               <Option value="jodi">Jodi</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" onClick={handleSearch}>
//               Search
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>

//       <Card style={{ marginTop: 20 }}>
//         <Button
//           type="primary"
//           danger
//           onClick={handleRevertAll}
//           disabled={bids.length === 0}
//           style={{ marginBottom: 10 }}
//         >
//           Revert All Bids
//         </Button>

//         <Table
//           dataSource={bids.map((b, i) => ({ ...b, key: i }))}
//           columns={columns}
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default GaliDisawarBidRevert;
import React, { useState, useEffect } from "react";
import {
  Form,
  DatePicker,
  Select,
  Button,
  Table,
  Typography,
  Card,
  message,
  Modal,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const GaliDisawarBidRevert = () => {
  const [form] = Form.useForm();
  const [gameOptions, setGameOptions] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGameOptions();
  }, []);

  const fetchGameOptions = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://maya-api.kglame.com/api/GaliDisawar/getAllMarket",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setGameOptions(res.data.data || []);
    } catch (err) {
      message.error("Failed to load game list");
    }
  };

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
  date: dayjs(values.date).format("DD-MM-YYYY"),
  gamename: values.gamename.split(" [")[0].trim(),
  gametype:
    values.gametype === "jodi"
      ? "jodi_digit"
      : values.gametype, // keep others same
  market: "Gali Disawar",
};

      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post(
        "https://maya-api.kglame.com/api/GaliDisawarbid/filterBids",
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const filtered = (res.data.bids || []).filter(
        (bid) => String(bid.reverted).toLowerCase() !== "true"
      );

      setBids(filtered);
    } catch (err) {
      message.error("Error while filtering bids");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (bidId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `https://maya-api.kglame.com/api/galiDisawarBid/revertBid/${bidId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      message.success("Bid reverted");
      handleSearch();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to revert bid");
    }
  };

  const handleRevertAll = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will revert all bids listed below.",
      okText: "Yes, Revert All",
      onOk: async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const revertPromises = bids.map((bid) =>
            axios.put(
              `https://maya-api.kglame.com/api/galiDisawarBid/revertBid/${bid.bidId}`,
              {},
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            )
          );
          await Promise.all(revertPromises);
          message.success("All bids reverted");
          handleSearch();
        } catch (err) {
          message.error("Error reverting all bids");
        }
      },
    });
  };

  const columns = [
    { title: "#", render: (_, __, i) => i + 1 },
    { title: "User", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Number",
      render: (_, record) => {
        if (record.gametype === "left_digit") return record.leftdigit;
        if (record.gametype === "right_digit") return record.rightdigit;
        if (record.gametype === "jodi" || record.gametype === "jodi_digit")
          return record.pana;
        return "-";
      },
    },
    { title: "Points", dataIndex: "points" },
    { title: "Bid ID", dataIndex: "bidId" },
    {
      title: "Status",
      render: (_, record) =>
        record.reverted ? (
          <span style={{ color: "red" }}>Reverted</span>
        ) : (
          <span style={{ color: "green" }}>Active</span>
        ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="dashed"
          danger
          disabled={record.reverted}
          onClick={() => handleRevert(record.bidId)}
        >
          {record.reverted ? "Reverted" : "Revert"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Gali Disawar Bid Revert Panel</Title>
      <Card>
        <Form form={form} layout="inline">
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label="Game Name"
            name="gamename"
            rules={[{ required: true, message: "Select game" }]}
          >
            <Select placeholder="Select game" style={{ width: 250 }} showSearch>
              {gameOptions.map((g) => (
                <Option
                  key={g._id}
                  value={`${g.game_name} [ ${dayjs(
                    g.open_time,
                    "hh:mm:ssA"
                  ).format("hh:mm A")} ]`}
                >
                  {g.game_name} [{" "}
                  {dayjs(g.open_time, "hh:mm:ssA").format("hh:mm A")} ]
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Game Type"
            name="gametype"
            rules={[{ required: true, message: "Select game type" }]}
          >
            <Select placeholder="Select type" style={{ width: 150 }}>
              <Option value="left_digit">Left Digit</Option>
              <Option value="right_digit">Right Digit</Option>
              <Option value="jodi">Jodi</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <Button
          type="primary"
          danger
          onClick={handleRevertAll}
          disabled={bids.length === 0}
          style={{ marginBottom: 10 }}
        >
          Revert All Bids
        </Button>

        <Table
          dataSource={bids.map((b, i) => ({ ...b, key: i }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default GaliDisawarBidRevert;
