"use client"
import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Avatar,
  Row,
  Col,
  Tag,
  Tabs,
  Button,
  Empty,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

const PatientProfile = () => {
  const params = useParams();
  const id = params.id;
  const [patient, setPatient] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const found = patients.find(
      (p) =>
        (p.ipd && p.ipd.ipdNumber === id) || (p.opd && p.opd.opdNumber === id)
    );
    setPatient(found || null);
  }, [id]);

  if (!patient) {
    return (
      <Card>
        <p>Patient not found.</p>
        <Button onClick={() => router.back()}>Back</Button>
      </Card>
    );
  }

  // Dummy stats for demonstration
  const stats = [
    { label: "Total Cases", value: 0 },
    { label: "Total Admissions", value: 0 },
    { label: "Total Appointments", value: 0 },
  ];

  return (
    <div>
      {/* Top Card: Profile Summary */}
      <Row justify="end" className="mb-3">
        <Button onClick={() => router.back()}>Back</Button>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              src={patient.photoUrl}
              style={{ background: "#e6f7ff" }}
            />
          </Col>
          <Col flex="auto">
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Tag color="red">Inactive</Tag>
                <span style={{ fontWeight: 600, fontSize: 20, marginLeft: 8 }}>
                  {patient.fullName}
                </span>
              </Col>
              <Col span={24}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {patient.contact?.address1}
                {patient.contact?.address2
                  ? `, ${patient.contact.address2}`
                  : ""}
                {patient.contact?.city ? `, ${patient.contact.city}` : ""}
                {patient.contact?.pincode ? `, ${patient.contact.pincode}` : ""}
              </Col>
              <Col span={24}>
                <MailOutlined style={{ marginRight: 4 }} />
                {patient.contact?.email || "-"}
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={16}>
              {stats.map((s) => (
                <Col key={s.label}>
                  <Card
                    style={{
                      minWidth: 120,
                      textAlign: "center",
                      background: "#141414",
                      color: "#fff",
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 12 }}>{s.label}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Tabs Card */}
      <Card>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: "Overview",
              children: (
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Full Name">
                    {patient.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {patient.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="DOB">
                    {patient.dob}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {patient.age?.years}y {patient.age?.months}m{" "}
                    {patient.age?.days}d
                  </Descriptions.Item>
                  <Descriptions.Item label="Blood Group">
                    {patient.bloodGroup}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Type">
                    {patient.patientType?.toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile">
                    {patient.contact?.mobile}
                  </Descriptions.Item>
                  <Descriptions.Item label="Symptoms">
                    {(patient.symptoms?.symtopmsNames || []).join(", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Symptoms Titles">
                    {(patient.symptoms?.SymptomsTitles || []).join(", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Symptoms Description">
                    {patient.symptoms?.description}
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: "admissions",
              label: "Patient Admissions",
              children:
                patient.patientType === "ipd" ? (
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="IPD Number">
                      {patient.ipd?.ipdNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Admission Date & Time">
                      {patient.ipd?.admissionDateTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Height">
                      {patient.ipd?.height}
                    </Descriptions.Item>
                    <Descriptions.Item label="Weight">
                      {patient.ipd?.weight}
                    </Descriptions.Item>
                    <Descriptions.Item label="Blood Pressure">
                      {patient.ipd?.bloodPressure}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ward Type">
                      {patient.ipd?.wardType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bed">
                      {patient.ipd?.bed}
                    </Descriptions.Item>
                    <Descriptions.Item label="Doctor">
                      {patient.ipd?.doctor}
                    </Descriptions.Item>
                    <Descriptions.Item label="IPD Notes">
                      {patient.ipd?.notes}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Empty description="No Data Found" />
                ),
            },
            {
              key: "appointments",
              label: "Appointments",
              children: <Empty description="No Data Found" />,
            },
            {
              key: "bills",
              label: "Bills",
              children: <Empty description="No Data Found" />,
            },
            {
              key: "invoices",
              label: "Invoices",
              children: <Empty description="No Data Found" />,
            },
            {
              key: "advance-payments",
              label: "Advance Payments",
              children: <Empty description="No Data Found" />,
            },
            {
              key: "documents",
              label: "Documents",
              children: <Empty description="No Data Found" />,
            },
            {
              key: "vaccinations",
              label: "Vaccinations",
              children: <Empty description="No Data Found" />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default PatientProfile;
