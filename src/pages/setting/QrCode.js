import React, { useState } from "react";
import { Card, Table, Input, Button, Select, Image, Drawer, Upload, message, Form } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { Search } = Input;

const QrCode = () => {
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sliderImages, setSliderImages] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/80", // Sample Image
      upiId: "user@upi",
      status: "Active",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/80", // Sample Image
      upiId: "test@upi",
      status: "Inactive",
    },
  ]);

  const [filteredData, setFilteredData] = useState(sliderImages);
  const [form] = Form.useForm();

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = sliderImages.filter((item) =>
      item.upiId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
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

  const handleDelete = (id) => {
    const updatedData = sliderImages.filter((item) => item.id !== id);
    setSliderImages(updatedData);
    setFilteredData(updatedData);
    message.success("QR Code Deleted Successfully");
  };

  const handleFormSubmit = (values) => {
    if (!values.image || values.image.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const file = values.image[0].originFileObj;
    const imageUrl = URL.createObjectURL(file);

    const newImage = {
      id: sliderImages.length + 1,
      image: imageUrl,
      upiId: values.upiId,
      status: "Active",
    };

    const updatedData = [...sliderImages, newImage];
    setSliderImages(updatedData);
    setFilteredData(updatedData);
    message.success("QR Code Added Successfully");
    closeDrawer();
  };

  const columns = [
    { title: "#", dataIndex: "id", key: "id", width: 50 },
    {
      title: "QR Image",
      dataIndex: "image",
      key: "image",
      render: (imgSrc) => <Image src={imgSrc} width={80} height={50} style={{ borderRadius: 5 }} />,
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
    <Card className="max-w-6xl mx-auto p-6 shadow-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">QR Code Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Add QR Code Image
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <Select value={pageSize} onChange={handlePageSizeChange} className="w-20">
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={20}>20</Select.Option>
            <Select.Option value={50}>50</Select.Option>
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

      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize }} bordered />

      {/* Drawer for Adding QR Code */}
      <Drawer title="Add QR Code" width={400} onClose={closeDrawer} open={drawerVisible}>
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="image"
            label="QR Code Image (Allow Only .jpeg, .jpg, .png)"
            rules={[{ required: true, message: "Please upload an image!" }]}
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
    </Card>
  );
};

export default QrCode;