import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";

const DepositTransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch transactions from API
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page,
                limit: 10,
                sortField,
                sortOrder,
                status: filterStatus === 'all' ? '' : filterStatus
            });
            
            const response = await axiosInstance.get(`/api/deposit/all-transactions?${params}`);

            if (response.data.status) {
                // Use transactionsWithUser instead of transactions to get user names
                setTransactions(response.data.data.transactionsWithUser || response.data.data.transactions);
                setTotalPages(response.data.data.pagination.totalPages);
                setTotalItems(response.data.data.pagination.totalItems);
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
    }, [page, filterStatus, sortField, sortOrder]);

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setPage(1);
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
        return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderSortIndicator = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deposit Transactions</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Status
                    </label>
                    <div className="flex space-x-2">
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
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-3">
                        Showing {transactions.length} of {totalItems} transactions
                    </div>
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
                                    onClick={() => handleSort('userName')}
                                >
                                    User Name {renderSortIndicator('userName')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    Email {renderSortIndicator('email')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('amount')}
                                >
                                    Amount {renderSortIndicator('amount')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Request Number
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    Status {renderSortIndicator('status')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {transaction.userName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {transaction.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {transaction.amount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                            {transaction.requestNumber}
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 bg-gray-200 rounded-md ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                    >
                        Previous
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && <span className="px-2 py-1">...</span>}
                    </div>

                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 bg-gray-200 rounded-md ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepositTransactionsTable;