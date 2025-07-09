import  { useState } from "react";
import { Layout, Avatar, Dropdown, Menu, Modal, Button, message, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserApi } from "../../services/apis";
import { removeUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { MdOutlineLightMode } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";


const { Header } = Layout;

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const handleMenuClick = async ({ key }) => {
    if (key === "profile") {
      setProfileModalVisible(true);
    } else if (key === "logout") {
      const response = await logoutUserApi();
      message.success(response.message);
      dispatch(removeUser());
      navigate("/login");
    } else if (key === "toggle-theme") {
      const newTheme = window.theme === "dark" ? "light" : "dark";
      window.setTheme?.(newTheme);
      setTheme(newTheme); // update local to re-render
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<FaUserCircle />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<FaSignOutAlt className="text-red-500" />}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="bg-white dark:bg-inherit px-4 flex justify-between items-center shadow-sm">
  {user?.role && (
    <div className="text-sm font-semibold">{user.role.toUpperCase()}</div>
  )}

  {user && (
    <div className="flex items-center space-x-4">
      <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <button
        onClick={() => handleMenuClick({ key: "toggle-theme" })}
        className="text-xl hover:text-yellow-500 transition-colors duration-200"
      >
        {theme === "dark" ? <MdOutlineLightMode /> : <IoMoonOutline />}
      </button>
      </Tooltip>

      {/* 👤 User Dropdown */}
      <Dropdown overlay={userMenu} trigger={["click"]}>
        <div className="cursor-pointer flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} />
          <span className="font-medium hidden md:inline">
            {user.fullName}
          </span>
        </div>
      </Dropdown>
    </div>
  )}
</Header>


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
            <p><b>Name:</b> {user.fullName}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Last Login:</b> {user.lastLogin}</p>
          </div>
        )}
      </Modal>
    </>
  );
};
export default Navbar;
