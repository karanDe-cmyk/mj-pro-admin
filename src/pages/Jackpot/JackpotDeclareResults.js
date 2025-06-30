
// import React, { useState, useEffect } from 'react';
// import {
//   Table, Input, DatePicker, Button, Form, Row, Col,
//   Select, Pagination, Card, message
// } from 'antd';
// import moment from 'moment';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const { Option } = Select;

// const GalidisawerDeclareResults = () => {
//   const [filters, setFilters] = useState({
//     date: dayjs(),
//     game: '',
//     open_time: '',
//     declaredDigit: ''
//   });
//   const [data, setData] = useState([]);
//   const [winnersData, setWinnersData] = useState([]);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
//   const [searchText, setSearchText] = useState('');
//   const [gameOptions, setGameOptions] = useState([]);

//   const getOpenTimeOptions = () => {
//     if (filters.game) {
//       const selectedGame = gameOptions.find(option => option._id === filters.game);
//       return selectedGame ? [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")] : [];
//     }
//     return [...new Set(
//       gameOptions.map(option =>
//         moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
//       )
//     )];
//   };

//   const fetchDeclareResults = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const res = await axios.get('https://maya-api.kglame.com/api/JackpotDeclareResult/getResult', {
//         headers: { 'Authorization': `Bearer ${accessToken}` }
//       });
//       setData(res.data.results);
//     } catch (err) {
//       console.error("Error fetching results:", err);
//       message.error("Failed to load results");
//     }
//   };

//   useEffect(() => {
//     fetchDeclareResults();
//     const accessToken = localStorage.getItem("accessToken");
//     axios.get('https://maya-api.kglame.com/api/jackpotMarket/getAllMarket', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     })
//       .then(res => setGameOptions(res.data.data || []))
//       .catch(() => message.error("Failed to fetch games"));
//   }, []);

//   const handleDeleteDeclareResult = async (record) => {
//     if (window.confirm("Delete this result?")) {
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         await axios.delete(`https://maya-api.kglame.com/api/JackpotDeclareResult/delete/${record._id}`, {
//           headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         message.success("Deleted successfully");
//         fetchDeclareResults();
//       } catch (err) {
//         message.error("Failed to delete");
//       }
//     }
//   };

//   const handleFilterChange = (value, key) => {
//     setFilters(prev => ({ ...prev, [key]: value, ...(key === 'game' && { open_time: '' }) }));
//   };

//   // const handleShowWinnersClick = async () => {
//   //   try {
//   //     const selectedGame = gameOptions.find(g => g._id === filters.game);
//   //     const gameValue = selectedGame ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}` : '';
//   //     const body = {
//   //       date: filters.date.format("DD-MM-YYYY"),
//   //       game: gameValue,
//   //       open_time: filters.open_time,
//   //       digit: filters.declaredDigit
//   //     };
//   //     const token = localStorage.getItem("accessToken");
//   //     const res = await axios.post("https://maya-api.kglame.com/api/jackpotWinners/showwinners", body, {
//   //       headers: { 'Authorization': `Bearer ${token}` }
//   //     });
//   //     setWinnersData(res.data.winners);
//   //   } catch (err) {
//   //     message.error("Failed to fetch winners");
//   //   }
//   // };
// const handleShowWinnersClick = async () => {
//   try {
//     const selectedGame = gameOptions.find(g => g._id === filters.game);
//     const gameValue = selectedGame
//       ? `${selectedGame.game_name} [ ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")} ]`
//       : '';

//     const body = {
//       date: filters.date.format("DD-MM-YYYY"),
//       game: gameValue,
//       digit: filters.digit // ← fix this line
//     };

//     const token = localStorage.getItem("accessToken");
//     const res = await axios.post("https://maya-api.kglame.com/api/jackpotWinners/showwinners", body, {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });

//     setWinnersData(res.data.winners);
//   } catch (err) {
//     message.error("Failed to fetch winners");
//   }
// };

//   const handleDeclareResultClick = async () => {
//     try {
//       const selectedGame = gameOptions.find(g => g._id === filters.game);
//       const gameValue = selectedGame ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}` : '';
//       const body = {
//         marketName: "Jackpot",
//         date: filters.date.format("DD-MM-YYYY"),
//         game: gameValue,
//         open_time: filters.open_time,
//         declaredDigit: filters.declaredDigit
//       };
//       const token = localStorage.getItem("accessToken");
//       await axios.post("https://maya-api.kglame.com/api/JackpotDeclareResult/declare", body, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       message.success("Result declared!");
//       fetchDeclareResults();
//     } catch (err) {
//       message.error("Failed to declare result");
//     }
//   };

//   const columns = [
//     { title: '#', render: (_, __, index) => index + 1 },
//     { title: 'Game Name', dataIndex: 'gameName' },
//     { title: 'Result Date', dataIndex: 'date', render: text => moment(text).format('DD-MM-YYYY') },
//     { title: 'Winning Digit', dataIndex: 'declaredDigit' },
//     {
//       title: 'Action',
//       render: (_, record) => (
//         <Button danger onClick={() => handleDeleteDeclareResult(record)}>Delete</Button>
//       )
//     }
//   ];

//   const winnersColumns = [
//     { title: 'User Name', dataIndex: 'userName' },
//     { title: 'Bid Points', dataIndex: 'bidPoints' },
//     { title: 'Winning Points', dataIndex: 'winningPoints' },
//     { title: 'Market Name', dataIndex: 'marketName' },
//     { title: 'Game Name', dataIndex: 'gameName' },
//     { title: 'Digit', dataIndex: 'digit' },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       render: text => text ? moment(text).format('YYYY-MM-DD') : ''
//     }
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h1 style={{ textAlign: 'center' }}>Jackpot Declare Results</h1>

//       <Card style={{ marginBottom: 20 }}>
//         <Form layout="vertical">
//           <Row gutter={[16, 16]}>
//             <Col md={4}><Form.Item label="Date"><DatePicker value={filters.date} onChange={date => handleFilterChange(date, 'date')} format="DD-MM-YYYY" style={{ width: '100%' }} /></Form.Item></Col>
//             <Col md={6}><Form.Item label="Game"><Select showSearch value={filters.game} placeholder="Select Game" onChange={value => handleFilterChange(value, 'game')} style={{ width: '100%' }}>{gameOptions.map(opt => <Option key={opt._id} value={opt._id}>{`${opt.game_name} ${moment(opt.open_time, "hh:mm:ssA").format("hh:mm A")}`}</Option>)}</Select></Form.Item></Col>
//             <Col md={4}><Form.Item label="Open Time"><Select showSearch value={filters.open_time} placeholder="Open Time" onChange={value => handleFilterChange(value, 'open_time')} style={{ width: '100%' }}>{getOpenTimeOptions().map(time => <Option key={time} value={time}>{time}</Option>)}</Select></Form.Item></Col>
//             <Col md={4}><Form.Item label="Digit"><Input value={filters.declaredDigit} onChange={e => handleFilterChange(e.target.value, 'declaredDigit')} maxLength={2} /></Form.Item></Col>
//           </Row>
//         </Form>
//       </Card>

//       <div style={{ textAlign: 'center', marginBottom: 20 }}>
//         <Button onClick={handleShowWinnersClick} style={{ marginRight: 8 }}>Show Winners</Button>
//         <Button type="primary" onClick={handleDeclareResultClick}>Declare Result</Button>
//       </div>

//       <Card title="Winners List" style={{ marginBottom: 20 }}>
//         <Table columns={winnersColumns} dataSource={winnersData} rowKey="_id" pagination={false} scroll={{ x: '100%' }} />
//       </Card>

//       <Card>
//         <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
//           <Col>
//             Show
//             <Select defaultValue={pagination.pageSize} style={{ width: 70, margin: '0 8px' }} onChange={value => setPagination(prev => ({ ...prev, pageSize: value }))}>
//               {[5, 10, 20].map(size => <Option key={size} value={size}>{size}</Option>)}
//             </Select>
//             entries
//           </Col>
//           <Col>
//             <Input
//               placeholder="Search by Game Name"
//               value={searchText}
//               onChange={e => setSearchText(e.target.value)}
//               style={{ width: 250 }}
//             />
//           </Col>
//         </Row>

//         <Table
//           columns={columns}
//           dataSource={data
//             .filter(item => item.gameName?.toLowerCase().includes(searchText.toLowerCase()))
//             .slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)}
//           rowKey="_id"
//           pagination={false}
//           scroll={{ x: '100%' }}
//         />

//         <Pagination
//           current={pagination.current}
//           pageSize={pagination.pageSize}
//           total={data.length}
//           onChange={page => setPagination(prev => ({ ...prev, current: page }))}
//           style={{ marginTop: 16, textAlign: 'right' }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default GalidisawerDeclareResults;
import React, { useState, useEffect } from 'react';
import {
  Table, Input, DatePicker, Button, Form, Row, Col,
  Select, Pagination, Card, message
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const GalidisawerDeclareResults = () => {
  const [filters, setFilters] = useState({
    date: dayjs(),
    game: '',
    open_time: '',
    declaredDigit: ''
  });
  const [data, setData] = useState([]);
  const [winnersData, setWinnersData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [searchText, setSearchText] = useState('');
  const [gameOptions, setGameOptions] = useState([]);

  const getOpenTimeOptions = () => {
    if (filters.game) {
      const selectedGame = gameOptions.find(option => option._id === filters.game);
      return selectedGame ? [moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")] : [];
    }
    return [...new Set(
      gameOptions.map(option =>
        moment(option.open_time, "hh:mm:ssA").format("hh:mm A")
      )
    )];
  };

  const fetchDeclareResults = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get('https://maya-api.kglame.com/api/JackpotDeclareResult/getResult', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setData(res.data.results);
    } catch (err) {
      console.error("Error fetching results:", err);
      message.error("Failed to load results");
    }
  };

  useEffect(() => {
    fetchDeclareResults();
    const accessToken = localStorage.getItem("accessToken");
    axios.get('https://maya-api.kglame.com/api/jackpotMarket/getAllMarket', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => setGameOptions(res.data.data || []))
      .catch(() => message.error("Failed to fetch games"));
  }, []);

  const handleDeleteDeclareResult = async (record) => {
    if (window.confirm("Delete this result?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`https://maya-api.kglame.com/api/JackpotDeclareResult/delete/${record._id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        message.success("Deleted successfully");
        fetchDeclareResults();
      } catch (err) {
        message.error("Failed to delete");
      }
    }
  };

  const handleFilterChange = (value, key) => {
    setFilters(prev => ({ ...prev, [key]: value, ...(key === 'game' && { open_time: '' }) }));
  };

  const handleShowWinnersClick = async () => {
    try {
      const selectedGame = gameOptions.find(g => g._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} [ ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")} ]`
        : '';

      const body = {
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        digit: filters.declaredDigit // ✅ Correct field used
      };

      const token = localStorage.getItem("accessToken");
      const res = await axios.post("https://maya-api.kglame.com/api/jackpotWinners/showwinners", body, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setWinnersData(res.data.winners);
    } catch (err) {
      message.error("Failed to fetch winners");
    }
  };

  const handleDeclareResultClick = async () => {
    try {
      const selectedGame = gameOptions.find(g => g._id === filters.game);
      const gameValue = selectedGame
        ? `${selectedGame.game_name} ${moment(selectedGame.open_time, "hh:mm:ssA").format("hh:mm A")}`
        : '';

      const body = {
        marketName: "Jackpot",
        date: filters.date.format("DD-MM-YYYY"),
        game: gameValue,
        open_time: filters.open_time,
        declaredDigit: filters.declaredDigit
      };

      const token = localStorage.getItem("accessToken");
      await axios.post("https://maya-api.kglame.com/api/JackpotDeclareResult/declare", body, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      message.success("Result declared!");
      fetchDeclareResults();
    } catch (err) {
      message.error("Failed to declare result");
    }
  };

  const columns = [
    { title: '#', render: (_, __, index) => index + 1 },
    { title: 'Game Name', dataIndex: 'gameName' },
    { title: 'Result Date', dataIndex: 'date', render: text => moment(text).format('DD-MM-YYYY') },
    { title: 'Winning Digit', dataIndex: 'declaredDigit' },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteDeclareResult(record)}>Delete</Button>
      )
    }
  ];

  const winnersColumns = [
    { title: 'User Name', dataIndex: 'userName' },
    { title: 'Bid Points', dataIndex: 'bidPoints' },
    { title: 'Winning Points', dataIndex: 'winningPoints' },
    { title: 'Market Name', dataIndex: 'marketName' },
    { title: 'Game Name', dataIndex: 'gameName' },
    { title: 'Digit', dataIndex: 'digit' },
    {
      title: 'Date',
      dataIndex: 'date',
      render: text => text ? moment(text).format('YYYY-MM-DD') : ''
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>Jackpot Declare Results</h1>

      <Card style={{ marginBottom: 20 }}>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col md={4}>
              <Form.Item label="Date">
                <DatePicker
                  value={filters.date}
                  onChange={date => handleFilterChange(date, 'date')}
                  format="DD-MM-YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item label="Game">
                <Select
                  showSearch
                  value={filters.game}
                  placeholder="Select Game"
                  onChange={value => handleFilterChange(value, 'game')}
                  style={{ width: '100%' }}
                >
                  {gameOptions.map(opt => (
                    <Option key={opt._id} value={opt._id}>
                      {`${opt.game_name} ${moment(opt.open_time, "hh:mm:ssA").format("hh:mm A")}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={4}>
              <Form.Item label="Open Time">
                <Select
                  showSearch
                  value={filters.open_time}
                  placeholder="Open Time"
                  onChange={value => handleFilterChange(value, 'open_time')}
                  style={{ width: '100%' }}
                >
                  {getOpenTimeOptions().map(time => (
                    <Option key={time} value={time}>{time}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={4}>
              <Form.Item label="Digit">
                <Input
                  value={filters.declaredDigit}
                  onChange={e => handleFilterChange(e.target.value, 'declaredDigit')}
                  maxLength={2}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Button
          onClick={handleShowWinnersClick}
          style={{ marginRight: 8 }}
          disabled={!filters.declaredDigit}
        >
          Show Winners
        </Button>
        <Button type="primary" onClick={handleDeclareResultClick}>Declare Result</Button>
      </div>

      <Card title="Winners List" style={{ marginBottom: 20 }}>
        <Table
          columns={winnersColumns}
          dataSource={winnersData}
          rowKey="_id"
          pagination={false}
          scroll={{ x: '100%' }}
        />
      </Card>

      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
          <Col>
            Show
            <Select
              defaultValue={pagination.pageSize}
              style={{ width: 70, margin: '0 8px' }}
              onChange={value => setPagination(prev => ({ ...prev, pageSize: value }))}
            >
              {[5, 10, 20].map(size => (
                <Option key={size} value={size}>{size}</Option>
              ))}
            </Select>
            entries
          </Col>
          <Col>
            <Input
              placeholder="Search by Game Name"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data
            .filter(item => item.gameName?.toLowerCase().includes(searchText.toLowerCase()))
            .slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)}
          rowKey="_id"
          pagination={false}
          scroll={{ x: '100%' }}
        />

        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={data.length}
          onChange={page => setPagination(prev => ({ ...prev, current: page }))}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </Card>
    </div>
  );
};

export default GalidisawerDeclareResults;
