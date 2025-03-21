import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Avatar } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import instance from "../utils/axiosInstance";

import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Prevent logged-in users from accessing login page
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await instance.post(`/api/auth/adminLogin`, values);

      if (response && response.data) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("isAuthenticated", "true");

          dispatch(login({ token })); // 🔹 Dispatch login action
          toast.success("Login successful!");

          // Delay navigation for 1 second to allow toast to be visible
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          console.error("No token received in API response.");
          toast.error("Login failed. No token received.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Invalid credentials. Please try again."
        );
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3}>Welcome Back!</Title>
        <Text type="secondary">Sign in to continue to Admin Console.</Text>

        <div style={styles.avatarContainer}>
          <Avatar size={60} src="https://via.placeholder.com/50" />
          <Title level={4} style={{ marginTop: 10 }}>
            Jannat Admin
          </Title>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ username: "", password: "" }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};

// 🔹 Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  card: {
    width: 400,
    textAlign: "center",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    margin: "20px 0",
  },
};

export default Login;
