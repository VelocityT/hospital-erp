"use client";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Button,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import TextArea from "antd/es/input/TextArea";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import dayjs from "dayjs";

const { Option } = Select;
// const { TextArea } = Input;

const bedTypes = [
  { label: "General", value: "general" },
  { label: "Semi-Private", value: "semi-private" },
  { label: "Private", value: "private" },
];

const beds = [
  { label: "Bed 101", value: "bed101" },
  { label: "Bed 102", value: "bed102" },
  { label: "Bed 201", value: "bed201" },
];

const doctors = [
  { label: "Dr. Smith", value: "smith" },
  { label: "Dr. Ayesha", value: "ayesha" },
  { label: "Dr. Rahul", value: "rahul" },
];

const symptomsData = [
  {
    symptom: "Fever",
    titles: [
      { title: "Low", description: "Low grade fever below 100°F." },
      { title: "High", description: "High fever above 102°F." },
    ],
  },
  {
    symptom: "Cough",
    titles: [
      { title: "Dry", description: "Dry cough without mucus." },
      { title: "Wet", description: "Cough with mucus and congestion." },
    ],
  },
  {
    symptom: "Headache",
    titles: [
      { title: "Mild", description: "Mild pain." },
      { title: "Severe", description: "Severe pulsing pain." },
    ],
  },
];

function PatientRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  // const [messageApi, contextHolder] = message.useMessage();
  const [patientType, setPatientType] = useState("");
  // const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsTitles, setSymptomsTitles] = useState([]);
  const [symptomsDescription, setSymptomsDescription] = useState("");
  const [ipdNumber, setIpdNumber] = useState("");
  const [opdNumber, setOpdNumber] = useState("");

  const location = usePathname();

  // Determine if we are in edit mode
  const isEdit = searchParams.get("edit") === "1";

  useEffect(() => {
    // If edit mode, load patient data from sessionStorage
    if (searchParams.get("edit") === "1") {
      const editPatient = sessionStorage.getItem("editPatient");
      if (editPatient) {
        const patient = JSON.parse(editPatient);
        form.setFieldsValue({
          ...patient,
          ...patient.contact,
          ...patient.age,
          ...patient.ipd,
          ...patient.opd,
          symptoms: patient.symptoms?.symtopmsNames,
          symptomsTitles: patient.symptoms?.SymptomsTitles,
          dob: patient.dob ? dayjs(patient.dob) : undefined,
          admissionDateTime: patient.ipd?.admissionDateTime
            ? dayjs(patient.ipd.admissionDateTime, "YYYY-MM-DD HH:mm")
            : undefined,
          visitDateTime: patient.opd?.visitDateTime
            ? dayjs(patient.opd.visitDateTime, "YYYY-MM-DD HH:mm")
            : undefined,
        });
        setPatientType(patient.patientType);
        setSelectedSymptoms(patient.symptoms?.symtopmsNames || []);
        setSymptomsTitles(patient.symptoms?.SymptomsTitles || []);
        setSymptomsDescription(patient.symptoms?.description || "");
      }
    }
  }, [form, searchParams]);

  const handleDob = (date, dateString) => {
    if (!date || (typeof date.isValid === "function" && !date.isValid()))
      return;

    const birthDate = new Date(dateString);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    form.setFieldsValue({
      age_year: years,
      age_month: months,
      age_day: days,
    });
  };

  // useEffect(() => {
  //   const getSymptoms = symptomsData.map((data) => data?.symptom);
  //   setSymptoms(getSymptoms);
  // }, []);
  useEffect(() => {
    const allTitles = symptomsData
      .filter((data) => selectedSymptoms.includes(data.symptom))
      .flatMap((data) => data.titles.map((t) => t.title));
    setSymptomsTitles(allTitles);
  }, [selectedSymptoms]);

  useEffect(() => {
    form.setFieldsValue({ ipdNumber });
  }, [ipdNumber, form]);

  useEffect(() => {
    form.setFieldsValue({ opdNumber });
  }, [opdNumber, form]);

  useEffect(() => {
    // Auto-fill symptoms description based on selected titles
    if (selectedSymptoms.length === 0) {
      setSymptomsDescription("");
      return;
    }
    // Gather all selected titles' descriptions
    const selectedTitles = form.getFieldValue("symptomsTitles") || [];
    let descriptions = [];
    for (const symptom of selectedSymptoms) {
      const data = symptomsData.find((s) => s.symptom === symptom);
      if (data) {
        for (const title of selectedTitles) {
          const found = data.titles.find((t) => t.title === title);
          if (found) {
            descriptions.push(`${title}: ${found.description}`);
          }
        }
      }
    }
    setSymptomsDescription(descriptions.join("\n"));
  }, [selectedSymptoms, symptomsTitles, form]);

  const generateNewNumbers = () => {
    const newIPD = `IPD${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const newOPD = `OPD${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    setIpdNumber(newIPD);
    setOpdNumber(newOPD);
  };
  useEffect(() => {
    generateNewNumbers();
  }, []);
  // Update description when symptomsTitles change
  const handleSymptomsTitlesChange = (titles) => {
    form.setFieldsValue({ symptomsTitles: titles });
    // Gather all selected titles' descriptions
    let descriptions = [];
    for (const symptom of selectedSymptoms) {
      const data = symptomsData.find((s) => s.symptom === symptom);
      if (data) {
        for (const title of titles) {
          const found = data.titles.find((t) => t.title === title);
          if (found) {
            descriptions.push(`${title}: ${found.description}`);
          }
        }
      }
    }
    setSymptomsDescription(descriptions.join("\n"));
  };

  // Handler for manual edit of symptoms description
  const handleSymptomsDescriptionChange = (e) => {
    setSymptomsDescription(e.target.value);
  };

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        if (values.patientType === "ipd") {
          router.push("/ipd");
        } else if (values.patientType === "opd") {
          router.push("/opd");
        }
      }
      // Convert date objects to ISO strings or formatted strings
      const formatDate = (date) =>
        date && typeof date === "object" && date.format
          ? date.format("YYYY-MM-DD")
          : date;

      const formatDateTime = (date) =>
        date && typeof date === "object" && date.format
          ? date.format("YYYY-MM-DD HH:mm")
          : date;

      const patientData = {
        fullName: values.fullName,
        gender: values.gender,
        dob: formatDate(values.dob),
        age: {
          years: values.age_year,
          months: values.age_month,
          days: values.age_day,
        },
        bloodGroup: values.bloodGroup,
        patientType: values.patientType,
        ipd:
          values.patientType === "ipd"
            ? {
                ipdNumber: values.ipdNumber,
                admissionDateTime: formatDateTime(values.admissionDateTime),
                height: values.height,
                weight: values.weight,
                bloodPressure: values.bloodPressure,
                wardType: values.bedType,
                bed: values.bed,
                doctor: values.doctor,
                notes: values.ipdNotes,
              }
            : null,
        opd:
          values.patientType === "opd"
            ? {
                opdNumber: values.opdNumber,
                visitDateTime: formatDateTime(values.visitDateTime),
                doctor: values.opdDoctor,
                consultationFees: values.consultationFees,
                notes: values.opdNotes,
              }
            : null,
        symptoms: {
          symtopmsNames: values.symptoms,
          SymptomsTitles: values.symptomsTitles,
          description: symptomsDescription,
        },
        contact: {
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          pincode: values.pincode,
          mobile: values.mobile,
        },
        documents: values.documents,
      };

      let prevPatients = JSON.parse(localStorage.getItem("patients") || "[]");

      if (searchParams.get("edit") === "1") {
        // Update existing patient
        const editPatient = sessionStorage.getItem("editPatient");
        if (editPatient) {
          const patient = JSON.parse(editPatient);
          // Find by unique fields (fullName, dob, mobile)
          const idx = prevPatients.findIndex(
            (p) =>
              p.fullName === patient.fullName &&
              p.dob === patient.dob &&
              p.contact?.mobile === patient.contact?.mobile
          );
          if (idx !== -1) {
            prevPatients[idx] = patientData;
          } else {
            prevPatients.push(patientData);
          }
        }
        sessionStorage.removeItem("editPatient");
      } else {
        prevPatients.push(patientData);
      }
      localStorage.setItem("patients", JSON.stringify(prevPatients));

      message.success("Registration successful!");
      console.log("Patient Data:", patientData);

      // Reset the form after successful registration
      form.resetFields();
      setPatientType("");
      setSelectedSymptoms([]);
      setSymptomsTitles([]);
      setSymptomsDescription("");
      generateNewNumbers();
    } catch (error) {
      message.error("Registration failed");
    }
  };

  return (
    <div className="pb-4">
      {/* <Row justify="center" className="mt-5 w-100"> */}
      {/* <Col> */}
      <Card
        title={isEdit ? "Update Patient" : "Patient Registration"}
        bordered={false}
        className="bg-transparent border-none"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[0, 24]}>
            {/* Personal Details */}
            <Col span={24}>
              <Card title="Personal Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter patient name",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[
                        { required: true, message: "Please select gender" },
                      ]}
                    >
                      <Select size="large" placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} wrap>
                  {/* DOB */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dob"
                      label="Date of Birth"
                      rules={[
                        {
                          required: true,
                          message: "Please select date of birth",
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        onChange={handleDob}
                        inputReadOnly={false} // allow hand-written date
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  {/* Age Inputs */}
                  <Col xs={24} md={12}>
                    <Row
                      gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                      }}
                    >
                      <Col span={8}>
                        <Form.Item name="age_year" label="Years">
                          <Input
                            disabled
                            type="number"
                            size="large"
                            placeholder="YY"
                            className="text-center"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="age_month" label="Months">
                          <Input
                            disabled
                            type="number"
                            size="large"
                            placeholder="MM"
                            className="text-center"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="age_day" label="Days">
                          <Input
                            disabled
                            type="number"
                            size="large"
                            placeholder="DD"
                            className="text-center"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Blood Group */}
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={6}>
                    <Form.Item name="bloodGroup" label="Blood Group">
                      <Select size="large" placeholder="Select blood group">
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (group) => (
                            <Option key={group} value={group}>
                              {group}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={6}>
                    <Form.Item
                      name="patientType"
                      label="Patient Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select patient type",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Select Patient Type"
                        onChange={(value) => setPatientType(value)}
                        allowClear
                      >
                        <Option value="opd">OPD</Option>
                        <Option value="ipd">IPD</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* IPD Details */}
            {patientType === "ipd" && (
              <Col span={24}>
                <Card title="IPD Details" bordered={false}>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="IPD Number" name="ipdNumber">
                        <Input size="large" value={ipdNumber} readOnly />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Admission Date & Time"
                        name="admissionDateTime"
                        rules={[
                          {
                            required: true,
                            message: "Please select date and time",
                          },
                        ]}
                        initialValue={dayjs()} // set default to now
                      >
                        <DatePicker
                          showTime
                          size="large"
                          style={{ width: "100%" }}
                          format="YYYY-MM-DD HH:mm"
                          disabled={true} // make not editable
                          value={
                            form.getFieldValue("admissionDateTime") || dayjs()
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Height (cm)" name="height">
                        <Input size="large" placeholder="e.g., 170" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Weight (kg)" name="weight">
                        <Input size="large" placeholder="e.g., 65" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Blood Pressure" name="bloodPressure">
                        <Input size="large" placeholder="e.g., 120/80" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Ward Type" name="bedType" required>
                        <Select
                          size="large"
                          placeholder="Select Ward Type"
                          options={bedTypes}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Bed" name="bed" required>
                        <Select
                          size="large"
                          placeholder="Select Bed"
                          options={beds}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Doctor" name="doctor" required>
                        <Select
                          size="large"
                          placeholder="Assign Doctor"
                          options={doctors}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item label="IPD Notes" name="ipdNotes">
                        <TextArea
                          // rows={2}
                          autoSize={{ minRows: 2 }}
                          placeholder="Any notes or remarks for IPD admission"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}

            {/* OPD Details */}
            {patientType === "opd" && (
              <Col span={24}>
                <Card title="OPD Details" bordered={false}>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="OPD Number"
                        name="opdNumber"
                        rules={[
                          {
                            required: true,
                            message: "Please enter OPD Number",
                          },
                        ]}
                      >
                        <Input size="large" value={opdNumber} readOnly />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Visit Date & Time"
                        name="visitDateTime"
                        rules={[
                          {
                            required: true,
                            message: "Please select visit date and time",
                          },
                        ]}
                        initialValue={dayjs()} // set default to now
                      >
                        <DatePicker
                          showTime
                          size="large"
                          style={{ width: "100%" }}
                          format="YYYY-MM-DD HH:mm"
                          disabled={true} // make not editable
                          value={form.getFieldValue("visitDateTime") || dayjs()}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Consulting Doctor"
                        name="opdDoctor"
                        rules={[
                          { required: true, message: "Please select doctor" },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder="Select Doctor"
                          options={doctors}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Consultation Fees"
                        name="consultationFees"
                        rules={[
                          { required: true, message: "Please enter fees" },
                        ]}
                      >
                        <Input
                          size="large"
                          type="number"
                          placeholder="e.g., 500"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Col xs={24}>
                    <Form.Item label="OPD Notes" name="opdNotes">
                      <TextArea
                        // rows={2}
                        autoSize={{ minRows: 2 }}
                        placeholder="Any notes or remarks for OPD visit"
                      />
                    </Form.Item>
                  </Col>
                </Card>
              </Col>
            )}

            {/* Symptoms Details */}
            <Col span={24}>
              <Card title="Symptoms Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Select Symptoms"
                      name="symptoms"
                      rules={[
                        {
                          required: true,
                          message: "Please select at least one symptom",
                        },
                      ]}
                    >
                      <Select
                        mode="tags"
                        size="large"
                        placeholder="Select Symptoms"
                        onChange={(values) => setSelectedSymptoms(values)}
                        options={symptomsData.map((s) => ({
                          label: s.symptom,
                          value: s.symptom,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Select Symptoms"
                      name="symptomsTitles"
                      required
                    >
                      <Select
                        mode="tags"
                        size="large"
                        placeholder="Select Symptoms"
                        options={symptomsTitles.map((t) => ({
                          label: t,
                          value: t,
                        }))}
                        onChange={handleSymptomsTitlesChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row> */}
                <Col sx={24}>
                  <Form.Item label="Symptoms Description">
                    <TextArea
                      value={symptomsDescription}
                      autoSize={{ minRows: 3 }}
                      onChange={handleSymptomsDescriptionChange}
                      placeholder="Add Description"
                    />
                  </Form.Item>
                </Col>
                {/* </Row> */}
              </Card>
            </Col>

            {/* Contact Details */}
            <Col span={24}>
              <Card title="Contact Details" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="address1"
                      label="Address Line 1"
                      rules={[
                        { required: true, message: "Enter Address Line 1" },
                      ]}
                    >
                      <Input size="large" placeholder="House No, Street" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="address2"
                      label="Address Line 2"
                      rules={[{ required: false }]}
                    >
                      <Input
                        size="large"
                        placeholder="Apartment, Landmark (optional)"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: "Enter City" }]}
                    >
                      <Input size="large" placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="pincode"
                      label="Pincode"
                      rules={[
                        { required: true, message: "Enter Pincode" },
                        {
                          pattern: /^[0-9]{6}$/,
                          message: "Pincode must be 6 digits",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        type="number"
                        placeholder="e.g. 560001"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="mobile"
                      label="Mobile Number"
                      rules={[
                        {
                          required: true,
                          message: "Please enter mobile number",
                        },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter valid 10-digit Indian mobile number",

                          message: "Enter valid 10-digit Indian mobile number",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="documents"
                  label="Medical Documents"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e?.fileList
                  }
                >
                  <Upload multiple beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Upload Files</Button>
                  </Upload>
                </Form.Item>
              </Card>
            </Col>

            {/* Submit Button */}
            <Col span={24}>
              <Form.Item className="text-end mt-4">
                <Button type="primary" size="large" htmlType="submit">
                  {isEdit ? "Update Patient" : "Register Patient"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      {/* </Col> */}
      {/* // </Row> */}
    </div>
  );
}

export default PatientRegistrationPage;
