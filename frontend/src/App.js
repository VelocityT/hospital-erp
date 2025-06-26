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
import "antd/dist/reset.css";
import { Layout, Menu, Avatar, Dropdown, Modal, Button, message } from "antd";
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
import StaffRegistrationForm from "./pages/staff/StaffRegistrationForm";
import { logoutUserApi } from "./services/apis";
import StaffList from "./pages/staff/StaffList";
import SidebarMenu from "./pages/components/SidebarMenu";
import Prescription from "./pages/prescription/Prescription";
import Print from "./pages/printMaterial/Print";

const { Header, Content } = Layout;

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
  const user = useSelector((state) => state.user);

  // Modal state for profile
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  // Dropdown menu actions
  const handleMenuClick = async ({ key }) => {
    if (key === "profile") {
      setProfileModalVisible(true);
    } else if (key === "logout") {
      const response = await logoutUserApi();
      // console.log(response)
      message.success(response.message);
      dispatch(removeUser());
      navigate("/login");
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">View Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar moved to SidebarMenu component */}
      <SidebarMenu
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Dynamically shift content
          transition: "margin-left 0.2s",
        }}
      >
        <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
          {/* Role on the left */}
          {user?.role && (
            <div className="text-sm font-semibold text-gray-600">
              {user.role.toUpperCase()}
            </div>
          )}

          {/* Avatar and Full Name with Dropdown */}
          {user && (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div className="cursor-pointer flex items-center space-x-2">
                <Avatar icon={<UserOutlined />} />
                <span className="font-medium hidden md:inline">
                  {user.fullName}
                </span>
              </div>
            </Dropdown>
          )}
        </Header>
        {/* Profile Modal */}
        <Modal
          title="User Profile"
          open={isProfileModalVisible}
          onCancel={() => setProfileModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setProfileModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {user && (
            <div>
              <p>
                <b>Name:</b> {user.fullName}
              </p>
              <p>
                <b>Role:</b> {user.role}
              </p>
              <p>
                <b>Last Login:</b> {user.lastLogin}
              </p>
            </div>
          )}
        </Modal>
        <Content className="p-6 overflow-y-auto bg-gray-50">
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
              path="/addPrescription"
              element={
                <ProtectedRoute>
                  <Prescription />
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
              path="/staff/registration"
              element={
                <ProtectedRoute>
                  <StaffRegistrationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <StaffList />
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

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* This is OUTSIDE layout */}
          <Route path="/print" element={<Print />} />

          {/* All others go inside AppContent which includes sidebar, layout, etc */}
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </Provider>
  );
}
