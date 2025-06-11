import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Form, Card, Typography, message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

const { Title } = Typography;

const GameRates = () => {
  // State for both rate and value fields.
  const [singleDigit, setSingleDigit] = useState("");
  const [singleDigitValue, setSingleDigitValue] = useState("");
  const [jodiDigit, setJodiDigit] = useState("");
  const [jodiDigitValue, setJodiDigitValue] = useState("");
  const [rateId, setRateId] = useState(""); // to store the document's ID
  const [loading, setLoading] = useState(false);

  // Function to fetch bet rates from GET API.
  const fetchBetRates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/jackpotRate/getBetRates");
      // Assuming response.data includes _id, singleDigit, singleDigitValue, jodiDigit, jodiDigitValue
      const { _id, singleDigit, singleDigitValue, jodiDigit, jodiDigitValue } = response.data;
      setRateId(_id);
      setSingleDigit(singleDigit);
      setSingleDigitValue(singleDigitValue);
      setJodiDigit(jodiDigit);
      setJodiDigitValue(jodiDigitValue);
    } catch (error) {
      console.error("Error fetching bet rates:", error);
      message.error("Error fetching bet rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBetRates();
  }, []);

  // Handler for updating bet rates via the update API.
  const handleSubmit = async () => {
    try {
      const payload = {
        singleDigit,
        singleDigitValue,
        jodiDigit,
        jodiDigitValue,
      };
      const response = await axiosInstance.put(`/api/jackpotRate/jackpotupdateBetRates/${rateId}`, payload);
      if (response.data.message === "Bet rates updated successfully!") {
        message.success("Rates updated successfully");
        alert("Rates updated successfully");
      } else {
        message.info(response.data.message || "Update completed");
      }
      // Refresh the rates after update
      fetchBetRates();
    } catch (error) {
      console.error("Error updating rates:", error);
      message.error("Error updating rates");
    }
  };
  // const handleSubmit = async () => {
  //   try {
  //     const payload = {
  //       singleDigit,
  //       singleDigitValue,
  //       jodiDigit,
  //       jodiDigitValue,
  //     };
  
  //     const response = await axiosInstance.post("/api/jackpotRate/jackpotaddrate", payload);

  
  //     if (response.data.message === "Bet rates added successfully!") {
  //       message.success("Rates added successfully");
  //       alert("Rates added successfully");
  //     } else {
  //       message.info(response.data.message || "Submission completed");
  //     }
  
  //     // Refresh or reset form (if needed)
  //     fetchBetRates(); // Optional: reload rates if you're showing them
  //   } catch (error) {
  //     console.error("Error submitting rates:", error);
  //     message.error("Error submitting rates");
  //   }
  // };
  return (
    <div
      style={{
        width: "100%",
        background: "#f0f2f5",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Games Rates
        </Title>
        <Card
          bordered={false}
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#28A745",
              padding: "15px 20px",
            }}
          >
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              Game Rates
            </Title>
          </div>
          <Card bordered={false} style={{ padding: "20px" }}>
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                {/* Single Digit Row: Two Columns */}
                <Col xs={24} sm={12}>
                  <Form.Item label="Single Digit (Rate)">
                    <Input
                      value={singleDigit}
                      onChange={(e) => setSingleDigit(e.target.value)}
                      placeholder="Enter Single Digit Rate"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Single Digit (Value)">
                    <Input
                      addonBefore="₹"
                      value={singleDigitValue}
                      onChange={(e) => setSingleDigitValue(e.target.value)}
                      placeholder="Enter Single Digit Value"
                    />
                  </Form.Item>
                </Col>
                {/* Jodi Digit Row: Two Columns */}
                <Col xs={24} sm={12}>
                  <Form.Item label="Jodi Digit (Rate)">
                    <Input
                      value={jodiDigit}
                      onChange={(e) => setJodiDigit(e.target.value)}
                      placeholder="Enter Jodi Digit Rate"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Jodi Digit (Value)">
                    <Input
                      addonBefore="₹"
                      value={jodiDigitValue}
                      onChange={(e) => setJodiDigitValue(e.target.value)}
                      placeholder="Enter Jodi Digit Value"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div
            style={{
              backgroundColor: "#F7F7F7",
              padding: "15px 20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Update
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameRates;