import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import instance from "../utils/axiosInstance";
import logoImage from "../images/kalyan257.jpeg";
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
    const token = localStorage.getItem("accessToken");
    
    if (isAuthenticated === "true" && token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await instance.post(`/api/auth/adminLogin`, values);

      if (response && response.data) {
        handleSuccessfulLogin(response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        toast.error(
          error.response.data.error ||
          error.response.data.message ||
          "Invalid credentials. Please try again."
        );
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
    setLoading(false);
  };

  const handleSuccessfulLogin = (data) => {
    const token = data.token;
    if (token) {
      // Store token and authentication status
      localStorage.setItem("accessToken", token);
      localStorage.setItem("isAuthenticated", "true");
      
      // Store additional user data if needed
      if (data.type) {
        localStorage.setItem("userType", data.type);
      }
      if (data.appId) {
        localStorage.setItem("appId", data.appId);
      }

      // Dispatch to Redux store
      dispatch(login({ 
        token, 
        userType: data.type,
        appId: data.appId 
      }));
      
      toast.success("Login successful!");
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } else {
      console.error("No token received in API response.");
      toast.error("Login failed. No token received.");
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3}>Welcome Back!</Title>
        <Text type="secondary">Sign in to continue to Admin Console.</Text>

        <div style={styles.avatarContainer} className="flex flex-col items-center">
          <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-gray-200">
            <img
              src={logoImage}
              className="w-full h-full object-cover"
              alt="Admin Avatar"
            />
          </div>
          <Title level={4} className="mt-2.5">
            Admin Panel
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
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
            >
              Log In
            </Button>
          </Form.Item>

          {/* Optional: Add remember me or forgot password */}
          <Form.Item>
            <Row justify="space-between">
              <Col>
                {/* Add "Remember me" checkbox if needed */}
              </Col>
              <Col>
                {/* Add "Forgot password" link if needed */}
              </Col>
            </Row>
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
    maxWidth: "90%",
    textAlign: "center",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    margin: "20px 0"
  },
};

export default Login;