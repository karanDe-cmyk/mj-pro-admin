import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
    Button,
    Card,
    Form,
    Table,
    Modal,
    message,
    Typography,
    Input,
    Alert,
    Badge,
    Divider,
    Space,
    Tooltip
} from 'antd';
import {
    SendOutlined,
    CloseOutlined,
    NotificationOutlined,
    CheckOutlined,
    UserOutlined,
    EyeInvisibleOutlined,
    EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const NotificationSender = () => {
    const [form] = Form.useForm();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [showFullTokens, setShowFullTokens] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const toggleTokenVisibility = (id) => {
        setShowFullTokens(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Fetch all FCM tokens from your backend
    useEffect(() => {
        const fetchTokens = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/notification/fcm-tokens');
                setTokens(response.data);
            } catch (error) {
                message.error('Failed to fetch tokens');
                console.error('Error fetching tokens:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    const columns = [
        {
            title: (
                <input
                    type="checkbox"
                    checked={selectedRowKeys.length > 0 && selectedRowKeys.length === tokens.length}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRowKeys(tokens.map(token => token._id));
                            setSelectedTokens(tokens);
                        } else {
                            setSelectedRowKeys([]);
                            setSelectedTokens([]);
                        }
                    }}
                />
            ),
            dataIndex: 'selectAll',
            width: 80,
            render: (_, record) => (
                <input
                    type="checkbox"
                    checked={selectedRowKeys.includes(record._id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRowKeys([...selectedRowKeys, record._id]);
                            setSelectedTokens([...selectedTokens, record]);
                        } else {
                            setSelectedRowKeys(selectedRowKeys.filter(id => id !== record._id));
                            setSelectedTokens(selectedTokens.filter(token => token._id !== record._id));
                        }
                    }}
                />
            ),
        },
        {
            title: 'Token',
            dataIndex: 'token',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={showFullTokens[record._id] ? 'Hide full token' : 'Click to reveal'}>
                        <Text code style={{ cursor: 'pointer' }} onClick={() => toggleTokenVisibility(record._id)}>
                            {showFullTokens[record._id] ? text : `${text.substring(0, 8)}...${text.substring(text.length - 4)}`}
                        </Text>
                    </Tooltip>
                    <Button
                        type="text"
                        icon={showFullTokens[record._id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => toggleTokenVisibility(record._id)}
                        size="small"
                    />
                </div>
            ),
        },
        {
            title: 'User',
            dataIndex: 'user',
            render: (_, record) => (
                <Space>
                    <UserOutlined />
                    <Text>{record.user?.name || 'Anonymous'}</Text>
                </Space>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    const handleSelectToken = (e, token) => {
        if (e.target.checked) {
            setSelectedTokens([...selectedTokens, token]);
        } else {
            setSelectedTokens(selectedTokens.filter(t => t._id !== token._id));
        }
    };

    const showModal = () => {
        if (selectedTokens.length === 0) {
            message.warning('Please select at least one token');
            return;
        }
        setIsModalVisible(true);
    };

    const handlePreview = () => {
        const values = form.getFieldsValue();
        if (!values.title || !values.body) {
            message.warning('Please fill in both title and body');
            return;
        }
        setPreview(values);
    };

    const handleSendNotification = async (values) => {
        setNotificationLoading(true);
        try {
            const response = await axiosInstance.post('/api/notification/send', {
                tokens: selectedTokens.map(t => t.token),
                title: values.title,
                body: values.body,
                // Add any additional data you want to send
                data: {
                    click_action: values.url || null,
                    icon: values.icon || null
                }
            });

            message.success(
                <span>
                    Notification sent successfully to <Badge count={selectedTokens.length} style={{ backgroundColor: '#52c41a' }} />
                </span>
            );
            form.resetFields();
            setPreview(null);
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to send notification');
            console.error('Error sending notification:', error);
        } finally {
            setNotificationLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={
                    <Space>
                        <NotificationOutlined />
                        <Text strong>Push Notifications</Text>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={showModal}
                        disabled={selectedTokens.length === 0}
                    >
                        Send to Selected ({selectedTokens.length})
                    </Button>
                }
                bordered={false}
            >
                <Table
                    columns={columns}
                    dataSource={tokens}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectedTokens(selectedRows);
                        },
                        onSelectAll: (selected, selectedRows, changeRows) => {
                            if (selected) {
                                // Add all current page rows to selection
                                const newSelectedKeys = [...new Set([...selectedRowKeys, ...selectedRows.map(row => row._id)])];
                                setSelectedRowKeys(newSelectedKeys);
                                setSelectedTokens([...new Set([...selectedTokens, ...selectedRows])]);
                            } else {
                                // Remove all current page rows from selection
                                const pageRowIds = selectedRows.map(row => row._id);
                                const newSelectedKeys = selectedRowKeys.filter(key => !pageRowIds.includes(key));
                                const newSelectedTokens = selectedTokens.filter(token => !pageRowIds.includes(token._id));
                                setSelectedRowKeys(newSelectedKeys);
                                setSelectedTokens(newSelectedTokens);
                            }
                        },
                    }}

                    scroll={{ x: true }}
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <NotificationOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Compose Notification</Text>
                    </Space>
                }
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setPreview(null);
                }}
                footer={null}
                width={800}
                centered
                destroyOnClose
            >
                {preview ? (
                    <div>
                        <Alert
                            message="Notification Preview"
                            description={
                                <div style={{ marginTop: 16 }}>
                                    <Title level={5}>{preview.title}</Title>
                                    <Text>{preview.body}</Text>
                                    {preview.url && (
                                        <div style={{ marginTop: 8 }}>
                                            <Text type="secondary">URL: </Text>
                                            <Text code>{preview.url}</Text>
                                        </div>
                                    )}
                                </div>
                            }
                            type="info"
                            showIcon
                        />
                        <Divider />
                        <Text strong>Recipients: </Text>
                        <Badge count={selectedTokens.length} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                        <Divider />
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                onClick={() => setPreview(null)}
                                style={{ marginRight: 8 }}
                                icon={<CloseOutlined />}
                            >
                                Back to Edit
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleSendNotification(preview)}
                                loading={notificationLoading}
                                icon={<CheckOutlined />}
                            >
                                Confirm & Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handlePreview}
                    >
                        <Form.Item
                            label="Notification Title"
                            name="title"
                            rules={[{ required: true, message: 'Please input the title!' }]}
                        >
                            <Input
                                placeholder="Enter notification title"
                                maxLength={100}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            label="Notification Message"
                            name="body"
                            rules={[{ required: true, message: 'Please input the message!' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter detailed message"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            label="Deep Link URL (Optional)"
                            name="url"
                            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                        >
                            <Input
                                placeholder="https://example.com"
                                addonBefore="URL"
                            />
                        </Form.Item>

                        <Divider />

                        <Alert
                            message={`This notification will be sent to ${selectedTokens.length} device(s)`}
                            type="info"
                            showIcon
                        />

                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Button
                                onClick={() => {
                                    setIsModalVisible(false);
                                    form.resetFields();
                                }}
                                style={{ marginRight: 8 }}
                                icon={<CloseOutlined />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                            >
                                Preview Notification
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default NotificationSender;