import { Form, Input, Select, DatePicker, Upload, Row, Col, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

function FormStep({ form }) {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter patient name" }]}
          >
            <Input size="large" placeholder="John Doe" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select size="large" placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              disabledDate={(current) => current > new Date()}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="bloodGroup" label="Blood Group">
            <Select size="large" placeholder="Select blood group">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <Option key={group} value={group}>
                    {group}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <TextArea rows={2} placeholder="Full address" />
      </Form.Item>

      <Form.Item name="allergies" label="Known Allergies">
        <Select
          mode="multiple"
          placeholder="Select allergies"
          options={[
            { value: "Penicillin", label: "Penicillin" },
            { value: "Latex", label: "Latex" },
            { value: "Peanuts", label: "Peanuts" },
          ]}
        />
      </Form.Item>

      <Form.Item name="documents" label="Medical Documents">
        <Upload multiple beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload Files</Button>
        </Upload>
      </Form.Item>
    </>
  );
}

export default FormStep;
