import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { useLocation, useSearchParams } from 'react-router-dom';

const DepositTransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    const selectedDate = searchParams.get('date') || '';

    // Fetch all transactions from API
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get(`/api/userPayment/getpaymentResponse?date=${selectedDate}&&method=Admin Deposit`);

            if (response.data.success) {
                // API response में data array में transactions हैं
                const allTransactions = response.data.data || [];
                const adminDeposit = allTransactions.filter((data) => {
                    return data.method === 'Admin Deposit'
                })
                setTransactions(adminDeposit);
                setFilteredTransactions(adminDeposit);
            } else {
                throw new Error(response.data.message || 'Failed to fetch transactions');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [selectedDate]); // selectedDate dependency add की है

    // Filter and sort transactions whenever filters, sort, or search changes
    useEffect(() => {
        let result = [...transactions];

        // Apply status filter
        if (filterStatus !== 'all') {
            result = result.filter(transaction => {
                const status = transaction.status?.toLowerCase();
                if (filterStatus === 'success') return status === 'success';
                if (filterStatus === 'pending') return status === 'pending';
                if (filterStatus === 'failed') return status === 'failed';
                return true;
            });
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(transaction =>
                transaction.username?.toLowerCase().includes(term) ||
                transaction.phone?.toLowerCase().includes(term) ||
                transaction._id?.toLowerCase().includes(term) ||
                transaction.txnId?.toLowerCase().includes(term) ||
                transaction.amount?.toString().includes(term)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle date sorting
            if (sortField === 'date' || sortField === 'createdAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            // Handle undefined or null values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
            if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // Handle number comparison
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

        setFilteredTransactions(result);
    }, [transactions, filterStatus, sortField, sortOrder, searchTerm]);

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const renderSortIndicator = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const statusCounts = {
        all: transactions.length,
        success: transactions.filter(t => t.status?.toLowerCase() === 'success').length,
        pending: transactions.filter(t => t.status?.toLowerCase() === 'pending').length,
        failed: transactions.filter(t => t.status?.toLowerCase() === 'failed').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                    onClick={fetchTransactions}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deposit by Admin</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-600">Total Transactions</h3>
                    <p className="text-2xl font-bold">{statusCounts.all}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-600">Successful</h3>
                    <p className="text-2xl font-bold">{statusCounts.success}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                    <p className="text-2xl font-bold">{statusCounts.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-600">Failed</h3>
                    <p className="text-2xl font-bold">{statusCounts.failed}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Status
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'success', 'pending', 'failed'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleFilterChange(status)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${filterStatus === status
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                        <span className="ml-1 bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                                            {statusCounts[status]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by username, phone, transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('date')}
                                >
                                    Date {renderSortIndicator('date')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('username')}
                                >
                                    Username {renderSortIndicator('username')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('phone')}
                                >
                                    Phone {renderSortIndicator('phone')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('amount')}
                                >
                                    Amount {renderSortIndicator('amount')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('txnId')}
                                >
                                    Transaction ID {renderSortIndicator('txnId')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    Status {renderSortIndicator('status')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Method
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(transaction.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <a
                                                href={`/admin/user-management/user-details/${transaction.userId}`}
                                                target="_self"
                                                rel="noopener noreferrer"
                                                className='underline text-blue-600'
                                            >
                                                {transaction.username || 'N/A'}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {transaction.phone || transaction.number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{transaction.amount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                            {transaction.txnId?.substring(0, 20)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${transaction.status?.toLowerCase() === 'success' ? 'bg-green-100 text-green-800' : ''}
                                                ${transaction.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${transaction.status?.toLowerCase() === 'failed' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {transaction.method || 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DepositTransactionsTable;