"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Drawer,
  Descriptions,
  Row,
  Col,
  Input,
} from "antd";
import { useRouter, usePathname } from "next/navigation";

const columnsBase = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    sorter: (a, b) => a.fullName.localeCompare(b.fullName),
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
      val?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) || "-",
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
    title: "Appointment Charge",
    dataIndex: "appointmentCharge",
    key: "appointmentCharge",
    render: (val) => (val ? `₹${val}` : "-"),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
];

const DoctorList = () => {
  const [data, setData] = useState([]);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    setData(doctors.map((d, idx) => ({ ...d, key: idx })));
  }, []); // Only run on mount

  const handleView = (record) => {
    setSelectedDoctor(record);
    setViewDrawer(true);
  };

  const handleEdit = (record) => {
    sessionStorage.setItem("editDoctor", JSON.stringify(record));
    router.push("/doctors/registration?edit=1");
  };

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
          <Col>
            <Button
              size="small"
              type="primary"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={() => router.push("/doctors/registration")}
        >
          New Doctor
        </Button>
      </div>
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
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          responsive
        />

        <Drawer
          title="Doctor Details"
          open={viewDrawer}
          onClose={() => setViewDrawer(false)}
          width={500}
        >
          {selectedDoctor && (
            <Descriptions column={1} bordered size="small">
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
              <Descriptions.Item label="Appointment Charge">
                {selectedDoctor.appointmentCharge
                  ? `₹${selectedDoctor.appointmentCharge}`
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedDoctor.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedDoctor.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address 1">
                {selectedDoctor.address1}
              </Descriptions.Item>
              <Descriptions.Item label="Address 2">
                {selectedDoctor.address2}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedDoctor.city}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {selectedDoctor.pincode}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </Card>
    </>
  );
};

export default DoctorList;
