import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Axios instance
import { Card, Table, Input, Button, Select, Image, Drawer, Upload, message, Form } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const QrCode = () => {
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 🔹 Fetch QR Codes from API
  const fetchQrCodes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/settings/qrcode");
      const formattedData = response.data.data.map(item => ({
        key: item._id,
        id: item._id,
        image: item.qrCodeImage,
        upiId: item.upiId,
        status: "Active",
      }));
      setQrCodes(formattedData);
    } catch (error) {
      message.error("Failed to fetch QR codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = qrCodes.filter((item) =>
      item.upiId.toLowerCase().includes(value.toLowerCase())
    );
    setQrCodes(filtered);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
  };

  // 🔹 Delete QR Code from API
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/settings/qrcode/${id}`);
      message.success("QR Code Deleted Successfully");
      fetchQrCodes(); // Refresh list after deletion
    } catch (error) {
      message.error("Failed to delete QR code.");
    }
  };

  // 🔹 Upload QR Code Image and UPI ID to API
  const handleFormSubmit = async (values) => {
    if (!values.qrImage || values.qrImage.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("qrImage", values.qrImage[0].originFileObj);
    formData.append("upiId", values.upiId);

    try {
      await axiosInstance.post("/api/settings/qrcode", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("QR Code Added Successfully");
      fetchQrCodes(); // Refresh list after adding
      closeDrawer();
    } catch (error) {
      message.error("Failed to upload QR code.");
    }
  };

  const columns = [
    { title: "#", dataIndex: "id", key: "id", width: 50, render: (_, __, index) => index + 1 },
    {
      title: "QR Image",
      dataIndex: "image",
      key: "image",
      render: (imgSrc) => (
        <Image src={imgSrc} width={150} height={100} style={{ borderRadius: 10 }} />
      ),
    },
    { title: "UPI ID", dataIndex: "upiId", key: "upiId" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer", fontSize: 18 }}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">QR Code</h2>
        <Button
  type="primary"
  icon={<PlusOutlined />}
  onClick={showDrawer}
  style={{ backgroundColor: "#556EE6", borderColor: "#556EE6" }}
>
  Add QR Code Image
</Button>

      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <Select value={pageSize} onChange={handlePageSizeChange} className="w-20">
          <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
          <span className="ml-2">entries</span>
        </div>

        <Search
          placeholder="Search by UPI ID"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          className="w-64"
        />
      </div>

      <Table
        columns={columns}
        dataSource={qrCodes}
        pagination={{ pageSize }}
        loading={loading}
        bordered
        scroll={{ x: 1000 }}
      />

      {/* Drawer for Adding QR Code */}
      <Drawer title="Add QR Code" width={400} onClose={closeDrawer} open={drawerVisible}>
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="qrImage"
            label="QR Code Image (Allow Only .jpeg, .jpg, .png)"
            rules={[{ required: true, message: "Please upload an image!" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList ? e.fileList : []}
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="upiId"
            label="Enter UPI ID"
            rules={[{ required: true, message: "Please enter UPI ID!" }]}
          >
            <Input placeholder="user@upi" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default QrCode;
