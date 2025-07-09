import { useState, useEffect } from "react";
import {
  Input,
  Card,
  Spin,
  Empty,
  Typography,
  message,
  Modal,
  Col,
  Row,
  Tabs,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  searchPatientApi,
  getPatientFullDetailsApi,
} from "../../services/apis";
import PayModal from "../components/billing/PayModal";
import {
  IpdChargeTable,
  OpdChargeTable,
  PrescriptionChargeTable,
} from "../components/billing/ChargeTable";

dayjs.extend(duration);
const { Text } = Typography;

const PatientBilling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const currentDate = dayjs().format("DD/MM/YYYY HH:mm");

  // For simulation
  // const TAX_PERCENT = 20;
  // const DISCOUNT_PERCENT = 10;

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length >= 4) {
        setLoading(true);
        const res = await searchPatientApi(searchTerm);
        setPatients(res.success ? res.patients : []);
        setLoading(false);
      } else {
        setPatients([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelectPatient = async (id) => {
    setSearchTerm("");
    setFetchingDetails(true);
    const res = await getPatientFullDetailsApi(id);
    if (res.success) {
      setPatient({
        ...res.data.patient,
        ipds: res.data.ipds || [],
        opds: res.data.opds || [],
      });
    } else {
      message.error("Failed to fetch patient details");
    }
    setFetchingDetails(false);
  };

  const tabs = [
    {
      label: "IPD",
      key: "IPD",
      children:
        patient?.ipds.length > 0 ? (
          <IpdChargeTable
            patient={patient}
            ipdEntries={patient?.ipds}
            setSelectedEntry={setSelectedEntry}
          />
        ) : (
          <div className="text-center py-4 text-gray-500">
            No discharged IPD found
          </div>
        ),
    },
    {
      label: "OPD",
      key: "OPD",
      children:
        patient?.opds?.length > 0 ? (
          <OpdChargeTable
            patient={patient}
            opdEntries={patient?.opds}
            setSelectedEntry={setSelectedEntry}
          />
        ) : (
          <div className="text-center py-4 text-gray-500">
            No discharged OPD found
          </div>
        ),
    },
    {
      label: "Prescription",
      key: "Prescription",
      children: <PrescriptionChargeTable />,
    },
  ];

  return (
    <div className="p-4 mx-auto space-y-6">
      {/* Search */}
      <Card title="Search Patient by Phone no. or ID" className="print:hidden">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Enter patient ID or name"
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <div className="flex justify-center mt-6">
            <Spin />
          </div>
        ) : patients.length ? (
          <div className="mt-4 border rounded">
            {patients.map((p) => (
              <div
                key={p.patientId}
                className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => handleSelectPatient(p.patientId)}
              >
                <Text strong>{p.fullName}</Text> - <Text>{p.patientId}</Text>{" "}
                &nbsp;
                <Text type="secondary">📞 {p.contact?.phone || "-"}</Text>
              </div>
            ))}
          </div>
        ) : (
          searchTerm.length >= 4 && (
            <Empty className="mt-4" description="No matching patients found" />
          )
        )}
      </Card>

      {/* Patient Info */}
      {fetchingDetails ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        patient && (
          <>
            <div title="Patient Details" className="print:text-black">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Text strong>Name:</Text> {patient.fullName}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Patient ID:</Text> {patient.patientId}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Phone:</Text> {patient.contact?.phone || "-"}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Email:</Text> {patient.contact?.email || "-"}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Gender:</Text> {patient.gender}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Blood Group:</Text> {patient.bloodGroup || "-"}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Date of Birth:</Text>{" "}
                  {dayjs(patient.dob).format("DD/MMM/YYYY")}
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Age:</Text>
                  {patient.age
                    ? `${patient.age.years}y ${patient.age.months}m ${patient.age.days}d`
                    : "-"}
                </Col>
                <Col xs={24}>
                  <Text strong>Address:</Text>
                  <br />
                  {patient.address?.line1}, {patient.address?.line2}
                  <br />
                  {patient.address?.city} - {patient.address?.pincode}
                </Col>
              </Row>
            </div>

            <Tabs defaultActiveKey="IPD" items={tabs} />
            <Modal
              title={`Billing Info ${currentDate}`}
              open={!!selectedEntry}
              closable={true}
              onCancel={() => setSelectedEntry(null)}
              footer={null}
            >
              <PayModal
                data={{
                  _id: patient?._id,
                  fullName: patient?.fullName,
                  patientId: patient?.patientId,
                  selectedEntry,
                }}
                setSelectedEntry={setSelectedEntry}
                setPatient={setPatient}
              />
            </Modal>
          </>
        )
      )}
    </div>
  );
};

export default PatientBilling;
