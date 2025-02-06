import React from "react";
import { Modal, Form, Input, Switch, Select, Button } from "antd";

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
      });
    }
  }, [gameData, form]);

  return (
    <Modal
      title="Edit Market Game"
      visible={!!gameData}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
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
      </Form>
    </Modal>
  );
};

export default EditModal;
