"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Drawer,
  Descriptions,
  Input,
  Row,
  Col,
} from "antd";
import { useRouter } from "next/navigation";

// const { Option } = Select;

const columnsBase = [
  {
    title: "Admit Date & Time",
    key: "admitDateTime",
    render: (_, record) =>
      record.patientType === "ipd"
        ? record.ipd?.admissionDateTime || "-"
        : record.opd?.visitDateTime || "-",
    sorter: (a, b) => {
      const aDate =
        a.patientType === "ipd"
          ? a.ipd?.admissionDateTime
          : a.opd?.visitDateTime;
      const bDate =
        b.patientType === "ipd"
          ? b.ipd?.admissionDateTime
          : b.opd?.visitDateTime;
      return new Date(aDate) - new Date(bDate);
    },
  },
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
  },
  {
    title: "DOB",
    dataIndex: "dob",
    key: "dob",
    sorter: (a, b) => {
      if (!a.dob || !b.dob) return 0;
      return new Date(a.dob) - new Date(b.dob);
    },
  },
  {
    title: "Age",
    key: "age",
    render: (_, record) =>
      `${record.age?.years || "-"}y ${record.age?.months || "-"}m ${
        record.age?.days || "-"
      }d`,
  },
  {
    title: "Type",
    dataIndex: "patientType",
    key: "patientType",
    render: (type) =>
      type ? (
        <Tag color={type === "ipd" ? "red" : "blue"}>{type.toUpperCase()}</Tag>
      ) : (
        "-"
      ),
    filters: [
      { text: "IPD", value: "ipd" },
      { text: "OPD", value: "opd" },
    ],
    onFilter: (value, record) => record.patientType === value,
  },
  {
    title: "Mobile",
    dataIndex: ["contact", "mobile"],
    key: "mobile",
    render: (_, record) => record.contact?.mobile || "-",
  },
  {
    title: "Blood Group",
    dataIndex: "bloodGroup",
    key: "bloodGroup",
    filters: [
      { text: "A+", value: "A+" },
      { text: "A-", value: "A-" },
      { text: "B+", value: "B+" },
      { text: "B-", value: "B-" },
      { text: "AB+", value: "AB+" },
      { text: "AB-", value: "AB-" },
      { text: "O+", value: "O+" },
      { text: "O-", value: "O-" },
    ],
    onFilter: (value, record) => record.bloodGroup === value,
  },
];

function PatientList() {
  const [data, setData] = useState([]);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setData(patients.map((p, idx) => ({ ...p, key: idx })));
  }, []);

  const handleView = (record) => {
    setSelectedPatient(record);
    setViewDrawer(true);
  };

  const handleEdit = (record) => {
    sessionStorage.setItem("editPatient", JSON.stringify(record));
    router.push("/registration?edit=1");
  };

  // Filter data by search text (name or mobile)
  const filteredData = data.filter(
    (p) =>
      !searchText ||
      (p.fullName &&
        p.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (p.contact?.mobile && p.contact.mobile.includes(searchText))
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
    <Card
      title={
        <Row gutter={[8, 8]} className="mb-2 md:mb-0">
          <Col flex="auto">
            <span style={{ fontWeight: 600, fontSize: 18 }}>Patient List</span>
          </Col>
          <Col>
            <Input.Search
              allowClear
              placeholder="Search by name or mobile"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
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
        title="Patient Details"
        open={viewDrawer}
        onClose={() => setViewDrawer(false)}
        width={500}
      >
        {selectedPatient && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              {selectedPatient.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {selectedPatient.gender}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">
              {selectedPatient.dob}
            </Descriptions.Item>
            <Descriptions.Item label="Age">
              {selectedPatient.age?.years}y {selectedPatient.age?.months}m{" "}
              {selectedPatient.age?.days}d
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {selectedPatient.patientType?.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
              {selectedPatient.contact?.mobile}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {selectedPatient.bloodGroup}
            </Descriptions.Item>
            <Descriptions.Item label="Address 1">
              {selectedPatient.contact?.address1}
            </Descriptions.Item>
            <Descriptions.Item label="Address 2">
              {selectedPatient.contact?.address2}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms">
              {(selectedPatient.symptoms?.symtopmsNames || []).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Titles">
              {(selectedPatient.symptoms?.SymptomsTitles || []).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Description">
              {selectedPatient.symptoms?.description}
            </Descriptions.Item>
            {selectedPatient.patientType === "ipd" && (
              <>
                <Descriptions.Item label="IPD Number">
                  {selectedPatient.ipd?.ipdNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Admission Date & Time">
                  {selectedPatient.ipd?.admissionDateTime}
                </Descriptions.Item>
                <Descriptions.Item label="Height">
                  {selectedPatient.ipd?.height}
                </Descriptions.Item>
                <Descriptions.Item label="Weight">
                  {selectedPatient.ipd?.weight}
                </Descriptions.Item>
                <Descriptions.Item label="Blood Pressure">
                  {selectedPatient.ipd?.bloodPressure}
                </Descriptions.Item>
                <Descriptions.Item label="Ward Type">
                  {selectedPatient.ipd?.wardType}
                </Descriptions.Item>
                <Descriptions.Item label="Bed">
                  {selectedPatient.ipd?.bed}
                </Descriptions.Item>
                <Descriptions.Item label="Doctor">
                  {selectedPatient.ipd?.doctor}
                </Descriptions.Item>
                <Descriptions.Item label="IPD Notes">
                  {selectedPatient.ipd?.notes}
                </Descriptions.Item>
              </>
            )}
            {selectedPatient.patientType === "opd" && (
              <>
                <Descriptions.Item label="OPD Number">
                  {selectedPatient.opd?.opdNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Visit Date & Time">
                  {selectedPatient.opd?.visitDateTime}
                </Descriptions.Item>
                <Descriptions.Item label="Doctor">
                  {selectedPatient.opd?.doctor}
                </Descriptions.Item>
                <Descriptions.Item label="Consultation Fees">
                  {selectedPatient.opd?.consultationFees}
                </Descriptions.Item>
                <Descriptions.Item label="OPD Notes">
                  {selectedPatient.opd?.notes}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Drawer>
    </Card>
  );
}

export default PatientList;
