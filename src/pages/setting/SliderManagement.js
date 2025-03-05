import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Assuming you have an axios instance
import {
  Card,
  Table,
  Button,
  Select,
  Image,
  Drawer,
  Upload,
  message,
  Form,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const SliderManagement = () => {
  const [pageSize, setPageSize] = useState(10);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 🔹 Fetch Slider Images from API
  const fetchSliderImages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/settings/sliderimage/");
      setSliderImages(
        response.data.map((item) => ({
          ...item,
          key: item._id,
          status: "Active",
        }))
      );
    } catch (error) {
      message.error("Failed to fetch slider images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliderImages();
  }, []);

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

  // 🔹 Delete Image from API
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/settings/sliderimage/${id}`);
      message.success("Slider Image Deleted Successfully");
      fetchSliderImages(); // Refresh list after deletion
    } catch (error) {
      message.error("Failed to delete image.");
    }
  };

  // 🔹 Upload Image to API
  const handleFormSubmit = async (values) => {
    // console.log("Form Values:", values); // Debugging Log

    if (!values.image || values.image.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", values.image[0].originFileObj); // ✅ Use first file in array

    try {
      const response = await axiosInstance.post(
        "/api/settings/sliderimage/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success("Slider Image Added Successfully");
      fetchSliderImages(); // Refresh list after adding
      closeDrawer();
    } catch (error) {
      message.error("Failed to upload image.");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Slider Image",
      dataIndex: "image",
      key: "image",
      render: (imgSrc) => (
        <Image
          src={imgSrc}
          width={150}
          height={100}
          style={{ borderRadius: 10 }}
        /> // Increased Image Size
      ),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer", fontSize: 18 }}
          onClick={() => handleDelete(record._id)}
        />
      ),
    },
  ];

  return (
    <div >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Slider Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          Add Slider Image
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="w-20"
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
          <span className="ml-2">entries</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={sliderImages}
        pagination={{ pageSize }}
        loading={loading}
        bordered
        scroll={{ x: 1000 }}
      />

      {/* Drawer for Adding Slider Image */}
      <Drawer
        title="Add Slider Image"
        width={400}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="image"
            label="Slider Image (Allow Only .jpeg, .jpg, .png)"
            rules={[{ required: true, message: "Please upload an image!" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => (e && e.fileList ? e.fileList : [])} // ✅ Ensure fileList exists
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default SliderManagement;
