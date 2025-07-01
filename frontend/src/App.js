import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ConfigProvider, Layout,theme as antdTheme } from "antd";
import { Provider, useSelector } from "react-redux";

import { store } from "./redux/store";
import SidebarMenu from "./pages/components/SidebarMenu";
import Navbar from "./pages/components/Navbar";
import Print from "./pages/printMaterial/Print";
import LoginPage from "./pages/authRoute/LoginPage";
import { roleRoutes } from "./routes/roleBaseRoutes";
import ProtectedRoute from "./pages/components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";

const { Content } = Layout;

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const isLoginPage = location.pathname === "/login";
  if (isLoginPage) return <LoginPage />;

  const accessibleRoutes = roleRoutes[user?.role] || [];

  if (!user?.role || !user?._id) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Navbar />
        <Content className="p-6 overflow-y-auto">
          <Routes>
            {accessibleRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
              />
            ))}
            <Route path="/" element={<Navigate to="/registration" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    window.theme = theme;
  }, [theme]);

  window.setTheme = setTheme;

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        <Router>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 6000 }}
          />
          <Routes>
            <Route path="/print" element={<Print />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}
