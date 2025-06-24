import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  UserAddOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  ProfileOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
// import 'antd/dist/antd.css';
import 'antd/dist/reset.css';
import { Layout, Menu } from "antd";
import OPDDashboard from "./pages/OPD/OPDdashboard";
import PatientRegistration from "./pages/Patient/PatientRegistrationPage";
import PatientList from "./pages/Patient/PatientList";
import OPDIPDList from "./pages/OPDIPD/OPDIPDList";
import IPDdashboard from "./pages/IPD/IPDdashboard";
import BedAssignment from "./pages/IPD/components/BedAssignment";
import AdmissionForm from "./pages/IPD/components/AdmissionForm";
import DoctorList from "./pages/Doctor/DoctorList";
import AddDoctor from "./pages/Doctor/AddDoctor";
import PatientProfile from "./pages/Patient/PatientProfile";
import LoginPage from "./pages/authRoute/LoginPage";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { removeUser } from "./redux/userSlice";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Fixed, responsive Sidebar */}
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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="registration" icon={<UserAddOutlined />}>
            <Link to="/registration">Patient Registration</Link>
          </Menu.Item>
          <Menu.Item key="patient-list" icon={<TeamOutlined />}>
            <Link to="/patients">Patient List</Link>
          </Menu.Item>
          <Menu.Item key="doctor-list" icon={<SolutionOutlined />}>
            <Link to="/doctors">Doctor List</Link>
          </Menu.Item>
          <Menu.Item key="opd-list" icon={<MedicineBoxOutlined />}>
            <Link to="/opd-list">OPD List</Link>
          </Menu.Item>
          <Menu.Item key="ipd-list" icon={<ProfileOutlined />}>
            <Link to="/ipd-list">IPD List</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Dynamically shift content
          transition: "margin-left 0.2s",
        }}
      >
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content
          className="p-6 overflow-y-auto bg-gray-50"
          // style={{ height: "100vh" }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/opd-ipd"
              element={
                <ProtectedRoute>
                  <OPDDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registration"
              element={
                <ProtectedRoute>
                  <PatientRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registration/edit/:id"
              element={
                <ProtectedRoute>
                  <PatientRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd"
              element={
                <ProtectedRoute>
                  <IPDdashboard />
                </ProtectedRoute>
              }
            >
              <Route
                path="admit"
                element={
                  <ProtectedRoute>
                    <AdmissionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="beds"
                element={
                  <ProtectedRoute>
                    <BedAssignment />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <DoctorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-registration"
              element={
                <ProtectedRoute>
                  <AddDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opd-list"
              element={
                <ProtectedRoute>
                  <OPDIPDList type="opd" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ipd-list"
              element={
                <ProtectedRoute>
                  <OPDIPDList type="ipd" />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/registration" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
