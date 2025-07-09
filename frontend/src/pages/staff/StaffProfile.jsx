import {
  Row,
  Col,
  Avatar,
  Card,
  Tag,
  Typography,
  Grid,
  Tabs,
  Spin,
  Descriptions,
  Button,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  MailOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStaffByIdApi } from "../../services/apis";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const StaffProfile = () => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);
  const { state } = useLocation();
  const _id = state?._id;

  useEffect(() => {
    if (_id) {
      fetchStaffDetails(_id);
    }
  }, [_id]);

  const fetchStaffDetails = async (id) => {
    try {
      setLoading(true);
      const response = await getStaffByIdApi(id);

      if (response?.success) {
        setStaffData(response.data);
      } else {
        toast.error(response?.message || "Failed to fetch staff details");
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error("An error occurred while fetching staff details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin fullscreen />;

  const labelLayout = {
    column: screens.xs ? 1 : 2,
    size: "middle",
    layout: screens.xs ? "vertical" : "horizontal",
  };

  return (
    <>
      <Row justify="end" align="center" style={{ marginBottom: 16 }}>
        {user?.role === "admin" && (
          <Col>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/staff/edit/${staffData?.staffId}`,{state:{staff:staffData}})}
            >
              Edit Profile
            </Button>
          </Col>
        )}
      </Row>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" wrap>
          <Col
            xs={24}
            sm={6}
            md={4}
            lg={3}
            style={{ textAlign: screens.xs ? "center" : "left" }}
          >
            <Avatar
              size={screens.xs ? 64 : 80}
              icon={<UserOutlined />}
              src={staffData?.profilePhoto}
              style={{ background: "#e6f7ff" }}
            />
          </Col>

          <Col xs={24} sm={18} md={20} lg={21}>
            <Row gutter={[4, 4]}>
              <Col xs={24}>
                <Row justify="space-between" align="middle">
                  {/* Full Name */}
                  <Col>
                    <Title level={4} style={{ margin: 0 }}>
                      {staffData?.fullName}
                    </Title>
                  </Col>

                  <Col>
                    <Tag color="green">{staffData?.role?.toUpperCase()}</Tag>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Text strong>ID: {staffData?.staffId}</Text>
              </Col>
              <Col span={24}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {staffData?.currentAddress || "-"}
              </Col>

              <Col span={24}>
                <MailOutlined style={{ marginRight: 4 }} />
                {staffData?.email || "-"}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Profile" key="1">
            <div className="space-y-6">
              <Descriptions
                {...labelLayout}
                bordered
                column={screens.xs ? 1 : 2}
              >

                <Descriptions.Item label="Department">
                  {staffData?.department}
                </Descriptions.Item>
                <Descriptions.Item label="Designation">
                  {staffData?.designation}
                </Descriptions.Item>
                <Descriptions.Item label="Qualification">
                  {staffData?.qualification}
                </Descriptions.Item>
                <Descriptions.Item label="Specialist">
                  {staffData?.specialist}
                </Descriptions.Item>
                {staffData?.role === "doctor" && (
                  <>
                    <Descriptions.Item label="IPD Charge">
                      <span className="text-green-600 font-semibold">
                        ₹{staffData?.ipdCharge}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="OPD Charge">
                      <span className="text-green-600 font-semibold">
                        ₹{staffData?.opdCharge}
                      </span>
                    </Descriptions.Item>
                  </>
                )}

                <Descriptions.Item label="Gender">
                  {staffData?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {dayjs(staffData?.dob).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Blood Group">
                  {staffData?.bloodGroup}
                </Descriptions.Item>
                <Descriptions.Item label="Marital Status">
                  {staffData?.maritalStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Father's Name">
                  {staffData?.fatherName}
                </Descriptions.Item>
                <Descriptions.Item label="Mother's Name">
                  {staffData?.motherName}
                </Descriptions.Item>

                <Descriptions.Item label="Phone">
                  {staffData?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  {staffData?.emergencyContact}
                </Descriptions.Item>
                <Descriptions.Item label="Current Address">
                  {staffData?.currentAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Permanent Address">
                  {staffData?.permanentAddress}
                </Descriptions.Item>

                <Descriptions.Item label="Joining Date">
                  {dayjs(staffData?.dateOfJoining).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                  {staffData?.workExperience}
                </Descriptions.Item>
                <Descriptions.Item label="Note">
                  {staffData?.note}
                </Descriptions.Item>

                <Descriptions.Item label="PAN Number">
                  {staffData?.panNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Aadhar Number">
                  {staffData?.aadharNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Reference">
                  {staffData?.reference}
                </Descriptions.Item>
                <Descriptions.Item label="Last Login">
                  {dayjs(staffData?.lastLogin).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Tabs.TabPane>

          {staffData?.role === "doctor" && (
            <>
              <Tabs.TabPane tab="IPDs" key="2">
                <Card size="small"> IPD records go here...</Card>
              </Tabs.TabPane>

              <Tabs.TabPane tab="OPDs" key="3">
                <Card size="small"> OPD records go here...</Card>
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </Card>
    </>
  );
};
export default StaffProfile;
