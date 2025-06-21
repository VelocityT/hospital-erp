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
import Link from "next/link";

const getAllPatients = () =>
  JSON.parse(localStorage.getItem("patients") || "[]");

function OPDIPDList({ type }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const patients = getAllPatients();
    const filtered = patients
      .filter((p) => p.patientType === type)
      .map((p, idx) => ({ ...p, key: idx }));
    setData(filtered);
    setFilteredData(filtered);
  }, [type]);

  useEffect(() => {
    let filtered = data;
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.fullName && p.fullName.toLowerCase().includes(lower)) ||
          (p.contact?.mobile && p.contact.mobile.includes(lower))
      );
    }
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleView = (record) => {
    setSelectedPatient(record);
    setViewDrawer(true);
  };

  const handleEdit = (record) => {
    sessionStorage.setItem("editPatient", JSON.stringify(record));
    router.push("/patients/registration?edit=1");
  };

  const columns = [
    {
      title: type === "ipd" ? "Admission Date & Time" : "Visit Date & Time",
      key: "admitDateTime",
      render: (_, record) =>
        type === "ipd"
          ? record.ipd?.admissionDateTime || "-"
          : record.opd?.visitDateTime || "-",
      sorter: (a, b) => {
        const aDate =
          type === "ipd" ? a.ipd?.admissionDateTime : a.opd?.visitDateTime;
        const bDate =
          type === "ipd" ? b.ipd?.admissionDateTime : b.opd?.visitDateTime;
        return new Date(aDate) - new Date(bDate);
      },
    },
    {
      title: type === "ipd" ? "IPD Number" : "OPD Number",
      key: "number",
      render: (_, record) => {
        const id =
          type === "ipd" ? record.ipd?.ipdNumber : record.opd?.opdNumber;
        return id ? <Link href={`/patients/${id}`}>{id}</Link> : "-";
      },
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Mobile",
      dataIndex: ["contact", "mobile"],
      key: "mobile",
      render: (_, record) => record.contact?.mobile || "-",
      sorter: (a, b) =>
        (a.contact?.mobile || "").localeCompare(b.contact?.mobile || ""),
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) =>
        type === "ipd" ? record.ipd?.doctor : record.opd?.doctor,
    },
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
        <Row gutter={[8, 20]} align="middle" justify="space-between">
          <Col>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              {type === "ipd" ? "IPD Patient List" : "OPD Patient List"}
            </span>
          </Col>
          <Col md={8}>
            <Input.Search
              allowClear
              placeholder="Search by name or mobile"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              className=" mb-4 md:mb-2"
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

      {/* View Drawer */}
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
            <Descriptions.Item label="Mobile">
              {selectedPatient.contact?.mobile}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {selectedPatient.patientType?.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {type === "ipd"
                ? selectedPatient.ipd?.doctor
                : selectedPatient.opd?.doctor}
            </Descriptions.Item>
            <Descriptions.Item
              label={type === "ipd" ? "Admission Date" : "Visit Date"}
            >
              {type === "ipd"
                ? selectedPatient.ipd?.admissionDateTime
                : selectedPatient.opd?.visitDateTime}
            </Descriptions.Item>
            {/* Add more details as needed */}
            <Descriptions.Item label="Gender">
              {selectedPatient.gender}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">
              {selectedPatient.dob}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {selectedPatient.contact?.city}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {selectedPatient.bloodGroup}
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
            {type === "ipd" && (
              <>
                <Descriptions.Item label="IPD Number">
                  {selectedPatient.ipd?.ipdNumber}
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
                <Descriptions.Item label="IPD Notes">
                  {selectedPatient.ipd?.notes}
                </Descriptions.Item>
              </>
            )}
            {type === "opd" && (
              <>
                <Descriptions.Item label="OPD Number">
                  {selectedPatient.opd?.opdNumber}
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

export default OPDIPDList;
