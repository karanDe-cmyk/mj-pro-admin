// export default AutoDepositHistory;
import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Select, DatePicker, Input, Row, Col, Button, Spin, Tag, message } from 'antd';
import dayjs from 'dayjs';
import axios from "../utils/axiosInstance";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const XtreemPaymentHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [searchText, setSearchText] = useState('');
    const [totalSuccessAmount, setTotalSuccessAmount] = useState(0);

    const fetchTransactions = async (date) => {
        setLoading(true);
        try {
            const formattedDate = dayjs(date).format('DD-MM-YYYY');
            const apiUrl = `/api/userPayment/transactions?date=${formattedDate}`;
            const response = await axios.get(apiUrl);

            const data = response.data.data || [];

            // Filter for transactions that are specifically from the Xtreem Gateway
            const xtreemGatewayData = data.filter(item => item.comments && item.comments.includes('Xtreem Gateway'));
            setTransactions(xtreemGatewayData);

            const totalAmount = xtreemGatewayData.reduce((sum, item) => {
                if (item.status === 'Success') {
                    return sum + (item.amount || 0);
                }
                return sum;
            }, 0);
            setTotalSuccessAmount(totalAmount);

        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            message.error('Failed to load transaction data. Please check the API.');
            setTransactions([]);
            setTotalSuccessAmount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        // Apply filtering and searching whenever transactions, status, or search text changes
        const filterData = () => {
            let filteredData = transactions;

            // Filter by status
            if (selectedStatus !== 'All') {
                filteredData = filteredData.filter(item => item.status === selectedStatus);
            }

            // Search by text
            if (searchText) {
                const lowercasedSearch = searchText.toLowerCase();
                filteredData = filteredData.filter(item =>
                    (item.username && item.username.toLowerCase().includes(lowercasedSearch)) ||
                    (item.txnId && item.txnId.toLowerCase().includes(lowercasedSearch)) ||
                    (item.number && item.number.includes(lowercasedSearch))
                );
            }
            setFilteredTransactions(filteredData);
        };
        filterData();
    }, [transactions, selectedStatus, searchText]);

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'txnId',
            key: 'txnId',
            sorter: (a, b) => (a.txnId || '').localeCompare(b.txnId || ''),
            render: (text) => text || 'N/A',
        },
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => (a.username || '').localeCompare(b.username || ''),
            render: (text) => text || 'N/A',
        },
        {
            title: 'Phone Number',
            dataIndex: 'number',
            key: 'number',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Amount (₹)',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
            render: (amount) => `₹${amount || 0}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
            render: (status) => {
                let color;
                switch (status) {
                    case 'Success':
                        color = 'green';
                        break;
                    case 'Failed':
                        color = 'red';
                        break;
                    case 'Pending':
                        color = 'gold';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{status ? status.toUpperCase() : 'N/A'}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (text) => text || 'No comments',
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={4}>Xtreem Gateway Transaction History</Title>
            <Card style={{ marginBottom: 20, borderRadius: '8px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={8}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select Date"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            format="DD-MM-YYYY"
                            allowClear={false}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                        >
                            <Option value="All">All Statuses</Option>
                            <Option value="Success">Success</Option>
                            <Option value="Pending">Pending</Option>
                            <Option value="Failed">Failed</Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={8}>
                        <Search
                            placeholder="Search by username, Txn ID, or number"
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 20 }}>
                    <Text strong>Total Transactions: </Text>
                    <Text>{filteredTransactions.length}</Text>
                    <span style={{ margin: '0 20px' }}>|</span>
                    <Text strong>Total Success Amount (Xtreem Gateway): </Text>
                    <Text style={{ color: 'green' }}>₹{totalSuccessAmount.toFixed(2)}</Text>
                </div>
            </Card>

            <Card style={{ borderRadius: '8px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredTransactions}
                        rowKey="_id"
                        scroll={{ x: 1000 }}
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </Card>
        </div>
    );
};

export default XtreemPaymentHistory;
