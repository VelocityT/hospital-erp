// components/Sidebar.jsx
"use client"; // required if using useState or usePathname

import { Layout, Menu } from "antd";
import Link from "next/link";
import { useState } from "react";
import {
  UserAddOutlined,
  TeamOutlined,
  SolutionOutlined,
  ProfileOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: "patients/registration",
      icon: <UserAddOutlined />,
      label: <Link href="/patients/registration">Patient Registration</Link>,
    },
    {
      key: "patients",
      icon: <TeamOutlined />,
      label: <Link href="/patients">Patient List</Link>,
    },
    {
      key: "doctors",
      icon: <SolutionOutlined />,
      label: <Link href="/doctors">Doctor List</Link>,
    },
    {
      key: "opd",
      icon: <MedicineBoxOutlined />,
      label: <Link href="/opd">OPD List</Link>,
    },
    {
      key: "ipd",
      icon: <ProfileOutlined />,
      label: <Link href="/ipd">IPD List</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="md"
      collapsedWidth={80}
      className="overflow-auto"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div className="text-white p-4 font-bold text-center">Logo</div>
      <Menu theme="dark" mode="inline" items={items} selectedKeys={["patients/registration"]} />
    </Sider>
  );
}
