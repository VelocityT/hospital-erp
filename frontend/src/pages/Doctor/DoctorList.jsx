import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Drawer,
  Descriptions,
  Row,
  Col,
  Input,
  Spin,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getUsersApi } from "../../services/apis";
import toast from "react-hot-toast";

const DoctorList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const columnsBase = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (text, record) => (
        <p
          onClick={() =>
            navigate(`/staff/profile/${record?.staffId}`, {
              state: { _id: record._id },
            })
          }
          className="text-blue-600 cursor-pointer hover:underline mb-0"
        >
          {text}
        </p>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (val) =>
        val?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
        "-",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Specialist",
      dataIndex: "specialist",
      key: "specialist",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  useEffect(() => {
    const getDoctorsList = async () => {
      setLoading(true);
      try {
        const response = await getUsersApi({ userType: "doctor" });
        const list =
          response?.data?.map((d, idx) => ({ ...d, key: idx })) || [];
        setData(list);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast.error(error?.message || "Error fetching doctors list");
      } finally {
        setLoading(false);
      }
    };
    getDoctorsList();
  }, [location]);

  const handleView = (record) => {
    console.log(record);
    setSelectedDoctor(record);
    setViewDrawer(true);
  };

  // const handleEdit = (record) => {
  //   sessionStorage.setItem("editDoctor", JSON.stringify(record));
  //   navigate("/doctor-registration?edit=1");
  // };

  // Filter data by search text (name, email, phone)
  const filteredData = data.filter(
    (d) =>
      !searchText ||
      (d.fullName &&
        d.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (d.email && d.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (d.phone && d.phone.includes(searchText))
  );

  const columns = [
    ...columnsBase,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Button size="small" onClick={() => handleView(record)}>
              View
            </Button>
          </Col>
          {/* <Col>
            <Button
              size="small"
              type="primary"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          </Col> */}
        </Row>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <Row gutter={[8, 8]} className="mb-2 md:mb-0">
            <Col flex="auto">
              <span style={{ fontWeight: 600, fontSize: 18 }}>Doctor List</span>
            </Col>
            <Col>
              <Input.Search
                allowClear
                placeholder="Search by name, email or phone"
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                style={{ marginRight: 8 }}
              />
            </Col>
          </Row>
        }
        bordered={false}
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
            responsive
          />
        )}

        <Drawer
          title="Doctor Details"
          open={viewDrawer}
          onClose={() => setViewDrawer(false)}
          width={500}
        >
          {selectedDoctor && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Staff ID">
                {selectedDoctor.staffId}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {selectedDoctor.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {selectedDoctor.gender}
              </Descriptions.Item>
              <Descriptions.Item label="DOB">
                {selectedDoctor.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Blood Group">
                {selectedDoctor.bloodGroup}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedDoctor.department
                  ?.replace(/-/g, " ")
                  ?.replace(/\b\w/g, (c) => c.toUpperCase())}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {selectedDoctor.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Qualification">
                {selectedDoctor.qualification}
              </Descriptions.Item>
              <Descriptions.Item label="Specialist">
                {selectedDoctor.specialist}
              </Descriptions.Item>

              <Descriptions.Item label="OPD Charge">
                ₹{selectedDoctor.opdCharge}
              </Descriptions.Item>

              <Descriptions.Item label="IPD Charge">
                ₹{selectedDoctor.ipdCharge}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedDoctor.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedDoctor.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Current Address">
                {selectedDoctor.currentAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Permanent Address">
                {selectedDoctor.permanentAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Father's Name">
                {selectedDoctor.fatherName}
              </Descriptions.Item>
              <Descriptions.Item label="Mother's Name">
                {selectedDoctor.motherName}
              </Descriptions.Item>
              <Descriptions.Item label="Marital Status">
                {selectedDoctor.maritalStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Joining">
                {selectedDoctor.dateOfJoining}
              </Descriptions.Item>
              <Descriptions.Item label="Work Experience">
                {selectedDoctor.workExperience}
              </Descriptions.Item>
              <Descriptions.Item label="PAN Number">
                {selectedDoctor.panNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Aadhar Number">
                {selectedDoctor.aadharNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Reference">
                {selectedDoctor.reference}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                {selectedDoctor.note}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </Card>
    </>
  );
};

export default DoctorList;
