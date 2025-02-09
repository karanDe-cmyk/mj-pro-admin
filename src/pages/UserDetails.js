import React, { useState } from "react";
import { Card, Typography, Row, Col, Button, Badge, Table, Select, Tabs, Tag, } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const UserDetails = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handleWhatsAppClick = () => {
        window.open("https://wa.me/8741073179", "_blank");
    };

    const handleEntriesChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1); // Reset to first page when page size changes
    };



    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setCurrentPage(1); // Reset to first page when switching tabs
    };


    const withdrawColumns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Request Amount",
            dataIndex: "requestAmount",
            key: "requestAmount",
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
        },
        {
            title: "Request Date",
            dataIndex: "requestDate",
            key: "requestDate",
        },
        {
            title: "Request No.",
            dataIndex: "requestNo",
            key: "requestNo",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
        },
    ];

    const bidHistoryColumns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Game Name",
            dataIndex: "gameName",
            key: "gameName",
        },
        {
            title: "Game Type",
            dataIndex: "gameType",
            key: "gameType",
        },
        {
            title: "Session",
            dataIndex: "session",
            key: "session",
        },
        {
            title: "Digits",
            dataIndex: "digits",
            key: "digits",
        },
        {
            title: "Close Digits",
            dataIndex: "closeDigits",
            key: "closeDigits",
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
    ];

    const walletHistoryColumns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
            render: (text) => (
                <Tag color={text === "Money Added" ? "green" : "red"}>{text}</Tag>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Tx Req. No.",
            dataIndex: "txRequestNo",
            key: "txRequestNo",
            render: (text) => <span style={{ color: "red" }}>{text}</span>,
        },
    ];

    const transactionHistoryColumns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tx Req. No.",
            dataIndex: "txRequestNo",
            key: "txRequestNo",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
        },
    ];

    const walletHistoryData = [
        {
            id: 1,
            amount: "500",
            transactionType: "Money Added",
            date: "2025-02-07 09:55",
            txRequestNo: "67a63402e983f",
        },
        {
            id: 2,
            amount: "500",
            transactionType: "Money Added",
            date: "2025-02-08 02:03",
            txRequestNo: "67a716c812b20",
        },
    ];
    const filteredData = activeTab === "winning"
        ? walletHistoryData.filter((item) => item.transactionType === "Money Added")
        : walletHistoryData;

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, filteredData.length);

    const transactionHistoryData = [
        {
            id: 1,
            txRequestNo: "67a63402e983f",
            amount: "500",
            transactionType: "Money Added",
        },
    ];

    //   const data = [];
    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Request Amount",
            dataIndex: "requestAmount",
            key: "requestAmount",
        },
        {
            title: "Request No.",
            dataIndex: "requestNo",
            key: "requestNo",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    const data = []; // Add your table data here

    return (
        <div style={{ padding: "20px" }}>
            {/* USER DETAILS Header */}
            <Title level={3} style={{ marginBottom: "20px" }}>
                USER DETAILS
            </Title>

            {/* Main Row */}
            <Row gutter={[16, 16]}>
                {/* Left Column */}
                <Col xs={24} md={10}>
                    <Card >
                        <Row>
                            <Col span={24} >
                                <Row justify="space-between" style={{ backgroundColor: "#b7b6d9", padding: '20px' }} align="middle">
                                    <Col >
                                        <Title level={5} style={{ marginBottom: "5px" }}>
                                            Rasid
                                        </Title>
                                        <Text>
                                            <PhoneOutlined /> 8741073179 &nbsp;
                                            <WhatsAppOutlined
                                                style={{ color: "green", cursor: "pointer" }}
                                                onClick={handleWhatsAppClick}
                                            />
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Text>
                                            Active: <Badge status="success" text="Yes" />
                                        </Text>
                                        <br />
                                        <Text>
                                            Banned: <Badge status="error" text="No" />
                                        </Text>
                                    </Col>
                                </Row>
                                <div style={{ marginTop: "20px" }}>
                                    <Text>Available Balance: </Text>
                                    <Title level={3}>1</Title>
                                </div>
                                <Row gutter={16} justify="space-evenly" style={{ marginTop: "10px" }} >
                                    <Col span={10}>
                                        <Button
                                            type="primary"
                                            block
                                            style={{ backgroundColor: "green", borderColor: "green" }}
                                        >
                                            Add Fund
                                        </Button>
                                    </Col>
                                    <Col span={10}>
                                        <Button
                                            type="primary"
                                            block
                                            style={{ backgroundColor: "red", borderColor: "red" }}
                                        >
                                            Withdraw Fund
                                        </Button>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={14}>
                    <Card>
                        <Row>
                            <Col span={24}>
                                <Title level={5}>Personal Information</Title>
                                <Row justify="space-between" gutter={[0, 10]} style={{ marginTop: "10px" }}>
                                    <Col span={12}>
                                        <Text strong>Full Name:</Text> <Text>Rasid</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Mobile:</Text> <Text>8741073179</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Security Pin:</Text> <Text>1122</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Password:</Text> <Text>123456</Text>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{ marginTop: "20px" }}>
                                <Title level={5}>Payment Information</Title>
                                <Row gutter={[0, 10]} style={{ marginTop: "10px" }}>
                                    <Col span={12}>
                                        <Text strong>Bank Name:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>A/c Holder Name:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>A/c Number:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>IFSC Code:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>PhonePe No.:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Google Pay No.:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Paytm No.:</Text>{" "}
                                        <span style={{ marginLeft: "20px" }}>
                                            <Text>N/A</Text>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Add Fund Request List */}
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col span={24}>
                    <Card>
                        <Title level={5}>Add Fund Request List</Title>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Col>
            </Row>
            <div style={{ padding: "20px" }}>
                {/* Withdraw Fund Request List */}
                <Card style={{ marginBottom: "20px" }}>
                    <Row justify="space-between" align="middle">
                        <Title level={5}>Withdraw Fund Request List</Title>
                        <div>
                            Show{" "}
                            <Select
                                defaultValue="10"
                                style={{ width: 80 }}
                                onChange={handleEntriesChange}
                            >
                                <Option value="10">10</Option>
                                <Option value="25">25</Option>
                                <Option value="50">50</Option>
                            </Select>{" "}
                            entries
                        </div>
                    </Row>
                    <Table
                        columns={withdrawColumns}
                        dataSource={data}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                {/* Bid History */}
                <Card style={{ marginBottom: "20px" }}>
                    <Row justify="space-between" align="middle">
                        <Title level={5}>Bid History</Title>
                        <div>
                            Show{" "}
                            <Select
                                defaultValue="10"
                                style={{ width: 80 }}
                                onChange={handleEntriesChange}
                            >
                                <Option value="10">10</Option>
                                <Option value="25">25</Option>
                                <Option value="50">50</Option>
                            </Select>{" "}
                            entries
                        </div>
                    </Row>
                    <Table
                        columns={bidHistoryColumns}
                        dataSource={data}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                {/* Wallet Transaction History */}
                <div style={{ padding: "20px" }}>
                    {/* Wallet Transaction History with Tabs */}
                    <Card style={{ marginBottom: "20px" }}>
                        <Tabs defaultActiveKey="all" onChange={handleTabChange}>
                            <TabPane tab="All" key="all">
                                <Row justify="space-between" align="middle">
                                    <Title level={5}>Wallet Transaction History</Title>
                                    <div>
                                        Show{" "}
                                        <Select defaultValue="10" style={{ width: 80 }} onChange={handleEntriesChange}>
                                            <Option value="10">10</Option>
                                            <Option value="25">25</Option>
                                            <Option value="50">50</Option>
                                        </Select>{" "}
                                        entries
                                    </div>
                                </Row>
                                <Table
                                    columns={walletHistoryColumns}
                                    dataSource={filteredData.slice(startIndex - 1, endIndex)}
                                    pagination={{
                                        current: currentPage,
                                        pageSize,
                                        total: filteredData.length,
                                        onChange: handlePaginationChange,
                                    }}
                                />
                                <div style={{ marginTop: "10px", textAlign: "right" }}>
                                    {`Showing ${startIndex} to ${endIndex} of ${filteredData.length} entries`}
                                </div>
                            </TabPane>
                            <TabPane tab="Winning History" key="winning">
                                <Row justify="space-between" align="middle">
                                    <Title level={5}>Winning History</Title>
                                </Row>
                                <Table
                                    columns={walletHistoryColumns}
                                    dataSource={filteredData.slice(startIndex - 1, endIndex)}
                                    pagination={{
                                        current: currentPage,
                                        pageSize,
                                        total: filteredData.length,
                                        onChange: handlePaginationChange,
                                    }}
                                />
                                <div style={{ marginTop: "10px", textAlign: "right" }}>
                                    {`Showing ${startIndex} to ${endIndex} of ${filteredData.length} entries`}
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                    {/* Wallet Transaction History */}
                    <Card>
                        <Title level={5}>Wallet Transaction History</Title>
                        <Table
                            columns={transactionHistoryColumns}
                            dataSource={transactionHistoryData}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default UserDetails;
