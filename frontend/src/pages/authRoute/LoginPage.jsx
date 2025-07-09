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
import { toast } from "react-hot-toast";
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
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res?.message || "Invalid credentials, please try again.");
        if (!selectedRole) setRoleError("Please select your role!");
      }
    } catch (err) {
      toast.error("Login failed! Please try again.");
      if (!selectedRole) setRoleError("Please select your role!");
    }
    setLoading(false);
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
  <Card
    className="w-[350px] rounded-xl shadow-md dark:bg-gray-800 dark:text-white"
    bodyStyle={{ padding: 32 }}
  >
    <div className="text-center mb-4">
      <Title
        level={3}
        className="!mb-0 !text-gray-800 dark:!text-white"
      >
        Hospital ERP Login
      </Title>
    </div>
    <Form layout="vertical" onFinish={onFinish} form={form}>
      {/* Role Selector */}
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Please select your role!" }]}
      >
        <div className="flex justify-between mb-2">
          {roles.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => setSelectedRole(role.key)}
              className={`w-10 h-10 flex items-center justify-center text-xl rounded-full transition-all outline-none border ${
                selectedRole === role.key
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              }`}
              tabIndex={0}
              aria-label={role.label}
            >
              {role.icon}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {roles.map((role) => (
            <span
              key={role.key}
              className="text-xs text-gray-600 dark:text-gray-300 w-10 text-center"
            >
              {role.label}
            </span>
          ))}
        </div>
        {roleError && (
          <div className="text-red-500 text-xs mt-1 text-center">
            {roleError}
          </div>
        )}
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        name="email"
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

      {/* Password */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password size="large" placeholder="Enter your password" />
      </Form.Item>

      {/* Submit */}
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            className="rounded-lg font-semibold tracking-wide mt-2"
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
