// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Input,
//   DatePicker,
//   Button,
//   Form,
//   Row,
//   Col,
//   Select,
//   Pagination,
//   Card,
//   Modal
// } from 'antd';
// import moment from 'moment';
// import axiosInstance from "../../utils/axiosInstance";
// import dayjs from "dayjs";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const { Option } = Select;

// const GalidisawerDeclareResults = () => {
//   const [filters, setFilters] = useState({
//     // Set the current date by default in dayjs format (DD-MM-YYYY)
//     date: dayjs(),
//     game: '', // now holds game _id
//     open_time: '', // will be set based on selected game or chosen manually
//     pana: '',
//     leftDigit: '',
//     rightDigit: ''
//   });

//   // Main "Declare Results" table data
//   const [data, setData] = useState([]);

//   // Show Winners table data
//   const [winnersData, setWinnersData] = useState([]);

//   const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
//   const [searchText, setSearchText] = useState('');

//   // Game options fetched from API
//   const [gameOptions, setGameOptions] = useState([]);

//   // Pana options remains the same
//   const pannaOptions = Array.from({ length: 100 }, (_, i) =>
//     i.toString().padStart(2, '0')
//   );

//   // State for edit modal
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [editForm] = Form.useForm();

//   // When a game is selected, update the open time dropdown options accordingly.
//   const getOpenTimeOptions = () => {
//     if (filters.game) {
//       // Filter gameOptions to the one matching the selected game _id
//       const selectedGame = gameOptions.find(option => option._id === filters.game);
//       if (selectedGame) {
//         return [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")];
//       }
//       return [];
//     } else {
//       // When no game is selected, return all unique open times from gameOptions.
//       return Array.from(
//         new Set(
//           gameOptions.map(option =>
//             moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
//           )
//         )
//       );
//     }
//   };

//   // Fetch declare results from API
//   const fetchDeclareResults = async () => {
//     try {
//       const response = await axiosInstance.get('/api/GaliDisawarDeclareResult/getResult');
//       setData(response.data.results);
//     } catch (error) {
//       console.error("Error fetching declare results:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDeclareResults();
//   }, []);

//   // Delete handler: calls DELETE API and refreshes data.
//   const handleDeleteDeclareResult = async (record) => {
//     if (window.confirm("Are you sure you want to delete this declare result?")) {
//       try {
//         await axiosInstance.delete(`/api/GaliDisawarDeclareResult/delete/${record._id}`);
//         toast.success("Declare result deleted successfully. The winning amount has been deducted from the user's wallet.");
//         fetchDeclareResults();
//       } catch (error) {
//         console.error("Error deleting declare result:", error);
//         alert("Error deleting declare result");
//       }
//     }
//   };

//   // Fetch game options from API when component mounts
//   useEffect(() => {
//     axiosInstance.get('/api/GaliDisawar/getAllMarket')
//       .then(response => {
//         // Assuming the response has a structure: { message, success, data: [...] }
//         if (response.data && Array.isArray(response.data.data)) {
//           setGameOptions(response.data.data);
//         } else {
//           setGameOptions([]);
//         }
//       })
//       .catch(error => {
//         console.error("Error fetching game options:", error);
//       });
//   }, []);

//   // Handle filter changes
//   const handleFilterChange = (value, key) => {
//     // When game selection changes, clear any previously selected open_time.
//     if (key === 'game') {
//       setFilters(prev => ({ ...prev, [key]: value, open_time: '' }));
//     } else {
//       setFilters(prev => ({ ...prev, [key]: value }));
//     }
//   };

//   const handlePannaChange = (value) => {
//     // Automatically split the Panna value into Left and Right Digits
//     setFilters(prev => ({
//       ...prev,
//       pana: value,
//       leftDigit: value[0] || '',
//       rightDigit: value[1] || ''
//     }));
//   };

//   // Show Winners API call
//   const handleShowWinnersClick = async () => {
//     try {
//       // If a game is selected, build the game value string from the selected game option.
//       const selectedGame = gameOptions.find(option => option._id === filters.game);
//       const gameValue = selectedGame
//         ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
//         : '';
//       const reqBody = {
//         date: filters.date.format("DD-MM-YYYY"),
//         game: gameValue,
//         open_time: filters.open_time,
//         pana: filters.pana,
//         leftDigit: filters.leftDigit,
//         rightDigit: filters.rightDigit
//       };
//       const response = await axiosInstance.post(
//         "/api/GaliDisawarWinners/showwinners",
//         reqBody
//       );
//       setWinnersData(response.data.winners);
//     } catch (error) {
//       console.error("Error calling show winners API:", error);
//     }
//   };

//   // Declare Result button handler
//   const handleDeclareResultClick = async () => {
//     try {
//       const selectedGame = gameOptions.find(option => option._id === filters.game);
//       const gameValue = selectedGame
//         ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
//         : '';
//       const reqBody = {
//         marketName: "Gali Disawar",
//         date: filters.date.format("DD-MM-YYYY"),
//         game: gameValue,
//         open_time: filters.open_time,
//         pana: filters.pana,
//         leftDigit: filters.leftDigit,
//         rightDigit: filters.rightDigit
//       };
//       await axiosInstance.post(
//         "/api/GaliDisawarDeclareResult/declare",
//         reqBody
//       );
//       toast.success("Result Declared successfully!");
//       setTimeout(() => {
//         fetchDeclareResults();
//       }, 100);
//     } catch (error) {
//       console.error("Error calling declare result API:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         alert(error.response.data.error);
//         setTimeout(() => {
//           fetchDeclareResults();
//         }, 100);
//       } else {
//         alert("Error declaring result. Please try again.");
//       }
//     }
//   };

//   // Edit handler: Open modal and set editing record.
//   const handleEdit = (record) => {
//     setEditingRecord(record);
//     const computedBidNum =
//       record.pana && record.pana !== "false"
//         ? record.pana
//         : record.leftDigit && record.leftDigit !== "false"
//         ? record.leftDigit
//         : record.rightDigit && record.rightDigit !== "false"
//         ? record.rightDigit
//         : "";
//     editForm.setFieldsValue({
//       bidPoints: record.bidPoints,
//       bidNumber: computedBidNum
//     });
//     setIsEditModalVisible(true);
//   };

//   // Delete bid handler.
//   const handleDelete = async (record) => {
//     if (window.confirm("Are you sure you want to delete this bid?")) {
//       try {
//         await axiosInstance.delete(`/api/GaliDisawarWinners/deletewinner/${record._id}`);
//         handleShowWinnersClick();
//       } catch (error) {
//         console.error("Error deleting bid:", error);
//       }
//     }
//   };

//   // Handle edit modal form submission.
//   const handleEditFinish = async (values) => {
//     try {
//       let updatePayload = { points: Number(values.bidPoints) };
//       if (editingRecord.bidType === "pana") {
//         updatePayload.pana = values.bidNumber;
//       } else if (editingRecord.bidType === "leftDigit") {
//         updatePayload.leftdigit = values.bidNumber;
//       } else if (editingRecord.bidType === "rightDigit") {
//         updatePayload.rightdigit = values.bidNumber;
//       }
//       await axiosInstance.put(
//         `/api/GaliDisawarWinners/updatewinner/${editingRecord._id}`,
//         updatePayload
//       );
//       setIsEditModalVisible(false);
//       setEditingRecord(null);
//       handleShowWinnersClick();
//     } catch (error) {
//       console.error("Error updating bid:", error);
//     }
//   };

//   // Table columns for Declare Results
//   const columns = [
//     {
//       title: '#',
//       key: 'serial',
//       render: (text, record, index) => index + 1
//     },
//     {
//       title: 'Game Name',
//       dataIndex: 'gameName',
//       key: 'gameName'
//     },
//     {
//       title: 'Result Date',
//       dataIndex: 'date',
//       key: 'date',
//       render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
//     },
//     {
//       title: 'Open Pana',
//       dataIndex: 'jodiDigit',
//       key: 'jodiDigit'
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button 
//           type="primary" 
//           style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', marginRight: '8px' }}
//           onClick={() => handleDeleteDeclareResult(record)}
//         >
//           Delete
//         </Button>
//       )
//     }
//   ];

//   // Table columns for Winners
//   const winnersColumns = [
//     {
//       title: 'User Name',
//       dataIndex: 'userName',
//       key: 'userName'
//     },
//     {
//       title: 'Bid Points',
//       dataIndex: 'bidPoints',
//       key: 'bidPoints'
//     },
//     {
//       title: 'Winning Points',
//       dataIndex: 'winningPoints',
//       key: 'winningPoints'
//     },
//     {
//       title: 'Bid Type',
//       dataIndex: 'bidType',
//       key: 'bidType'
//     },
//     {
//       title: 'Market Name',
//       dataIndex: 'marketName',
//       key: 'marketName'
//     },
//     {
//       title: 'Game Name',
//       dataIndex: 'gameName',
//       key: 'gameName'
//     },
//     {
//       title: 'Bid Number',
//       key: 'bidNumber',
//       render: (_, record) => {
//         let bidNum = "";
//         if (record.pana && record.pana !== "false") {
//           bidNum = record.pana;
//         } else if (record.leftDigit && record.leftDigit !== "false") {
//           bidNum = record.leftDigit;
//         } else if (record.rightDigit && record.rightDigit !== "false") {
//           bidNum = record.rightDigit;
//         }
//         return bidNum;
//       }
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//       render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '')
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <span>
//           <Button
//             style={{ backgroundColor: '#1890ff', color: 'white', marginRight: '8px' }}
//             onClick={() => handleEdit(record)}
//           >
//             Edit
//           </Button>
//           <Button
//             style={{ backgroundColor: '#ff4d4f', color: 'white' }}
//             onClick={() => handleDelete(record)}
//           >
//             Delete
//           </Button>
//         </span>
//       )
//     }
//   ];

//   return (
//     <div style={{ padding: '20px', width: '100%' }}>
//       <h1
//         style={{
//           textAlign: 'center',
//           marginBottom: '20px',
//           backgroundColor: '#f0f2f5',
//           padding: '10px'
//         }}
//       >
//         Galidisawer Declare Results
//       </h1>

//       {/* Filter Section */}
//       <Card style={{ marginBottom: '20px' }}>
//         <Form layout="vertical">
//           <Row gutter={[16, 16]}>
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="Date">
//                 <DatePicker
//                   value={filters.date}
//                   onChange={(date) => handleFilterChange(date, 'date')}
//                   format="DD-MM-YYYY"
//                   style={{ width: '100%' }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="Game">
//                 <Select
//                   showSearch
//                   value={filters.game}
//                   placeholder="Select Game"
//                   onChange={(value) => handleFilterChange(value, 'game')}
//                   filterOption={(input, option) =>
//                     option.children
//                       .toLowerCase()
//                       .indexOf(input.toLowerCase()) >= 0
//                   }
//                   style={{ width: '100%' }}
//                 >
//                   {gameOptions.map((option) => {
//                     const formattedTime = moment(option.open_time, "hh:mm:ssA").format("hh:mm A");
//                     return (
//                       <Option key={option._id} value={option._id}>
//                         {`${option.game_name} ${formattedTime}`}
//                       </Option>
//                     );
//                   })}
//                 </Select>
//               </Form.Item>
//             </Col>
//             {/* New Open Time Dropdown */}
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="Open Time">
//                 <Select
//                   showSearch
//                   value={filters.open_time}
//                   placeholder="Select Open Time"
//                   onChange={(value) => handleFilterChange(value, 'open_time')}
//                   filterOption={(input, option) =>
//                     option.children
//                       .toLowerCase()
//                       .indexOf(input.toLowerCase()) >= 0
//                   }
//                   style={{ width: '100%' }}
//                 >
//                   {getOpenTimeOptions().map((timeOption) => (
//                     <Option key={timeOption} value={timeOption}>
//                       {timeOption}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="digit">
//                 <Select
//                   showSearch
//                   value={filters.pana}
//                   placeholder="Select Pana"
//                   onChange={handlePannaChange}
//                   filterOption={(input, option) =>
//                     option.children
//                       .toLowerCase()
//                       .indexOf(input.toLowerCase()) >= 0
//                   }
//                   style={{ width: '100%' }}
//                 >
//                   {pannaOptions.map((panna) => (
//                     <Option key={panna} value={panna}>
//                       {panna}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="Left Digit">
//                 <Input value={filters.leftDigit} disabled style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={12} md={4}>
//               <Form.Item label="Right Digit">
//                 <Input value={filters.rightDigit} disabled style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Card>

//       {/* Buttons Section */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           marginBottom: '20px',
//           gap: '10px'
//         }}
//       >
//         <Button type="default" onClick={handleShowWinnersClick}>
//           Show Winners
//         </Button>
//         <Button type="primary" onClick={handleDeclareResultClick}>
//           Declare Result
//         </Button>
//       </div>

//       {/* Winners Table */}
//       <Card style={{ marginBottom: '20px' }}>
//         <h2
//           style={{
//             textAlign: 'center',
//             marginBottom: '20px',
//             backgroundColor: '#f0f2f5',
//             padding: '10px'
//           }}
//         >
//           Winners List
//         </h2>
//         <Table
//           columns={winnersColumns}
//           dataSource={winnersData}
//           rowKey="_id"
//           pagination={false}
//           locale={{ emptyText: 'No winners available' }}
//           scroll={{ x: '100%' }}
//         />
//       </Card>

//       {/* Pagination and Search for Declare Results Table */}
//       <Card>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '10px'
//           }}
//         >
//           <div>
//             <span>Show </span>
//             <Select
//               defaultValue={pagination.pageSize}
//               style={{ width: 70 }}
//               onChange={(value) =>
//                 setPagination(prev => ({ ...prev, pageSize: value }))
//               }
//             >
//               <Option value={5}>5</Option>
//               <Option value={10}>10</Option>
//               <Option value={20}>20</Option>
//             </Select>
//             <span> entries</span>
//           </div>
//           <Form.Item label="Search" style={{ marginBottom: 0 }}>
//             <Input
//               placeholder="Search by User Name or TXID"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               style={{ width: 250 }}
//             />
//           </Form.Item>
//         </div>
//         <Table
//           columns={columns}
//           dataSource={data}
//           rowKey="_id"
//           pagination={false}
//           locale={{ emptyText: 'No data available in table' }}
//           scroll={{ x: '100%' }}
//         />
//         <div style={{ marginTop: '16px', textAlign: 'right' }}>
//           <Pagination
//             current={pagination.current}
//             pageSize={pagination.pageSize}
//             total={data.length}
//             onChange={(page) =>
//               setPagination(prev => ({ ...prev, current: page }))
//             }
//           />
//         </div>
//       </Card>

//       {/* Edit Modal */}
//       <Modal
//         title="Edit Bid"
//         visible={isEditModalVisible}
//         onCancel={() => {
//           setIsEditModalVisible(false);
//           setEditingRecord(null);
//         }}
//         footer={null}
//       >
//         <Form form={editForm} layout="vertical" onFinish={handleEditFinish}>
//           <Form.Item
//             label="Bid Points"
//             name="bidPoints"
//             rules={[{ required: true, message: "Please enter bid points" }]}
//           >
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item
//             label="Bid Number"
//             name="bidNumber"
//             rules={[{ required: true, message: "Please enter bid number" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Update Bid
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default GalidisawerDeclareResults;
// import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Button,
  Form,
  Row,
  Col,
  Select,
  Pagination,
  Card,
  Modal
} from 'antd';
import moment from 'moment';
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const GalidisawerDeclareResults = () => {
  const [filters, setFilters] = useState({
    date: dayjs(),
    game: '',
    open_time: '',
    pana: '',
    leftDigit: '',
    rightDigit: ''
  });

  const [data, setData] = useState([]);
  const [winnersData, setWinnersData] = useState([]);
  // const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');
  const [gameOptions, setGameOptions] = useState([]);

  // State to hold all declared results, keyed by gameName for easy lookup
  const [declaredResultsMap, setDeclaredResultsMap] = useState({});

  const pannaOptions = Array.from({ length: 100 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();

  const getOpenTimeOptions = () => {
    if (filters.game) {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      if (selectedGame) {
        return [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")];
      }
      return [];
    } else {
      return Array.from(
        new Set(
          gameOptions.map(option =>
            moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
          )
        )
      );
    }
  };

  const fetchDeclareResults = async () => {
    try {
      const response = await axiosInstance.get('/api/GaliDisawarDeclareResult/getResult');
      setData(response.data.results);

      // Create a map for quick lookup
      const resultsMap = {};
      response.data.results.forEach(result => {
        resultsMap[result.gameName] = result;
      });
      setDeclaredResultsMap(resultsMap);

    } catch (error) {
      console.error("Error fetching declare results:", error);
    }
  };

  useEffect(() => {
    fetchDeclareResults();
  }, []);

  const handleDeleteDeclareResult = async (record) => {
    if (window.confirm("Are you sure you want to delete this declare result?")) {
      try {
        await axiosInstance.delete(`/api/GaliDisawarDeclareResult/delete/${record._id}`);
        toast.success("Declare result deleted successfully. The winning amount has been deducted from the user's wallet.");
        fetchDeclareResults();
      } catch (error) {
        console.error("Error deleting declare result:", error);
        alert("Error deleting declare result");
      }
    }
  };

  useEffect(() => {
    axiosInstance.get('/api/GaliDisawar/getAllMarket')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setGameOptions(response.data.data);
        } else {
          setGameOptions([]);
        }
      })
      .catch(error => {
        console.error("Error fetching game options:", error);
      });
  }, []);

  const handleFilterChange = (value, key) => {
    if (key === 'game') {
      setFilters(prev => ({ ...prev, [key]: value, open_time: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handlePannaChange = (value) => {
    setFilters(prev => ({
      ...prev,
      pana: value,
      leftDigit: value[0] || '',
      rightDigit: value[1] || ''
    }));
  };

  const handleShowWinnersClick = async () => {
    try {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';
      const reqBody = {
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        pana: filters.pana,
        leftDigit: filters.leftDigit,
        rightDigit: filters.rightDigit
      };
      const response = await axiosInstance.post(
        "/api/GaliDisawarWinners/showwinners",
        reqBody
      );
      setWinnersData(response.data.winners);
    } catch (error) {
      console.error("Error calling show winners API:", error);
    }
  };

  const handleDeclareResultClick = async () => {
    try {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';
      const reqBody = {
        marketName: "Gali Disawar",
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        pana: filters.pana,
        leftDigit: filters.leftDigit,
        rightDigit: filters.rightDigit
      };
      await axiosInstance.post(
        "/api/GaliDisawarDeclareResult/declare",
        reqBody
      );
      toast.success("Result Declared successfully!");
      setTimeout(() => {
        fetchDeclareResults();
      }, 100);
    } catch (error) {
      console.error("Error calling declare result API:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
        setTimeout(() => {
          fetchDeclareResults();
        }, 100);
      } else {
        alert("Error declaring result. Please try again.");
      }
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    const computedBidNum =
      record.pana && record.pana !== "false"
        ? record.pana
        : record.leftDigit && record.leftDigit !== "false"
          ? record.leftDigit
          : record.rightDigit && record.rightDigit !== "false"
            ? record.rightDigit
            : "";
    editForm.setFieldsValue({
      bidPoints: record.bidPoints,
      bidNumber: computedBidNum
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      try {
        await axiosInstance.delete(`/api/GaliDisawarWinners/deletewinner/${record._id}`);
        handleShowWinnersClick();
      } catch (error) {
        console.error("Error deleting bid:", error);
      }
    }
  };

  const handleEditFinish = async (values) => {
    try {
      let updatePayload = { points: Number(values.bidPoints) };
      if (editingRecord.bidType === "pana") {
        updatePayload.pana = values.bidNumber;
      } else if (editingRecord.bidType === "leftDigit") {
        updatePayload.leftdigit = values.bidNumber;
      } else if (editingRecord.bidType === "rightDigit") {
        updatePayload.rightdigit = values.bidNumber;
      }
      await axiosInstance.put(
        `/api/GaliDisawarWinners/updatewinner/${editingRecord._id}`,
        updatePayload
      );
      setIsEditModalVisible(false);
      setEditingRecord(null);
      handleShowWinnersClick();
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };

  // Create a combined data source for the main table
  const combinedData = gameOptions.map(game => {
    const gameResult = declaredResultsMap[game.game_name.trim().toUpperCase()];
    const today = dayjs().format('YYYY-MM-DD');

    return {
      key: game._id,
      gameName: game.game_name,
      openTime: moment(game.open_time, "hh:mm:ssA").format("hh:mm A"),
      // If a result exists for the same game and today's date, show the open pana. Otherwise, show '-'.
      jodiDigit: gameResult && moment(gameResult.date).format('YYYY-MM-DD') === today ? gameResult.jodiDigit : '-',
      _id: gameResult ? gameResult._id : null, // Add the _id for the delete action
      date: gameResult && moment(gameResult.date).format('YYYY-MM-DD') === today ? gameResult.date : null
    };
  });

  const columns = [
    {
      title: '#',
      key: 'serial',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName',
      render: (text, record) => `${text.trim()} ${record.openTime}`
    },
    {
      title: 'Result Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Winning Digit',
      dataIndex: 'jodiDigit',
      key: 'jodiDigit'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record._id ? (
          <Button
            type="primary"
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', marginRight: '8px' }}
            onClick={() => handleDeleteDeclareResult(record)}
          >
            Delete
          </Button>
        ) : (
          <Button type="default" disabled>No Result</Button>
        )
      )
    }
  ];

  const winnersColumns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Bid Points',
      dataIndex: 'bidPoints',
      key: 'bidPoints'
    },
    {
      title: 'Winning Points',
      dataIndex: 'winningPoints',
      key: 'winningPoints'
    },
    {
      title: 'Bid Type',
      dataIndex: 'bidType',
      key: 'bidType'
    },
    {
      title: 'Market Name',
      dataIndex: 'marketName',
      key: 'marketName'
    },
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName'
    },
    {
      title: 'Bid Number',
      key: 'bidNumber',
      render: (_, record) => {
        let bidNum = "";
        if (record.pana && record.pana !== "false") {
          bidNum = record.pana;
        } else if (record.leftDigit && record.leftDigit !== "false") {
          bidNum = record.leftDigit;
        } else if (record.rightDigit && record.rightDigit !== "false") {
          bidNum = record.rightDigit;
        }
        return bidNum;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button
            style={{ backgroundColor: '#1890ff', color: 'white', marginRight: '8px' }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            style={{ backgroundColor: '#ff4d4f', color: 'white' }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </span>
      )
    }
  ];

  const filteredData = combinedData.filter(item =>
    item.gameName.toLowerCase().includes(searchText.toLowerCase())
  );

  // const paginatedData = filteredData.slice(
  //   (pagination.current - 1) * pagination.pageSize,
  //   pagination.current * pagination.pageSize
  // );

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          backgroundColor: '#f0f2f5',
          padding: '10px'
        }}
      >
        Galidisawer Declare Results
      </h1>

      <Card style={{ marginBottom: '20px' }}>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Date">
                <DatePicker
                  value={filters.date}
                  onChange={(date) => handleFilterChange(date, 'date')}
                  format="DD-MM-YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Game">
                <Select
                  showSearch
                  value={filters.game}
                  placeholder="Select Game"
                  onChange={(value) => handleFilterChange(value, 'game')}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {gameOptions.map((option) => {
                    const formattedTime = moment(option.open_time, "hh:mm:ssA").format("hh:mm A");
                    return (
                      <Option key={option._id} value={option._id}>
                        {`${option.game_name} ${formattedTime}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Open Time">
                <Select
                  showSearch
                  value={filters.open_time}
                  placeholder="Select Open Time"
                  onChange={(value) => handleFilterChange(value, 'open_time')}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {getOpenTimeOptions().map((timeOption) => (
                    <Option key={timeOption} value={timeOption}>
                      {timeOption}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="digit">
                <Select
                  showSearch
                  value={filters.pana}
                  placeholder="Select Pana"
                  onChange={handlePannaChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: '100%' }}
                >
                  {pannaOptions.map((panna) => (
                    <Option key={panna} value={panna}>
                      {panna}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Left Digit">
                <Input value={filters.leftDigit} disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Right Digit">
                <Input value={filters.rightDigit} disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '10px'
        }}
      >
        <Button type="default" onClick={handleShowWinnersClick}>
          Show Winners
        </Button>
        <Button type="primary" onClick={handleDeclareResultClick}>
          Declare Result
        </Button>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            backgroundColor: '#f0f2f5',
            padding: '10px'
          }}
        >
          Winners List
        </h2>
        <Table
          columns={winnersColumns}
          dataSource={winnersData}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: 'No winners available' }}
          scroll={{ x: '100%' }}
        />
      </Card>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          {/* <div>
            <span>Show </span>
            <Select
              defaultValue={pagination.pageSize}
              style={{ width: 70 }}
              onChange={(value) =>
                setPagination(prev => ({ ...prev, pageSize: value }))
              }
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            <span> entries</span>
          </div> */}
          <Form.Item label="Search" style={{ marginBottom: 0 }}>
            <Input
              placeholder="Search by Game Name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}   // ✅ direct
          rowKey="key"
          pagination={false}          // ✅ no pagination
          locale={{ emptyText: 'No data available in table' }}
          scroll={{ x: '100%' }}
        />

        {/* <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={filteredData.length}
            onChange={(page) =>
              setPagination(prev => ({ ...prev, current: page }))
            }
          />
        </div> */}
      </Card>

      <Modal
        title="Edit Bid"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item
            label="Bid Points"
            name="bidPoints"
            rules={[{ required: true, message: "Please enter bid points" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Bid Number"
            name="bidNumber"
            rules={[{ required: true, message: "Please enter bid number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Bid
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GalidisawerDeclareResults;