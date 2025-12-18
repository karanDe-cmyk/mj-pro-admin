import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Avatar, Row, Col } from "antd";
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import instance from "../utils/axiosInstance";
import logoImage from "../images/kalyan257.jpeg"
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [userId, setUserId] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Prevent logged-in users from accessing login page
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await instance.post(`/api/auth/adminLogin`, values);

      if (response && response.data) {
        if (response.data.requiresOtp) {
          setUserId(response.data.userId);
          setStep("otp");
          setCountdown(60); // 60 seconds countdown
          toast.success("OTP sent to your registered email!");
        } else {
          // Handle direct login (if OTP is disabled)
          handleSuccessfulLogin(response.data);
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

  const handleOtpVerification = async (values) => {
    setOtpLoading(true);
    try {
      const response = await instance.post(`/api/auth/verifyOtp`, {
        userId: userId,
        otp: values.otp
      });

      if (response && response.data) {
        handleSuccessfulLogin(response.data);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
          "Invalid OTP. Please try again."
        );
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
    setOtpLoading(false);
  };

  const handleSuccessfulLogin = (data) => {
    const token = data.token;
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("isAuthenticated", "true");

      dispatch(login({ token }));
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } else {
      console.error("No token received in API response.");
      toast.error("Login failed. No token received.");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setOtpLoading(true);
    try {
      // You might need to create a separate endpoint for resending OTP
      // For now, we'll reuse the login endpoint
      const response = await instance.post(`/api/auth/resendOtp`, { userId });
      
      if (response && response.data) {
        setCountdown(60);
        toast.success("New OTP sent to your email!");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
    setOtpLoading(false);
  };

  const goBackToLogin = () => {
    setStep("login");
    setUserId(null);
    setCountdown(0);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        {step === "login" ? (
          <>
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
          </>
        ) : (
          <>
            <Title level={3}>Verify OTP</Title>
            <Text type="secondary">Enter the OTP sent to your registered email</Text>

            <div style={styles.avatarContainer} className="flex flex-col items-center">
              <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <Title level={4} className="mt-2.5">
                OTP Verification
              </Title>
            </div>

            <Form
              layout="vertical"
              onFinish={handleOtpVerification}
            >
              <Form.Item
                name="otp"
                label="One-Time Password"
                rules={[
                  { required: true, message: "Please enter the OTP" },
                  { len: 6, message: "OTP must be 6 digits" }
                ]}
              >
                <Input.OTP length={6} />
              </Form.Item>

              <Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button onClick={goBackToLogin} block>
                      Back
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={otpLoading} 
                      block
                    >
                      Verify OTP
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="link" 
                  onClick={handleResendOtp} 
                  disabled={countdown > 0}
                  block
                >
                  {countdown > 0 
                    ? `Resend OTP in ${countdown}s` 
                    : "Resend OTP"
                  }
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
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
    margin: "20px 0"
  },
};

export default Login;
