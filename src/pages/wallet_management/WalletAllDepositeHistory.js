import React, { useState } from "react";
import { Table, Button, Input, Card, Space, Select } from "antd";

const { Option } = Select;

const WalletAllDepositeHistory = () => {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([
        { key: "1", id: 1, memberName: "Mksingh", memberMobile: "9329534194", transactionId: "67aebc98a34a", amount: 1000, dateTime: "2025-02-14 09:16", status: "Pending" },
        { key: "2", id: 2, memberName: "Mksingh", memberMobile: "9329534194", transactionId: "67aeb87dc4446", amount: 2000, dateTime: "2025-02-14 08:59", status: "Pending" },
        { key: "3", id: 3, memberName: "7023600274", memberMobile: "7023600274", transactionId: "67aace08aef95", amount: 1000, dateTime: "2025-02-11 09:41", status: "Accepted" },
        { key: "4", id: 4, memberName: "7023600274", memberMobile: "7023600274", transactionId: "67aace2774d1", amount: 1000, dateTime: "2025-02-11 09:36", status: "Canceled" },
        { key: "5", id: 5, memberName: "7023600274", memberMobile: "7023600274", transactionId: "67aacb7910d38", amount: 1000, dateTime: "2025-02-11 09:30", status: "Pending" },
    ]);

    // Accept function
    const handleAccept = (key) => {
        setData((prevData) =>
            prevData.map((item) => (item.key === key ? { ...item, status: "Accepted" } : item))
        );
    };

    // Cancel function
    const handleCancel = (key) => {
        setData((prevData) =>
            prevData.map((item) => (item.key === key ? { ...item, status: "Canceled" } : item))
        );
    };

    // Columns
    const columns = [
        { title: "Id", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
        { title: "Member Name", dataIndex: "memberName", key: "memberName", render: (text) => <a>{text}</a> },
        { title: "Member Mobile", dataIndex: "memberMobile", key: "memberMobile" },
        { title: "Transaction Id", dataIndex: "transactionId", key: "transactionId" },
        { title: "Amount", dataIndex: "amount", key: "amount", sorter: (a, b) => a.amount - b.amount },
        { title: "Date Time", dataIndex: "dateTime", key: "dateTime" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                if (status === "Pending") {
                    return (
                        <div >
                            <Button
                                type="primary"
                                block
                                onClick={() => handleAccept(record.key)}
                                style={{ backgroundColor: "blue", color: "white", fontWeight: "bold", marginBottom: '4px' }}
                            >
                                Accept
                            </Button>
                            <Button
                                block
                                danger
                                onClick={() => handleCancel(record.key)}
                                style={{ fontWeight: "bold" }}
                            >
                                Cancel
                            </Button>
                        </div>
                    );
                } else {
                    let color = status === "Accepted" ? "green" : "orange";
                    return (
                        <Button
                            block
                            disabled
                            style={{
                                backgroundColor: color,
                                color: "white",
                                fontWeight: "bold",
                                cursor: "not-allowed",
                            }}
                        >
                            {status}
                        </Button>
                    );
                }
            },
        },
    ];

    // Sorting pending records to the top
    const sortedData = [...data].sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return 0;
    });

    return (
        <Card title="All Fund Request List">
            {/* Search and Filters */}
            <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                <Input
                    placeholder="Search Member Name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
                <Select
                    placeholder="Filter Status"
                    allowClear
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: 150 }}
                >
                    <Option value="">All</Option> {/* Show all records */}
                    <Option value="Pending">Pending</Option>
               
                   
                    <Option value="Accepted">Accepted</Option>
                    <Option value="Canceled">Canceled</Option>
                </Select>

                <Select defaultValue={10} onChange={(value) => setPageSize(value)} style={{ width: 100 }}>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={30}>30</Option>
                    <Option value={40}>40</Option>
                    <Option value={50}>50</Option>
                </Select>
            </Space>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={sortedData.filter(
                    (item) =>
                        item.memberName.toLowerCase().includes(searchText.toLowerCase()) &&
                        (!statusFilter || item.status === statusFilter)
                )}
                pagination={{ pageSize: pageSize }}
                rowKey="id"
                scroll={{ x: 800 }} // Enables horizontal scroll on mobile
            />
        </Card>
    );
};

export default WalletAllDepositeHistory;
