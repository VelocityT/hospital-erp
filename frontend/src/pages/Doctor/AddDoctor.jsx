import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Card,
  message,
} from "antd";
import "antd/dist/reset.css";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { createUserApi } from "../../services/apis";

const { Option } = Select;

const departments = [
  { label: "Cardiology", value: "cardiology" },
  { label: "Neurology", value: "neurology" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "Pediatrics", value: "pediatrics" },
  { label: "General Medicine", value: "general-medicine" },
];

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const AddDoctor = () => {
  const [form] = Form.useForm();
  const [dob, setDob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if edit mode
  const params = new URLSearchParams(location.search);
  const isEdit = params.get("edit") === "1";

  useEffect(() => {
    if (isEdit) {
      const editDoctor = sessionStorage.getItem("editDoctor");
      if (editDoctor) {
        const doctor = JSON.parse(editDoctor);
        form.setFieldsValue({
          ...doctor,
          dob: doctor.dob ? dayjs(doctor.dob) : undefined,
        });
        setDob(doctor.dob ? dayjs(doctor.dob) : null);
      }
    }
  }, [isEdit, form]);

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match!'));
    },
  });

  const onFinish = async (values) => {
    const doctorData = {
      ...values,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : undefined,
      role: "doctor",
    };

    try {
      let res;
      if (isEdit) {
        res = await createUserApi(doctorData);
        sessionStorage.removeItem("editDoctor");
      } else {
        res = await createUserApi(doctorData);
        // console.log(res)
      }
      if (res && !res.error) {
        message.success(isEdit ? "Doctor updated successfully!" : "Doctor added successfully!");
        // form.resetFields();
        // setDob(null);
        // navigate("/doctors");
      } else {
        message.error(res?.message || "Failed to save doctor");
      }
    } catch (err) {
      message.error("An error occurred while saving doctor");
    }
  };

  return (
    <div className="pb-4">
      <Card title={isEdit ? "Update Doctor" : "Add Doctor"} className="bg-transparent border-none">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[0, 24]}>
            {/* Card 1: Personal Details */}
            <Col span={24}>
              <Card title="Personal Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter full name" }]}
                    >
                      <Input size="large" placeholder="Dr. John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[{ required: true, message: "Please select gender" }]}
                    >
                      <Select size="large" placeholder="Select gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
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
                        disabledDate={(current) =>
                          current && current.toDate() > new Date()
                        }
                        value={dob}
                        onChange={setDob}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="bloodGroup"
                      label="Blood Group"
                      rules={[{ required: true, message: "Please select blood group" }]}
                    >
                      <Select size="large" placeholder="Select blood group">
                        {bloodGroups.map((group) => (
                          <Option key={group} value={group}>
                            {group}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Card 2: Professional Details */}
            <Col span={24}>
              <Card title="Professional Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="department"
                      label="Department"
                      rules={[{ required: true, message: "Please select department" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Select department"
                        options={departments}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="designation"
                      label="Designation"
                      rules={[{ required: true, message: "Please enter designation" }]}
                    >
                      <Input size="large" placeholder="e.g., Senior Consultant" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="qualification"
                      label="Qualification"
                      rules={[{ required: true, message: "Please enter qualification" }]}
                    >
                      <Input size="large" placeholder="e.g., MBBS, MD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="specialist"
                      label="Specialist"
                      rules={[{ required: true, message: "Please enter specialist" }]}
                    >
                      <Input size="large" placeholder="e.g., Cardiologist" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="appointmentCharge"
                      label="Appointment Charge"
                      rules={[{ required: true, message: "Please enter appointment charge" }]}
                    >
                      <Input
                        size="large"
                        type="number"
                        placeholder="e.g., 1000"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Card 3: Address Details */}
            <Col span={24}>
              <Card title="Address Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="line1"
                      label="Address Line 1"
                      rules={[{ required: true, message: "Enter Address Line 1" }]}
                    >
                      <Input size="large" placeholder="House No, Street" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="line2"
                      label="Address Line 2"
                      rules={[{ required: false }]}
                    >
                      <Input size="large" placeholder="Apartment, Landmark (optional)" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: "Enter City" }]}
                    >
                      <Input size="large" placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="pincode"
                      label="Pincode"
                      rules={[
                        { required: true, message: "Enter Pincode" },
                        {
                          pattern: /^[0-9]{6}$/,
                          message: "Pincode must be 6 digits",
                        },
                      ]}
                    >
                      <Input size="large" type="number" placeholder="e.g. 560001" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Card 4: Account Details */}
            <Col span={24}>
              <Card title="Account Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" },
                      ]}
                    >
                      <Input size="large" placeholder="doctor@email.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[
                        { required: true, message: "Please enter phone number" },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter valid 10-digit Indian mobile number",
                        },
                      ]}
                    >
                      <Input size="large" type="tel" maxLength={10} placeholder="e.g. 9876543210" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please enter password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                      ]}
                      hasFeedback
                    >
                      <Input.Password size="large" placeholder="Enter password" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        { required: true, message: "Please confirm password" },
                        validateConfirmPassword,
                      ]}
                    >
                      <Input.Password size="large" placeholder="Confirm password" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Hidden Role Field */}
            <Form.Item name="role" initialValue="doctor" hidden>
              <Input type="hidden" />
            </Form.Item>

            {/* Submit Button */}
            <Col span={24}>
              <Form.Item className="text-end mt-4">
                <Button type="primary" size="large" htmlType="submit">
                  {isEdit ? "Update Doctor" : "Add Doctor"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddDoctor;
