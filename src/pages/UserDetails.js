import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import instance from "../utils/axiosInstance";
import moment from "moment";
import dayjs from "dayjs";
import BidHistory from "../components/BidHistory";
import WinningHistory from "../components/WinningHistory";

const UserDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [withdrawData, setWithdrawData] = useState([]);
  const [search, setSearch] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [amount, setAmount] = useState("");
  const [depositTransactions, setDepositTransactions] = useState([]);
  const [manualDepositTransactions, setManualDepositTransactions] = useState([]);
  const [adminDepositTransactions, setAdminDepositTransactions] = useState([]);
  const [autoDepositTransactions, setAutoDepositTransactions] = useState([]);
  const [adminWithdrawalTransactions, setAdminWithdrawalTransactions] = useState([]);
  const [autoWithdrawalTransactions, setAutoWithdrawalTransactions] = useState([]);
  const [entries, setEntries] = useState(5);
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactionHistoryDataAll, setTransactionHistoryDataAll] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalBidPoints: 0,
    manualDepositAmount: 0,
    autoDepositAmount: 0,
    manualWithdrawalAmount: 0,
    autoWithdrawalAmount: 0,
    totalWinningAmount: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserPassword = async () => {
    try {
      const response = await instance.get(`/api/auth/getuserpassword/${userId}`);
      if (response.data?.data?.password) {
        setUserPassword(response.data.data.password);
      }
    } catch (error) {
      console.error("Error fetching user password:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPassword();
    }
  }, [userId]);

  const fetchManualTransactionsAll = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/manualDeposit/user/${userId}`);

      let deposits = [];
      if (response.status === 200 && Array.isArray(response.data)) {
        deposits = response.data;
      }

      deposits = deposits.filter(
        (item) => item.status && item.status.toLowerCase() === "pending"
      );

      deposits.sort((a, b) => {
        return (
          moment(b.date, "YYYY-MM-DD HH:mm").valueOf() -
          moment(a.date, "YYYY-MM-DD HH:mm").valueOf()
        );
      });

      setManualDepositTransactions(deposits);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManualTransactionsAll();
  }, [userId]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await instance.post(
        `/api/auth/userStatusUpdate/${userId}`,
        {
          type: "status",
          value: newStatus,
        }
      );
      if (response.data?.user) {
        setStatus(response.data.user.status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await instance.delete(
        `/api/auth/deleteUser/${userId}`
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const response = await instance.get(
        `/api/deposit/transactions/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const loadTransactions = async () => {
    if (!userData?.userId) return;

    try {
      const data = await fetchTransactions(userData.userId);
      if (data.status) {
        setDepositTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData && userData.userId) {
        await loadTransactions();
      }
    };
    fetchData();
  }, [userData]);

  const fetchWithdrawTransactions = async () => {
    try {
      const response = await instance.get(
        `/api/users/withdrawals/${userId}`
      );

      if (response.data && Array.isArray(response.data)) {
        // Separate withdrawals by type
        const adminWithdrawals = response.data.filter(
          (txn) => txn.method === "Manual Withdrawal" || txn.type === "manual"
        );
        
        const autoWithdrawals = response.data.filter(
          (txn) => txn.method === "Auto Withdrawal" || txn.type === "bank"
        );

        setAdminWithdrawalTransactions(adminWithdrawals);
        setAutoWithdrawalTransactions(autoWithdrawals);

        // Keep pending/success for the original withdraw table
        const filteredData = response.data.filter((txn) => {
          return txn.status.toLowerCase() === "pending" || txn.status.toLowerCase() === 'success';
        });

        setWithdrawData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching withdrawal transactions:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWithdrawTransactions();
    }
  }, [userId]);

  const updateWithdrawStatus = async (id, status) => {
    try {
      await instance.patch(`/api/users/withdrawals/status/${id}`, {
        status: status,
      });

      fetchWithdrawTransactions();

    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await instance.get(`/api/app/users/${userId}`);
      setUserData(response.data);
      setStatus(response.data.status);

      try {
        const financialResponse = await instance.get(`/api/auth/getUserFinancialSummary/${userId}`);
        if (financialResponse.data?.success) {
          setFinancialSummary(financialResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const openModal = (type) => {
    setActionType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setAmount("");
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        phone: userData.phone,
        email: userData.email,
        amount: parseFloat(amount),
        method: "Manual Withdrawal",
        type: "manual"
      };

      let transactionResponse;

      if (actionType === "add") {
        transactionResponse = await instance.post(
          `/api/deposit/Addfunds`,
          requestBody
        );
      } else if (actionType === "withdraw") {
        transactionResponse = await instance.post(
          "/api/withdraw/create",
          requestBody
        );
      }

      if (transactionResponse?.data?.status) {
        const changeAmount = transactionResponse.data.requestAmount || transactionResponse.data.amount;
        setUserData((prevData) => ({
          ...prevData,
          walletBalance:
            actionType === "add"
              ? prevData.walletBalance + changeAmount
              : prevData.walletBalance - changeAmount,
        }));

        alert(`Transaction successful! ${changeAmount} ₹ ${actionType === "add" ? "added" : "withdrawn"}`);
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const fetchAutoDepositData = async () => {
    try {
      const response = await instance.get(`/api/userPayment/getAutoDeposit/${userId}`);

      if (response.data?.success && Array.isArray(response.data.data)) {
        const allDeposits = response.data.data;

        const adminDeposits = allDeposits.filter(item =>
          item.method === "Admin Deposit" || item.requestType === "Admin Deposit"
        );

        const autoDeposits = allDeposits.filter(item =>
          !(item.method === "Admin Deposit" || item.requestType === "Admin Deposit")
        );

        setAdminDepositTransactions(adminDeposits);
        setAutoDepositTransactions(autoDeposits);
      }
    } catch (error) {
      console.error("Error fetching auto deposit data:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchAutoDepositData();
  }, [userId]);

  const parseDate = (dateStr) => {
    if (moment(dateStr, moment.ISO_8601, true).isValid()) {
      return moment(dateStr);
    }
    return moment(new Date(dateStr));
  };

  const formatTransactionData = (
    depositTransactions,
    withdrawTransactions,
    manualDeposits,
    autoDeposits
  ) => {
    const formattedDeposits = depositTransactions.map((txn, index) => {
      const parsedDate = parseDate(txn.date);
      return {
        key: `deposit-${index}`,
        requestNumber: txn.requestNumber || txn.transaction_id || "N/A",
        amount: txn.amount,
        transactionType: "Money Added",
        date: parsedDate.format("YYYY-MM-DD hh:mm:ss A"),
        sortDate: parsedDate.toDate(),
        type: "deposit",
      };
    });

    const formattedWithdrawals = withdrawTransactions.map((txn, index) => {
      const parsedDate = moment(txn.time || txn.date);
      return {
        key: `withdraw-${index}`,
        requestNumber: txn.requestNumber || txn.transaction_id || "N/A",
        amount: txn.amount,
        transactionType: "Withdraw Request",
        date: parsedDate.format("YYYY-MM-DD hh:mm:ss A"),
        sortDate: parsedDate.toDate(),
        type: "withdraw",
      };
    });

    const acceptedManualDeposits = manualDeposits.filter(
      (txn) => txn.status && txn.status.toLowerCase() === "accepted"
    );

    const formattedManualDeposits = acceptedManualDeposits.map((txn, index) => {
      const parsedDate = moment(txn.createdAt);
      return {
        key: `manual-${index}`,
        requestNumber: txn.transactionId,
        amount: txn.amount,
        transactionType: "Money Added",
        date: parsedDate.format("MM/DD/YYYY, h:mm:ss A"),
        sortDate: parsedDate.toDate(),
        type: "manual",
      };
    });

    const formattedAutoDeposits = autoDeposits.map((txn, index) => {
      const parsedDate = dayjs(txn.date, ["YYYY-MM-DD hh:mm:ss A", "DD-MM-YYYY HH:mm"], true);

      return {
        key: `auto-${index}`,
        txnId: txn.txnId,
        amount: txn.amount,
        transactionType: txn.method,
        date: txn.date,
        sortDate: parsedDate.isValid() ? parsedDate.toDate() : new Date(),
        type: txn.method,
      };
    });

    const allTransactions = [
      ...formattedDeposits,
      ...formattedWithdrawals,
      ...formattedManualDeposits,
      ...formattedAutoDeposits,
    ];

    allTransactions.sort((a, b) => b.sortDate - a.sortDate);
    allTransactions.forEach((txn, index) => {
      txn.sNo = index + 1;
    });

    setTransactionHistoryDataAll(allTransactions);
  };

  const handleWhatsAppClick = () => {
    if (userData?.userWhatsappNumber) {
      window.open(`https://wa.me/+91${userData.userWhatsappNumber}`, "_blank");
    }
  };

  const handleEntriesChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const handleAccept = async (id) => {
    try {
      await instance.put(`/api/manualDeposit/${id}`, { status: "Accepted" });
      console.log("Transaction accepted successfully.");
      fetchManualTransactionsAll();
      fetchUserData();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await instance.put(`/api/manualDeposit/${id}`, { status: "Canceled" });
      console.log("Transaction canceled successfully.");
      fetchManualTransactionsAll();
      fetchUserData();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  // Updated Table Component with Sum Feature
  const Table = ({ columns, data, pagination = true, showSum = true }) => {
    const renderCell = (row, column, rowIndex) => {
      if (column.cell) {
        return column.cell(row[column.accessor], row, rowIndex);
      }
      return row[column.accessor] || "—";
    };

    // Calculate sum for each numeric column
    const calculateColumnSums = () => {
      const sums = {};
      
      columns.forEach(column => {
        if (column.accessor && column.calculateSum !== false) {
          let total = 0;
          data.forEach(row => {
            const value = row[column.accessor];
            if (typeof value === 'number') {
              total += value;
            } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
              total += parseFloat(value);
            }
          });
          sums[column.accessor] = total;
        }
      });
      
      return sums;
    };

    const columnSums = showSum && data.length > 0 ? calculateColumnSums() : {};

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              <>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-sm text-gray-700 border-b"
                      >
                        {renderCell(row, col, rowIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Sum Row */}
                {showSum && data.length > 0 && (
                  <tr className="bg-blue-50 font-bold">
                    {columns.map((col, colIndex) => {
                      const sum = columnSums[col.accessor];
                      
                      if (colIndex === 0) {
                        return (
                          <td key={colIndex} className="px-4 py-3 text-sm border-t-2 border-blue-300">
                            <span className="text-blue-700">Total</span>
                          </td>
                        );
                      }
                      
                      if (sum !== undefined && sum !== 0) {
                        return (
                          <td key={colIndex} className="px-4 py-3 text-sm border-t-2 border-blue-300">
                            <span className="text-green-600 font-bold">₹{sum.toFixed(2)}</span>
                          </td>
                        );
                      }
                      
                      return (
                        <td key={colIndex} className="px-4 py-3 text-sm border-t-2 border-blue-300">
                          <span className="text-gray-500">—</span>
                        </td>
                      );
                    })}
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        {pagination && data.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * pageSize >= data.length}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const depositTransactionColumns = [
    {
      header: "#",
      accessor: "sno",
      cell: (row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "Amount ₹",
      accessor: "amount",
      cell: (amount) => (
        <div className="inline-block w-20 h-7 leading-7 text-center rounded bg-cyan-50 text-black font-bold">
          {amount}
        </div>
      ),
      calculateSum: true,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) =>
        moment(date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleAccept(row._id)}
          >
            Accept
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleCancel(row._id)}
          >
            Cancel
          </button>
        </div>
      ),
      calculateSum: false,
    },
  ];

  const adminDepositColumns = [
    {
      header: "#",
      cell: (_value, _row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "Amount ₹",
      accessor: "amount",
      cell: (amount) => (
        <div className="inline-block w-20 h-7 leading-7 text-center rounded bg-green-50 text-green-700 font-bold">
          + {amount}
        </div>
      ),
      calculateSum: true,
    },
    {
      header: "Method",
      accessor: "method",
      calculateSum: false,
    },
    {
      header: "Comments",
      accessor: "comments",
      calculateSum: false,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => moment(date).format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span className={`inline-block px-3 py-1 rounded text-white font-bold ${status === "Success" ? "bg-green-500" :
          status === "Pending" ? "bg-yellow-500" :
            "bg-red-500"
          }`}>
          {status}
        </span>
      ),
      calculateSum: false,
    },
  ];

  const autoDepositColumns = [
    {
      header: "#",
      cell: (_value, _row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "Amount ₹",
      accessor: "amount",
      cell: (amount) => (
        <div className="inline-block w-20 h-7 leading-7 text-center rounded bg-blue-50 text-blue-700 font-bold">
          + {amount}
        </div>
      ),
      calculateSum: true,
    },
    {
      header: "Request Type",
      accessor: "requestType",
      calculateSum: false,
    },
    {
      header: "Comments",
      accessor: "comments",
      calculateSum: false,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => moment(date).format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span className={`inline-block px-3 py-1 rounded text-white font-bold ${status === "Success" ? "bg-green-500" :
          status === "Pending" ? "bg-yellow-500" :
            "bg-red-500"
          }`}>
          {status}
        </span>
      ),
      calculateSum: false,
    },
  ];

  const adminWithdrawalColumns = [
    {
      header: "#",
      cell: (_value, _row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "User Name",
      accessor: "userName",
      calculateSum: false,
    },
    {
      header: "Amount ₹",
      accessor: "amount",
      cell: (amount) => (
        <div className="inline-block w-20 h-7 leading-7 text-center rounded bg-red-50 text-red-700 font-bold">
          - {amount}
        </div>
      ),
      calculateSum: true,
    },
    {
      header: "Method",
      accessor: "method",
      calculateSum: false,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => moment(date, "YYYY-MM-DD hh:mm:ss A").format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span className={`inline-block px-3 py-1 rounded text-white font-bold ${status === "Success" ? "bg-green-500" :
          status === "Pending" ? "bg-yellow-500" :
            "bg-red-500"
          }`}>
          {status}
        </span>
      ),
      calculateSum: false,
    },
  ];

  const autoWithdrawalColumns = [
    {
      header: "#",
      cell: (_value, _row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "User Name",
      accessor: "userName",
      calculateSum: false,
    },
    {
      header: "Amount ₹",
      accessor: "amount",
      cell: (amount) => (
        <div className="inline-block w-20 h-7 leading-7 text-center rounded bg-orange-50 text-orange-700 font-bold">
          - {amount}
        </div>
      ),
      calculateSum: true,
    },
    {
      header: "Method",
      accessor: "method",
      calculateSum: false,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => moment(date, "YYYY-MM-DD hh:mm:ss A").format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span className={`inline-block px-3 py-1 rounded text-white font-bold ${status === "Success" ? "bg-green-500" :
          status === "Pending" ? "bg-yellow-500" :
            "bg-red-500"
          }`}>
          {status}
        </span>
      ),
      calculateSum: false,
    },
  ];

  const historyFilteredData = transactionHistoryDataAll.filter((item) =>
    Object.values(item).some((value) => {
      if (value !== null && value !== undefined) {
        return value.toString().toLowerCase().includes(search.toLowerCase());
      }
      return false;
    })
  );

  const withdrawColumns = [
    {
      header: "S.No",
      cell: (_value, _row, index) => index + 1,
      calculateSum: false,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (amount) => (
        <span className="inline-block min-w-20 text-center px-3 py-1.5 rounded bg-red-500 text-white font-bold">
          - {amount}
        </span>
      ),
      calculateSum: true,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => moment(date).format("YYYY-MM-DD hh:mm:ss A"),
      calculateSum: false,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span className="inline-block min-w-20 text-center px-3 py-1.5 rounded text-white bg-yellow-500 capitalize">
          {status}
        </span>
      ),
      calculateSum: false,
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
            onClick={() => updateWithdrawStatus(row._id, "approved")}
          >
            <CheckCircleOutlined className="mr-2" />
            Accept
          </button>
          <button
            className="flex items-center px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
            onClick={() => updateWithdrawStatus(row._id, "rejected")}
          >
            <CloseCircleOutlined className="mr-2" />
            Reject
          </button>
        </div>
      ),
      calculateSum: false,
    },
  ];

  const transactionHistoryColumnsAll = [
    {
      header: "#",
      cell: (row, index) => (currentPage - 1) * pageSize + index + 1,
      calculateSum: false,
    },
    {
      header: "Request No/Transaction ID",
      accessor: "requestNumber",
      cell: (requestNumber) => requestNumber || "N/A",
      calculateSum: false,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (amount, row) => {
        const isDeposit =
          row.type === "deposit" ||
          row.type === "manual" ||
          row.type === "auto";
        return (
          <span
            className={`px-3 py-1 rounded inline-block min-w-20 font-bold text-center ${isDeposit
              ? "text-green-700 bg-green-100"
              : "text-white bg-red-500"
              }`}
          >
            {isDeposit ? `+ ${amount || 0}` : `- ${amount || 0}`}
          </span>
        );
      },
      calculateSum: true,
    },
    {
      header: "Transaction Type",
      accessor: "transactionType",
      cell: (text, row) => {
        const isDeposit =
          row.type === "deposit" ||
          row.type === "manual" ||
          row.type === "auto";
        return (
          <span
            className={`px-4 py-2 rounded font-bold inline-block min-w-30 text-center ${isDeposit
              ? "text-green-700 border-2 border-green-300 bg-green-50"
              : "text-amber-800 border-2 border-amber-300 bg-amber-50"
              }`}
          >
            {text || "Unknown"}
          </span>
        );
      },
      calculateSum: false,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date, row) =>
        row.sortDate
          ? dayjs(row.sortDate).format("M/D/YYYY, h:mm:ss A")
          : "N/A",
      calculateSum: false,
    },
  ];

  const formatBalance = (balance) => {
    return Math.floor(balance * 100) / 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">No user data available.</div>
      </div>
    );
  }

  const filteredDepositTransactions = manualDepositTransactions.filter((item) =>
    Object.values(item || {}).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes((search || "").toLowerCase())
    )
  );

  return (
    <div className="p-5 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center mb-5">
        <button
          onClick={() => window.history.back()}
          className="mr-3 p-2 hover:bg-gray-200 rounded-full"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-0">USER DETAILS</h1>
      </div>

      {/* Main Content */}
      <div className="flex w-full gap-6 mb-6">
        {/* Left Column */}
        <div className="bg-white rounded-lg shadow p-5 mb-5 w-[60%]">
          <div className="flex flex-wrap justify-between items-center bg-purple-100 p-4 rounded-lg mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{userData.userName}</h2>
              <div className="flex items-center mt-2">
                <PhoneOutlined className="text-gray-600 mr-2" />
                <span className="mr-4">{userData.phone}</span>
                <WhatsAppOutlined
                  className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                  onClick={handleWhatsAppClick}
                />
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-bold mr-2">Delete Account</span>
                <button
                  onClick={deleteAccount}
                  className="px-4 py-1 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="mb-2">
                <span className="font-bold mr-2">Active:</span>
                <button
                  onClick={() => updateStatus(!status)}
                  className={`px-4 py-1 rounded-full text-white font-bold text-sm ${status ? 'bg-green-500' : 'bg-red-500'} hover:opacity-90`}
                >
                  {status ? "Yes" : "No"}
                </button>
              </div>
              <div>
                <span className="font-bold mr-2">Banned:</span>
                <button
                  onClick={() => updateStatus(!status)}
                  className={`px-4 py-1 rounded-full text-white font-bold text-sm ${!status ? 'bg-green-500' : 'bg-red-500'} hover:opacity-90`}
                >
                  {!status ? "Yes" : "No"}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-gray-600">Available Balance:</p>
            <h3 className="text-3xl font-bold text-gray-800">
              ₹{formatBalance(userData.walletBalance)}
            </h3>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => openModal("add")}
              className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Add Fund
            </button>
            <button
              onClick={() => openModal("withdraw")}
              className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
            >
              Withdraw Fund
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full bg-white rounded-lg shadow p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 text-sm">

            <div className="flex gap-2">
              <span className="font-semibold w-32">Mobile :</span>
              <span>{userData.phone}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold w-32">Password :</span>
              <span>{userPassword || "******"}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold w-32">Creation Date :</span>
              <span>
                {moment(userData.createdAt).format("DD MMM YYYY HH:mm:ss")}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold w-32">Last Login :</span>
              <span>
                {moment(userData.lastLogin).format("DD MMM YYYY HH:mm:ss")}
              </span>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

            {/* Total Deposit */}
            <div className="bg-green-500 text-white text-center py-3 rounded-md font-semibold">
              Total Deposit : {financialSummary.manualDepositAmount + financialSummary.autoDepositAmount || 0}
            </div>

            {/* Total Withdraw */}
            <div className="bg-red-500 text-white text-center py-3 rounded-md font-semibold">
              Total Withdraw : {financialSummary.manualWithdrawalAmount + financialSummary.autoWithdrawalAmount || 0}
            </div>

            {/* Total Bid */}
            <div className="bg-blue-500 text-white text-center py-3 rounded-md font-semibold">
              Total Bid : {financialSummary.totalBidPoints || 0}
            </div>

            {/* Total Winning */}
            <div className="bg-yellow-500 text-white text-center py-3 rounded-md font-semibold">
              Total Winning : {financialSummary.totalWinningAmount || 0}
            </div>

          </div>

        </div>

      </div>
      <div className="bg-white rounded-lg shadow p-5 mb-5 w-full">
        <h3 className="text-lg font-bold mb-4">Payment Information</h3>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3 text-sm">

          {/* Row 1 */}
          <div className="flex gap-2">
            <span className="font-semibold w-32">Bank Name :</span>
            <span>{userData.bank_details?.bank_name || "N/A"}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32">Branch Address :</span>
            <span>{userData.bank_details?.branch_address || "N/A"}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32">IFSC Code :</span>
            <span>{userData.bank_details?.ifsc_code || "N/A"}</span>
          </div>

          {/* Row 2 */}
          <div className="flex gap-2">
            <span className="font-semibold w-32">A/c Holder Name :</span>
            <span>{userData.userName}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32">A/c Number :</span>
            <span>{userData.bank_details?.account_number || "N/A"}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32"></span>
            <span></span>
          </div>

          {/* Row 3 */}
          <div className="flex gap-2">
            <span className="font-semibold w-32">PhonePe No. :</span>
            <span>{userData.upi_id?.phonepeUpi || "N/A"}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32">Google Pay No. :</span>
            <span>{userData.upi_id?.gpayUpi || "N/A"}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold w-32">Paytm No. :</span>
            <span>{userData.upi_id?.paytmUpi || "N/A"}</span>
          </div>

        </div>
      </div>

      {/* Fund Credit (Admin) */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Fund Credit (Admin)
          </h3>
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>
        <Table columns={adminDepositColumns} data={adminDepositTransactions} />
      </div>

      {/* Fund Credit (Auto) */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Fund Credit (Auto)
          </h3>
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>
        <Table columns={autoDepositColumns} data={autoDepositTransactions} />
      </div>

      {/* Withdraw (Admin) - NEW */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Withdraw (Admin)
          </h3>
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>
        <Table columns={adminWithdrawalColumns} data={adminWithdrawalTransactions} />
      </div>

      {/* Withdraw (Auto) - NEW */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Withdraw (Auto)
          </h3>
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>
        <Table columns={autoWithdrawalColumns} data={autoWithdrawalTransactions} />
      </div>

      {/* Withdraw Fund Request List */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Withdraw Fund Request List
          </h3>
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
        </div>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded w-1/3 mb-4"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table columns={withdrawColumns} data={withdrawData} />
      </div>

      {/* Bid History Component */}
      <BidHistory userId={userId} />

      {/* Winning History Component */}
      <div className="mt-6">
        <WinningHistory userId={userId} />
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {actionType === "add" ? "Add Fund" : "Withdraw Fund"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 px-3 py-2 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500'} text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;