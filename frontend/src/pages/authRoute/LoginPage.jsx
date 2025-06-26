import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined, // admin
  SolutionOutlined, // doctor
  TeamOutlined, // nurse
  UserAddOutlined, // receptionist
  MedicineBoxOutlined, // pharmacist
} from "@ant-design/icons";
import { loginUser } from "../../services/apis";

const { Title } = Typography;

const roles = [
  {
    key: "admin",
    icon: <UserOutlined />,
    label: "Admin",
  },
  {
    key: "doctor",
    icon: <SolutionOutlined />,
    label: "Doctor",
  },
  {
    key: "nurse",
    icon: <TeamOutlined />,
    label: "Nurse",
  },
  {
    key: "receptionist",
    icon: <UserAddOutlined />,
    label: "Receptionist",
  },
  {
    key: "pharmacist",
    icon: <MedicineBoxOutlined />,
    label: "Pharmacist",
  },
];

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState("");

  // Sync selectedRole with antd Form
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ role: selectedRole });
    if (selectedRole) setRoleError("");
  }, [selectedRole, form]);

  const onFinish = async (values) => {
    setLoading(true);
    setRoleError("");
    try {
      const payload = {
        ...values,
        role: selectedRole,
      };
      const res = await loginUser(payload);
      if (res && res.success) {
        dispatch(setUser(res.data));
        message.success("Login successful!");
        navigate("/");
      } else {
        message.error(res?.message || "Invalid credentials, please try again.");
        if (!selectedRole) setRoleError("Please select your role!");
      }
    } catch (err) {
      message.error("Login failed! Please try again.");
      if (!selectedRole) setRoleError("Please select your role!");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f2f5 100%)",
      }}
    >
      <Card
        style={{
          width: 350,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          borderRadius: 12,
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Hospital ERP Login
          </Title>
        </div>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              {roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  style={{
                    border:
                      selectedRole === role.key
                        ? "2px solid #1890ff"
                        : "1px solid #e5e7eb",
                    background: selectedRole === role.key ? "#e6f7ff" : "#fff",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  tabIndex={0}
                  aria-label={role.label}
                >
                  {role.icon}
                </button>
              ))}
            </div>
            {/* Show role labels below icons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              {roles.map((role) => (
                <span
                  key={role.key}
                  style={{
                    fontSize: 11,
                    color: "#555",
                    width: 40,
                    textAlign: "center",
                  }}
                >
                  {role.label}
                </span>
              ))}
            </div>
            {/* Show error message below role buttons */}
            {roleError && (
              <div
                style={{
                  color: "#ff4d4f",
                  fontSize: 12,
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {roleError}
              </div>
            )}
          </Form.Item>
          <Form.Item
            label="Email"
            name="username"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              type="email"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                size="large"
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  letterSpacing: 1,
                  marginTop: 8,
                }}
                disabled={!selectedRole}
              >
                Login
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
