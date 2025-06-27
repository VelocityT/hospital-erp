// pages/components/Navbar.js
import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Menu, Modal, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserApi } from "../../services/apis";
import { removeUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const handleMenuClick = async ({ key }) => {
    if (key === "profile") {
      setProfileModalVisible(true);
    } else if (key === "logout") {
      const response = await logoutUserApi();
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

  return (
    <>
      <Header className="bg-white px-4 flex justify-between items-center shadow-sm">
        {/* Role Label */}
        {user?.role && (
          <div className="text-sm font-semibold text-gray-600">
            {user.role.toUpperCase()}
          </div>
        )}

        {/* User Dropdown */}
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
