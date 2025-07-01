import React from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Select,
  Input,
  Button,
} from "antd";
import {
  medicineCategories,
  doseIntervals,
  doseDurations,
  pathologyTests,
  radiologyTests,
} from "../../utils/localStorage";

const { Title, Text } = Typography;

const Prescription = () => {
  const location = useLocation();
  const patientRecord = location.state;

  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [medicinesList, setMedicinesList] = React.useState([]);
  const [selectedPathology, setSelectedPathology] = React.useState([]);
  const [selectedRadiology, setSelectedRadiology] = React.useState([]);
  const [note, setNote] = React.useState("");

  // Get medicines for selected category
  const medicines =
    medicineCategories.find((cat) => cat.category === selectedCategory)
      ?.medicines || [];

  if (!patientRecord) return null;

  const {
    opdNumber,
    ipdNumber,
    patient = {},
    doctor = {},
    visitDateTime,
  } = patientRecord;

  // Handler to add medicine to the list
  const handleAddMedicine = () => {
    form
      .validateFields()
      .then((values) => {
        setMedicinesList((prev) => [...prev, values]);
        form.resetFields();
        setSelectedCategory(undefined);
      })
      .catch(() => {});
  };

  // Handler to remove a medicine from the list
  const handleRemoveMedicine = (idx) => {
    setMedicinesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    const patientDescription = {
      opdNumber,
      ipdNumber,
      patientId: patient.patientId,
      fullName: patient.fullName,
      gender: patient.gender,
      dob: patient.dob,
      bloodGroup: patient.bloodGroup,
      phone: patient.contact?.phone,
      doctorFullName: doctor.fullName,
    };

    const data = {
      patientRecord,
      medicinesList,
      selectedPathology,
      selectedRadiology,
      note,
    };

    localStorage.setItem("printPrescription", JSON.stringify(data));
    localStorage.setItem("printPatientDescription", JSON.stringify(patientDescription));

    window.open("/print", "_blank");
  };

  return (
    <>
      {/* Patient Info Card */}
      <Card className="m-4">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} sm={12}>
            <Title level={5} className="mb-0">
              {ipdNumber ? "IPD Number" : "OPD Number"}{" "}
              <Text strong>{ipdNumber || opdNumber || "-"}</Text>
            </Title>
          </Col>
          <Col xs={24} sm={12}>
            <Title level={5} className="mb-0">
              Patient ID: <Text strong>{patient.patientId || "-"}</Text>
            </Title>
          </Col>
        </Row>
        <Divider className="my-3" />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="mb-2">
              <Text>
                <b>Name:</b> {patient.fullName || "-"}
              </Text>
            </div>
            <div className="mb-2">
              <Text>
                <b>Gender:</b> {patient.gender || "-"}
              </Text>
            </div>
            <div className="mb-2">
              <Text>
                <b>DOB:</b>{" "}
                {patient.dob ? new Date(patient.dob).toLocaleDateString() : "-"}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mb-2">
              <Text>
                <b>Blood Group:</b> {patient.bloodGroup || "-"}
              </Text>
            </div>
            <div className="mb-2">
              <Text>
                <b>Phone:</b> {patient.contact?.phone || "-"}
              </Text>
            </div>
            <div className="mb-2">
              <Text>
                <b>Doctor:</b> {doctor.fullName || "-"}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Prescription Entry Card */}
      <Card className="m-4" title="Add Medicine & Tests">
        <Form form={form} layout="vertical" initialValues={{}}>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                label="Medicine Category"
                name="medicineCategory"
                rules={[{ required: true, message: "Select category" }]}
              >
                <Select
                  placeholder="Select category"
                  onChange={setSelectedCategory}
                  allowClear
                  value={selectedCategory}
                >
                  {medicineCategories.map((cat) => (
                    <Select.Option key={cat.category} value={cat.category}>
                      {cat.category}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Medicine"
                name="medicine"
                rules={[{ required: true, message: "Select medicine" }]}
              >
                <Select
                  placeholder="Select medicine"
                  disabled={!selectedCategory}
                >
                  {medicines.map((med) => (
                    <Select.Option key={med.name} value={med.name}>
                      {med.name} ({med.unit})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Dose Interval"
                name="doseInterval"
                rules={[{ required: true, message: "Select interval" }]}
              >
                <Select placeholder="Select interval">
                  {doseIntervals.map((d) => (
                    <Select.Option key={d.value} value={d.value}>
                      {d.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Dose Duration"
                name="doseDuration"
                rules={[{ required: true, message: "Select duration" }]}
              >
                <Select placeholder="Select duration">
                  {doseDurations.map((d) => (
                    <Select.Option key={d.value} value={d.value}>
                      {d.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={handleAddMedicine}>
                Add Medicine
              </Button>
            </Col>
          </Row>
          <Divider className="my-3" />
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Pathology Lab Tests">
                <Select
                  mode="multiple"
                  placeholder="Select pathology tests"
                  value={selectedPathology}
                  onChange={setSelectedPathology}
                  allowClear
                >
                  {pathologyTests.map((test) => (
                    <Select.Option key={test.code} value={test.code}>
                      {test.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Radiology Lab Tests">
                <Select
                  mode="multiple"
                  placeholder="Select radiology tests"
                  value={selectedRadiology}
                  onChange={setSelectedRadiology}
                  allowClear
                >
                  {radiologyTests.map((test) => (
                    <Select.Option key={test.code} value={test.code}>
                      {test.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item label="Doctor's Note">
                <Input.TextArea
                  rows={3}
                  placeholder="Add any note or instruction"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* List of added medicines */}
        {medicinesList.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Divider>Medicines Added</Divider>
            {medicinesList.map((med, idx) => (
              <Row
                key={idx}
                gutter={8}
                align="middle"
                style={{ marginBottom: 8 }}
              >
                <Col flex="auto">
                  <b>{med.medicine}</b> | {med.medicineCategory} |{" "}
                  {
                    doseIntervals.find((d) => d.value === med.doseInterval)
                      ?.label
                  }{" "}
                  |{" "}
                  {
                    doseDurations.find((d) => d.value === med.doseDuration)
                      ?.label
                  }
                </Col>
                <Col>
                  <Button
                    danger
                    size="small"
                    onClick={() => handleRemoveMedicine(idx)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        )}
        {/* Show selected tests */}
        {(selectedPathology.length > 0 || selectedRadiology.length > 0) && (
          <div style={{ marginTop: 24 }}>
            <Divider>Lab Tests Selected</Divider>
            {selectedPathology.length > 0 && (
              <div>
                <b>Pathology:</b>{" "}
                {selectedPathology
                  .map(
                    (code) =>
                      pathologyTests.find((t) => t.code === code)?.name || code
                  )
                  .join(", ")}
              </div>
            )}
            {selectedRadiology.length > 0 && (
              <div>
                <b>Radiology:</b>{" "}
                {selectedRadiology
                  .map(
                    (code) =>
                      radiologyTests.find((t) => t.code === code)?.name || code
                  )
                  .join(", ")}
              </div>
            )}
          </div>
        )}
        {/* Print and Save Buttons */}
        <Row gutter={16} justify="end" style={{ marginTop: 32 }}>
          <Col>
            <Button type="default" onClick={() => handlePrint()}>
              Print
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                // Save logic here
                // You can collect all data and send to API
                // Example:
                // const prescriptionData = { medicinesList, selectedPathology, selectedRadiology, note, patientRecord }
                // savePrescriptionApi(prescriptionData)
                //   .then(() => message.success("Prescription saved!"))
                //   .catch(() => message.error("Failed to save"));
              }}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Prescription;
