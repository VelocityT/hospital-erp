import { MdRequestQuote } from "react-icons/md";
import { Layout, Menu } from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  SolutionOutlined,
  ProfileOutlined,
  MedicineBoxOutlined,
  RestOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const SidebarMenu = ({ collapsed, setCollapsed, user }) => {
  const baseMenu = [
    {
      key: "patient-list",
      icon: <TeamOutlined />,
      label: <Link to="/patients">Patient List</Link>,
    },
    {
      key: "doctor-list",
      icon: <SolutionOutlined />,
      label: <Link to="/doctors">Doctor List</Link>,
    },
    {
      key: "opd-list",
      icon: <MedicineBoxOutlined />,
      label: <Link to="/opd-list">OPD List</Link>,
    },
    {
      key: "ipd-list",
      icon: <ProfileOutlined />,
      label: <Link to="/ipd-list">IPD List</Link>,
    },
    {
      key: "ward-management",
      icon: <RestOutlined />,
      label: <Link to="/wards">Ward and Beds</Link>,
    },
  ];

  const roleMenus = {
    admin: [
      {
        key: "billing",
        icon: <MdRequestQuote />,
        label: <Link to="/billing/patientBilling">Billing</Link>,
      },
      {
        key: "registration",
        icon: <UserAddOutlined />,
        label: <Link to="/registration">Patient Registration</Link>,
      },
      ...baseMenu,
      {
        key: "staff-management",
        icon: <TeamOutlined />,
        label: <Link to="/staff">Staff Management</Link>,
      },
      {
        key: "pharmacy",
        icon: <MedicineBoxOutlined />,
        label: <Link to="/pharmacy">Pharmacy</Link>,
      },
    ],

    doctor: [
      {
        key: "registration",
        icon: <UserAddOutlined />,
        label: <Link to="/registration">Patient Registration</Link>,
      },
      ...baseMenu,
    ],

    nurse: [...baseMenu],

    pharmacist: [
      ...baseMenu,
      {
        key: "pharmacy-add",
        icon: <MedicineBoxOutlined />,
        label: <Link to="/pharmacy/medicine/add">Add Medicine</Link>,
      },
      {
        key: "pharmacy",
        icon: <MedicineBoxOutlined />,
        label: <Link to="/pharmacy">Pharmacy</Link>,
      },
    ],

    receptionist: [
      {
        key: "registration",
        icon: <UserAddOutlined />,
        label: <Link to="/registration">Patient Registration</Link>,
      },
      ...baseMenu,
      {
        key: "billing",
        icon: <MdRequestQuote />,
        label: <Link to="/billing/patientBilling">Billing</Link>,
      },
    ],
  };

  const menuItems = roleMenus[user?.role] || [];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="md"
      collapsedWidth={80}
      className="overflow-auto print:hidden"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className="text-white p-4 font-bold text-center">Logo</div>
      <Menu theme="dark" mode="inline" items={menuItems} />
    </Sider>
  );
};

export default SidebarMenu;
