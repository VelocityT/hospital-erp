import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser } from "../../services/apis";
import {
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserAddOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { MdSupervisedUserCircle } from "react-icons/md";
import { setHospital } from "../../redux/hospitalSlice";

const { Title } = Typography;

const roles = [
  {
    key: "superAdmin",
    icon: <MdSupervisedUserCircle />,
    label: "Super Admin",
  },
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
      if (!selectedRole) {
        setRoleError("Please select your role!");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        role: selectedRole,
      };
      const res = await loginUser(payload);
      if (res && res.success) {
        const {hospital,...userData} = res.data
        console.log(hospital)
        dispatch(setUser(userData));
        dispatch(setHospital(hospital))
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res?.message || "Invalid credentials, please try again.");
      }
    } catch (err) {
      console.error("Login error:", err); // Log the actual error for debugging
      toast.error("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <Card
        className="w-[350px] rounded-xl shadow-md dark:bg-gray-800 dark:text-white"
        bodyStyle={{ padding: 32 }}
      >
        <div className="text-center mb-4">
          <Title level={3} className="!mb-0 !text-gray-800 dark:!text-white">
            Hospital ERP Login
          </Title>
        </div>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="role" rules={[{ required: false }]}>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {roles.map((role) => (
                <div key={role.key} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(role.key)}
                    className={`w-12 h-12 flex items-center justify-center text-xl rounded-full transition-all outline-none border
                      ${
                        selectedRole === role.key
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }
                    `}
                    tabIndex={0}
                    aria-label={role.label}
                  >
                    {role.icon}
                  </button>
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center w-20">
                    {role.label}
                  </span>
                </div>
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
                disabled={
                  !selectedRole ||
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().some(({ errors }) => errors.length)
                }
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
