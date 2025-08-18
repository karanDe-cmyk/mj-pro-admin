import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Select, DatePicker, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WithdrawalList = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: undefined,
        dateRange: [],
    });

    const statusColors = {
        pending: 'orange',
        processing: 'blue',
        success: 'green',
        failed: 'red',
        rejected: 'volcano',
    };

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const params = {};
            
            // Add status filter if selected
            if (filters.status) {
                params.status = filters.status;
            }
            
            // Add date range filter if selected
            if (filters.dateRange && filters.dateRange.length === 2) {
                params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
                params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
            }

            const response = await axiosInstance.get('/api/admin/withdrawals', { params });
            setWithdrawals(response.data.withdrawals || response.data.data?.withdrawals || []);
        } catch (error) {
            console.error('Failed to fetch withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [filters]); // Refetch when filters change

    const handleStatusChange = (value) => {
        setFilters({ ...filters, status: value });
    };

    const handleDateChange = (dates) => {
        setFilters({ ...filters, dateRange: dates });
    };

    const resetFilters = () => {
        setFilters({
            status: undefined,
            dateRange: [],
        });
    };

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'transaction_id',
            key: 'transaction_id',
            render: (text) => <span className="font-mono">{text}</span>,
        },
        {
            title: 'User',
            dataIndex: ['user_id', 'userName'],
            key: 'user',
            render: (userName, record) => (
                <div>
                    <div>{userName || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{record.user_id?.email}</div>
                </div>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `₹${amount?.toLocaleString() || '0'}`,
            sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
        },
        {
            title: 'Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => (
                <Tag color={method === 'bank' ? 'blue' : method === 'upi' ? 'purple' : 'cyan'}>
                    {method?.toUpperCase() || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status] || 'gray'}>
                    {status?.toUpperCase() || 'UNKNOWN'}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'date',
            render: (date) => date ? moment(date).format('DD MMM YYYY, hh:mm A') : 'N/A',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <Select
                    placeholder="Filter by status"
                    style={{ width: 150 }}
                    allowClear
                    value={filters.status}
                    onChange={handleStatusChange}
                >
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="success">Success</Option>
                    <Option value="failed">Failed</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>

                <RangePicker
                    onChange={handleDateChange}
                    value={filters.dateRange}
                    style={{ width: 250 }}
                />

                <Button
                    icon={<SyncOutlined />}
                    onClick={resetFilters}
                >
                    Reset Filters
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={withdrawals}
                rowKey="_id"
                loading={loading}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default WithdrawalList;