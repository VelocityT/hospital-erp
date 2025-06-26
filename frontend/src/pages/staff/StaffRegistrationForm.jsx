import { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  TeamOutlined,
  PhoneOutlined,
  HomeOutlined,
  SolutionOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ContactsOutlined,
  FileProtectOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { createUserApi } from "../../services/apis";
import { useSelector } from "react-redux";

const { Option } = Select;
const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

function StaffRegistrationForm() {
  const user  = useSelector((state) => state.user)
  console.log(user)
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);

  const validatePhone = (_, value) => {
    if (!value) return Promise.resolve();
    return /^[6-9]\d{9}$/.test(value)
      ? Promise.resolve()
      : Promise.reject("Enter valid 10-digit Indian mobile number");
  };

  const onFinish = async (values) => {
    try {
      const dob = values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : "";
      const dateOfJoining = values.dateOfJoining
        ? dayjs(values.dateOfJoining).format("YYYY-MM-DD")
        : "";

      const photoFile = values.photo?.[0]?.originFileObj;

      const formData = new FormData();

      for (const key in values) {
        if (key === "photo") continue;
        const value = values[key];
        // Format dates
        if (key === "dob") formData.append("dob", dob);
        else if (key === "dateOfJoining")
          formData.append("dateOfJoining", dateOfJoining);
        else formData.append(key, value ?? "");
      }

      // Append photo
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await createUserApi(formData);
      //       for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      console.log(response);
      message.success("Staff registered successfully!");
      // form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Registration failed");
    }
  };

  // Handle image preview
  const handlePhotoChange = ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    form.setFieldsValue({ photo: fileList });
  };

  return (
    <div className="pb-4">
      <Card
        title={
          <span>
            <TeamOutlined style={{ marginRight: 8 }} />
            Staff Registration
          </span>
        }
        bordered={false}
        className="bg-transparent border-none"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[0, 24]}>
            {/* Account Details */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Account Details
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="photo"
                      label="Photo"
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e && e.fileList
                      }
                      rules={[
                        { required: true, message: "Please upload a photo" },
                      ]}
                    >
                      <>
                        <Upload
                          name="photo"
                          listType="picture-card"
                          maxCount={1}
                          beforeUpload={() => false}
                          showUploadList={false}
                          onChange={handlePhotoChange}
                          accept="image/*"
                        >
                          {!previewImage && (
                            <Button icon={<UploadOutlined />}>
                              Upload Photo
                            </Button>
                          )}
                        </Upload>
                        {previewImage && (
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={previewImage}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: 8,
                                marginBottom: 8,
                              }}
                            />
                            <div>
                              <Button
                                size="small"
                                onClick={() => {
                                  setPreviewImage(null);
                                  form.setFieldsValue({ photo: [] });
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        { required: true, message: "Enter full name" },
                        {
                          min: 3,
                          message: "Name must be at least 3 characters",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Full Name"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Enter email" },
                        { type: "email", message: "Enter valid email" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Email"
                        prefix={<MailOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Enter password" },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters",
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Password"
                        prefix={<LockOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  {/* Joining Date Field */}
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="dateOfJoining"
                      label="Joining Date"
                      rules={[
                        { required: true, message: "Select joining date" },
                        {
                          validator: (_, value) =>
                            value && value.isAfter(dayjs())
                              ? Promise.reject("Joining date cannot be in the future")
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        placeholder="Select Joining Date"
                        suffixIcon={<CalendarOutlined />}
                        disabledDate={(current) =>
                          current && current > dayjs().endOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Staff Info */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <IdcardOutlined style={{ marginRight: 8 }} />
                    Staff Info
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true, message: "Select role" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Select Role"
                        prefix={<TeamOutlined />}
                      >
                        <Option value="admin">Admin</Option>
                        <Option value="doctor">Doctor</Option>
                        <Option value="nurse">Nurse</Option>
                        <Option value="receptionist">Receptionist</Option>
                        <Option value="pharmacist">Pharmacist</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="department"
                      label="Department"
                      rules={[{ required: true, message: "Enter department" }]}
                    >
                      <Input
                        size="large"
                        placeholder="Department"
                        prefix={<SolutionOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="designation"
                      label="Designation"
                      rules={[{ required: true, message: "Enter designation" }]}
                    >
                      <Input
                        size="large"
                        placeholder="Designation"
                        prefix={<SolutionOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Personal Details */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <ContactsOutlined style={{ marginRight: 8 }} />
                    Personal Details
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[{ required: true, message: "Select gender" }]}
                    >
                      <Select size="large" placeholder="Select Gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="dob"
                      label="Date of Birth"
                      rules={[
                        { required: true, message: "Select date of birth" },
                        {
                          validator: (_, value) =>
                            value && value.isAfter(dayjs())
                              ? Promise.reject("DOB cannot be in the future")
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        placeholder="Select DOB"
                        suffixIcon={<CalendarOutlined />}
                        disabledDate={(current) =>
                          current && current > dayjs().endOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="bloodGroup" label="Blood Group">
                      <Select size="large" placeholder="Select Blood Group">
                        {bloodGroups.map((group) => (
                          <Option key={group} value={group}>
                            {group}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="maritalStatus" label="Marital Status">
                      <Select size="large" placeholder="Select Status">
                        <Option value="Single">Single</Option>
                        <Option value="Married">Married</Option>
                        <Option value="Divorced">Divorced</Option>
                        <Option value="Widowed">Widowed</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[
                        { required: true, message: "Enter phone number" },
                        { validator: validatePhone },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Phone"
                        prefix={<PhoneOutlined />}
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="emergencyContact"
                      label="Emergency Contact"
                    >
                      <Input
                        size="large"
                        placeholder="Emergency Contact"
                        prefix={<PhoneOutlined />}
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="fatherName" label="Father's Name">
                      <Input
                        size="large"
                        placeholder="Father's Name"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="motherName" label="Mother's Name">
                      <Input
                        size="large"
                        placeholder="Mother's Name"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Address */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <HomeOutlined style={{ marginRight: 8 }} />
                    Address
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="currentAddress"
                      label="Current Address"
                      rules={[
                        { required: true, message: "Enter current address" },
                      ]}
                    >
                      <Input.TextArea
                        rows={2}
                        size="large"
                        placeholder="Current Address"
                        prefix={<HomeOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="permanentAddress"
                      label="Permanent Address"
                      rules={[
                        { required: true, message: "Enter permanent address" },
                      ]}
                    >
                      <Input.TextArea
                        rows={2}
                        size="large"
                        placeholder="Permanent Address"
                        prefix={<HomeOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Professional Details */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <SolutionOutlined style={{ marginRight: 8 }} />
                    Professional Details
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="qualification"
                      label="Qualification"
                      rules={[
                        { required: true, message: "Enter qualification" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Qualification"
                        prefix={<FileTextOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="specialist" label="Specialist">
                      <Input
                        size="large"
                        placeholder="Specialist"
                        prefix={<FileTextOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="ipdCharge" label="IPD Charge">
                      <Input
                        size="large"
                        type="number"
                        placeholder="IPD Charge"
                        prefix={<FileTextOutlined />}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="opdCharge" label="OPD Charge">
                      <Input
                        size="large"
                        type="number"
                        placeholder="OPD Charge"
                        prefix={<FileTextOutlined />}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={6}>
                    <Form.Item name="workExperience" label="Work Experience">
                      <Input
                        size="large"
                        placeholder="Work Experience"
                        prefix={<FileTextOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={18}>
                    <Form.Item name="note" label="Note">
                      <Input.TextArea
                        rows={2}
                        size="large"
                        placeholder="Note"
                        prefix={<FileTextOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Document IDs */}
            <Col span={24}>
              <Card
                title={
                  <span>
                    <FileProtectOutlined style={{ marginRight: 8 }} />
                    Document IDs
                  </span>
                }
                bordered={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={6}>
                    <Form.Item name="panNumber" label="PAN Number">
                      <Input
                        size="large"
                        placeholder="PAN Number"
                        prefix={<IdcardOutlined />}
                        maxLength={10}
                        style={{ textTransform: "uppercase" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="aadharNumber" label="Aadhar Number">
                      <Input
                        size="large"
                        placeholder="Aadhar Number"
                        prefix={<IdcardOutlined />}
                        maxLength={12}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={6}>
                    <Form.Item name="reference" label="Reference">
                      <Input
                        size="large"
                        placeholder="Reference"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Submit Button */}
            <Col span={24}>
              <Form.Item className="text-end mt-4">
                <Button type="primary" size="large" htmlType="submit">
                  Register Staff
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default StaffRegistrationForm;
