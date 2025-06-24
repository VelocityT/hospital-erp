import { Row, Col, Form, Input } from "antd";

function AddressField({ form }) {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Full address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input placeholder="City" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="pincode"
            label="Postal Code"
            rules={[{ pattern: /^\d{6}$/, message: "Invalid postal code" }]}
          >
            <Input placeholder="6-digit code" maxLength={6} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default AddressField;
