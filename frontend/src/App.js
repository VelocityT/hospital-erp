// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  UserAddOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import OPDDashboard from "./pages/OPD/OPDdashboard";
import PatientRegistration from "./pages/PatientRegistration/PatientRegistrationPage";
import IPDdashboard from "./pages/IPD/IPDdashboard";
import BedAssignment from "./pages/IPD/components/BedAssignment";
import AdmissionForm from "./pages/IPD/components/AdmissionForm";

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible>
          <div className="logo">HOSPITAL ERP</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="2" icon={<UserAddOutlined />}>
              <Link to="/registration">Patient Registration</Link>
            </Menu.Item>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/opd">OPD</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "24px 16px 0" }}>
            <Routes>
              <Route path="/opd" element={<OPDDashboard />} />
              <Route path="/registration" element={<PatientRegistration />} />
              <Route path="/ipd" element={<IPDdashboard />}>
                <Route path="admit" element={<AdmissionForm />} />
                <Route path="beds" element={<BedAssignment />} />
              </Route>
              <Route path="/" element={<Navigate to="/opd" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;