import React, { useState, useEffect } from "react";
import { Table, Input, Select, Card, Row, Typography } from "antd";
import instance from "../utils/axiosInstance";
import moment from "moment";

const { Option } = Select;
const { Title } = Typography;

const BidHistory = ({ userId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(10);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!userId) return;
        fetchBids();
    }, [userId]);

    const fetchBids = async () => {
        try {
            setLoading(true);
            const response = await instance.get(`/api/bid/bids/${userId}`);
            if (response.data.status) {
                formatData(response.data);
            } else {
                console.error("Failed to fetch bids.");
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatData = (responseData) => {
        // Combine all bid types
        const allBids = [
            ...responseData.mainMarketBids,
            ...responseData.starLineBids,
            ...responseData.jackpotBids,
            ...responseData.galidisawarBids,
        ];

        const formattedData = allBids.map((bid, index) => {
            // Handle different market types
            const isStarline = bid.market === "Starline";
            const isJackpot = bid.market === "Jackpot";
            const isGaliDisawar = bid.market === "Gali Disawar";

            let digitValue = "";
            let closeDigitValue = "";
            let sessionValue = "";
            let gameName = "";
            let gameType = "";

            // Set game name and type based on market
            if (isStarline) {
                gameName = bid.gamename;
                gameType = bid.gametype;
                digitValue = bid.digit;
            } else if (isJackpot) {
                gameName = bid.gamename;
                gameType = bid.gametype;
                digitValue = bid.digit;
            } else if (isGaliDisawar) {
                gameName = bid.gamename;
                gameType = bid.gametype;

                // Handle Gali Disawar specific digit format
                if (bid.gametype === "jodi_digit") {
                    digitValue = bid.pana;
                } else if (bid.gametype === "left_digit") {
                    digitValue = `Left: ${bid.leftdigit}`;
                } else if (bid.gametype === "right_digit") {
                    digitValue = `Right: ${bid.rightdigit}`;
                }
            } else {
                // Main Market
                gameName = bid.gameName || bid.gamename;
                gameType = bid.gameType || bid.gametype;

                if (bid.open) {
                    digitValue = bid.digit;
                    sessionValue = "Open";
                }
                if (bid.close) {
                    closeDigitValue = bid.digit;
                    sessionValue = "Close";
                }
                if (!bid.open && !bid.close) {
                    digitValue = bid.digit;
                }
            }

            return {
                key: index + 1,
                sNo: index + 1,
                gameName: gameName,
                market: bid.market,
                gameType: gameType,
                session: sessionValue || (isStarline || isJackpot || isGaliDisawar ? "━━━━" : "━━━━"),
                digit: digitValue || closeDigitValue,
                points: bid.points,
                date: moment(bid.createdAt).format("YYYY-MM-DD hh:mm:ss A"),
                reverted: bid.reverted || false,
            };
        });

        setData(formattedData);
    };

    const filteredData = data.filter((item) =>
        Object.values(item).some(
            (value) =>
                value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    const columns = [
        {
            title: "#",
            dataIndex: "sNo",
            key: "sNo",
            width: 50,
        },
        {
            title: "Market",
            dataIndex: "market",
            key: "market",
            width: 100,
        },
        {
            title: "Game Name",
            dataIndex: "gameName",
            key: "gameName",
            width: 120,
        },
        {
            title: "Game Type",
            dataIndex: "gameType",
            key: "gameType",
            width: 120,
        },
        {
            title: "Session",
            dataIndex: "session",
            key: "session",
            width: 80,
        },
        {
            title: "Digit/Pana",
            dataIndex: "digit",
            key: "digit",
            width: 100,
        },
        {
            title: "Points ₹",
            dataIndex: "points",
            key: "points",
            width: 80,
            render: (points) => (
                <span style={{ color: points > 0 ? '#1890ff' : '#cf1322' }}>
                    {points}
                </span>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
        },
        {
            title: "Status",
            dataIndex: "reverted",
            key: "reverted",
            width: 80,
            render: (reverted) => (
                <span style={{ color: reverted ? '#cf1322' : '#52c41a' }}>
                    {reverted ? 'Reverted' : 'Active'}
                </span>
            ),
        },
    ];

    return (
        <Card style={{ marginBottom: "20px" }}>
            <Row justify="space-between" align="middle">
                <Title level={5}>Bid History</Title>
                <div>
                    Show{" "}
                    <Select
                        value={entries.toString()}
                        style={{ width: 80 }}
                        onChange={(value) => setEntries(parseInt(value))}
                    >
                        <Option value="10">10</Option>
                        <Option value="25">25</Option>
                        <Option value="50">50</Option>
                        <Option value="100">100</Option>
                    </Select>{" "}
                    entries
                </div>
            </Row>

            <Input
                placeholder="Search by market, game, digit, etc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "16px", width: "30%" }}
                allowClear
            />

            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{
                    pageSize: entries,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} entries`
                }}
                loading={loading}
                rowKey="key"
                scroll={{ x: 1000 }}
                size="middle"
            />
        </Card>
    );
};

export default BidHistory;