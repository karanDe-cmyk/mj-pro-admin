import React from "react";
import { Modal, Form, Input, Switch, Select, Button, TimePicker, Row, Col, Card } from "antd";
import moment from "moment";

const EditModal = ({ gameData, onChange, onSave, onClose }) => {
  const [form] = Form.useForm();

  // Populate form when opening modal
  React.useEffect(() => {
    if (gameData) {
      form.setFieldsValue({
        market_name: gameData.market_name,
        open_time: gameData.open_time,
        close_time: gameData.close_time,
        openActivity: gameData.openActivity,
        market_type: gameData.market_type,
        weekends: gameData.weekends.map((day) => ({
          ...day,
          openTime: day.openTime ? moment(day.openTime, "hh:mm A") : null,
          closeTime: day.closeTime ? moment(day.closeTime, "hh:mm A") : null,
          is_on: day.is_on,
        })),
      });
    }
  }, [gameData, form]);

  return (
    <Modal
      title="Edit Market Game"
      visible={!!gameData}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => onSave(values));
          }}
        >
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Market Name" name="market_name">
          <Input onChange={onChange} />
        </Form.Item>
        <Form.Item label="Market Type" name="market_type">
          <Select onChange={onChange}>
            <Select.Option value="Main">Main</Select.Option>
            <Select.Option value="Starline">Starline</Select.Option>
            <Select.Option value="King Jackpot">King Jackpot</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Open Time" name="open_time">
          <Input type="time" onChange={onChange} />
        </Form.Item>
        <Form.Item label="Close Time" name="close_time">
          <Input type="time" onChange={onChange} />
        </Form.Item>
        <Form.Item label="Market Status" name="openActivity" valuePropName="checked">
          <Switch onChange={onChange} />
        </Form.Item>
        <div>
          <h3>Weekend Settings</h3>
          <Row gutter={[16, 16]}>
            {form.getFieldValue("weekends") &&
              form.getFieldValue("weekends").map((day, index) => (
                <Col span={12} key={day.day}>
                  <Card size="small" title={day.day}>
                    <Form.Item name={["weekends", index, "openTime"]} label="Open Time" rules={[{ required: true }]}>
                      <TimePicker format="hh:mm A" use12Hours onChange={onChange} />
                    </Form.Item>
                    <Form.Item name={["weekends", index, "closeTime"]} label="Close Time" rules={[{ required: true }]}>
                      <TimePicker format="hh:mm A" use12Hours onChange={onChange} />
                    </Form.Item>
                    <Form.Item name={["weekends", index, "is_on"]} label="Enable Day" valuePropName="checked">
                      <Switch onChange={onChange} />
                    </Form.Item>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
