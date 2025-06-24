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
// import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import TextArea from "antd/es/input/TextArea";
// import "./PatientRegistration.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { createPatientApi, getPatientDetailsApi, updatePatientApi } from "../../services/apis";
import OPDForm from "../components/OPDForm";
import IPDForm from "../components/IPDForm";
import { generateUniqueNumber } from "../../utils/helper";

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

// const doctors = [
//   { label: "Dr. Smith", value: "smith" },
//   { label: "Dr. Ayesha", value: "ayesha" },
//   { label: "Dr. Rahul", value: "rahul" },
// ];

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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [patientType, setPatientType] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsTitles, setSymptomsTitles] = useState([]);
  const [symptomsDescription, setSymptomsDescription] = useState("");
  const [ipdNumber, setIpdNumber] = useState("");
  const [opdNumber, setOpdNumber] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);

  const location = useLocation();

  // Get patientId from URL if present
  const match = location.pathname.match(/\/registration\/edit\/([a-zA-Z0-9]+)/);
  const patientId = match ? match[1] : null;

  useEffect(() => {
    // If URL matches /registration/edit/:id, set isEdit true and fetch patient data
    if (patientId) {
      setIsEdit(true);
      const fetchPatient = async () => {
        try {
          const response = await getPatientDetailsApi(patientId);
          const patient = response.data;
          console.log(patient)
          setEditPatientId(patient.patientId); // Save patientId for display
          // Set form fields with patient data
          form.setFieldsValue({
            // Basic fields
            fullName: patient.fullName,
            gender: patient.gender,
            dob: patient.dob ? dayjs(patient.dob, "DD-MM-YYYY HH:mm") : undefined,
            bloodGroup: patient.bloodGroup,
            patientType: patient.patientType,
            // Age
            age_year: patient.age?.years,
            age_month: patient.age?.months,
            age_day: patient.age?.days,
            // Contact
            phone: patient.contact?.phone,
            email: patient.contact?.email,
            // Address
            line1: patient.address?.line1,
            line2: patient.address?.line2,
            city: patient.address?.city,
            pincode: patient.address?.pincode,
            // Symptoms
            symptoms: patient.symptoms?.symptomNames,
            symptomsTitles: patient.symptoms?.symptomTitles,
            // IPD Details
            ipdNumber: patient.ipdDetails?.ipdNumber,
            admissionDateTime: patient.ipdDetails?.admissionDate
              ? dayjs(patient.ipdDetails.admissionDate, "DD-MM-YYYY HH:mm")
              : undefined,
            bedType: patient.ipdDetails?.ward,
            bed: patient.ipdDetails?.bed,
            height: patient.ipdDetails?.height,
            weight: patient.ipdDetails?.weight,
            bloodPressure: patient.ipdDetails?.bloodPressure,
            ipdNotes: patient.ipdDetails?.notes,
            doctor: patient.ipdDetails?.attendingDoctor?._id,
            opdNumber: patient.opdDetails?.opdNumber,
            visitDateTime: patient.opdDetails?.visitDateTime
              ? dayjs(patient.opdDetails.visitDateTime, "DD-MM-YYYY HH:mm")
              : undefined,
            opdDoctor: patient.opdDetails?.doctor?.fullName,
            consultationFees: patient.opdDetails?.consultationFees,
            opdNotes: patient.opdDetails?.notes,
            // ...add more mappings if needed
          });
          setPatientType(patient.patientType);
          setSelectedSymptoms(patient.symptoms?.symptomNames || []);
          setSymptomsTitles(patient.symptoms?.symptomTitles || []);
          setSymptomsDescription(patient.symptoms?.description || "");
        } catch (error) {
          message.error("Failed to fetch patient data");
        }
      };
      fetchPatient();
    } else {
      setIsEdit(false);
      setEditPatientId(null);
    }
  }, [form, patientId]);

  const handleDob = (date, dateString) => {
    if (!date || (typeof date.isValid === "function" && !date.isValid()))
      return;

    const today = dayjs();
    const birthDate = dayjs(date);

    let years = today.diff(birthDate, "year");
    let months = today.diff(birthDate.add(years, "year"), "month");
    let days = today.diff(birthDate.add(years, "year").add(months, "month"), "day");

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
    if (selectedSymptoms.length === 0) {
      setSymptomsDescription("");
      return;
    }
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

  useEffect(() => {
    if (patientType === "IPD") {
      setIpdNumber(generateUniqueNumber("IPD"));
      form.setFieldsValue({ ipdNumber: generateUniqueNumber("IPD") });
    } else if (patientType === "OPD") {
      setOpdNumber(generateUniqueNumber("OPD"));
      form.setFieldsValue({ opdNumber: generateUniqueNumber("OPD") });
    }
  }, [patientType]);

  const handleSymptomsTitlesChange = (titles) => {
    form.setFieldsValue({ symptomsTitles: titles });
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

  const handleSymptomsDescriptionChange = (e) => {
    setSymptomsDescription(e.target.value);
  };

  const onFinish = async (values) => {
    try {
      // Convert date objects to ISO strings or formatted strings
      const formatDate = (date) =>
        date && typeof date === "object" && date.format
          ? date.format("YYYY-MM-DD")
          : date;

      const formatDateTime = (date) =>
        date && typeof date === "object" && date.format
          ? date.format("YYYY-MM-DD HH:mm")
          : date;

      const formData = new FormData();

      // primitive fields
      formData.append("fullName", values.fullName);
      formData.append("gender", values.gender);
      formData.append("dob", formatDate(values.dob));
      formData.append("age[years]", values.age_year);
      formData.append("age[months]", values.age_month);
      formData.append("age[days]", values.age_day);
      formData.append("bloodGroup", values.bloodGroup);
      formData.append("patientType", values.patientType);

      if (values.patientType === "IPD") {
        formData.append("IPD[ipdNumber]", values.ipdNumber);
        formData.append(
          "IPD[admissionDateTime]",
          formatDateTime(values.admissionDateTime)
        );
        formData.append("IPD[height]", values.height);
        formData.append("IPD[weight]", values.weight);
        formData.append("IPD[bloodPressure]", values.bloodPressure);
        formData.append("IPD[wardType]", values.bedType);
        formData.append("IPD[bed]", values.bed);
        formData.append("IPD[doctor]", values.doctor);
        formData.append("IPD[notes]", values.ipdNotes);
      }

      if (values.patientType === "OPD") {
        formData.append("OPD[opdNumber]", values.opdNumber);
        formData.append(
          "OPD[visitDateTime]",
          formatDateTime(values.visitDateTime)
        );
        formData.append("OPD[doctor]", values.opdDoctor);
        formData.append("OPD[consultationFees]", values.consultationFees);
        formData.append("OPD[notes]", values.opdNotes);
      }

      // Symptoms
      values.symptoms.forEach((s, i) =>
        formData.append(`symptoms[symptomNames][${i}]`, s)
      );
      values.symptomsTitles.forEach((t, i) =>
        formData.append(`symptoms[symptomTitles][${i}]`, t)
      );
      formData.append("symptoms[description]", symptomsDescription);

      // Address
      formData.append("address[line1]", values.line1);
      formData.append("address[line2]", values.line2);
      formData.append("address[city]", values.city);
      formData.append("address[pincode]", values.pincode);

      // Contact
      formData.append("contact[phone]", values.phone);
      formData.append("contact[email]", values.email);

      values?.medicalDocuments?.fileList.forEach((file) => {
        formData.append("medicalDocuments", file.originFileObj);
      });

      if (isEdit && patientId) {
        await updatePatientApi(patientId, formData);
        message.success("Patient updated successfully!");
        navigate(-1)
        return;
      }

      await createPatientApi(formData);
      console.log("hello")
      // message.success("Registration successful!");
      // Reset the form after successful registration
      // form.resetFields();
      // setPatientType("");
      // setSelectedSymptoms([]);
      // setSymptomsTitles([]);
      // setSymptomsDescription("");
      // generateNewNumbers();
    } catch (error) {
      message.error("Registration failed");
    }
  };

  return (
    <div className="pb-4">
      <Card
        title={
          <>
            {isEdit && editPatientId && (
              <div style={{ fontWeight: 500, color: "#888", marginBottom: 4 }}>
                Patient ID: <span style={{ color: "#222" }}>{editPatientId}</span>
              </div>
            )}
            {isEdit ? "Update Patient" : "Patient Registration"}
          </>
        }
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
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
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
                        inputReadOnly={false}
                        allowClear
                        disabledDate={(current) => current && current > dayjs().endOf("day")}
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
                        {[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                          "Unknown",
                        ].map((group) => (
                          <Option key={group} value={group}>
                            {group}
                          </Option>
                        ))}
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
                        <Option value="OPD">OPD</Option>
                        <Option value="IPD">IPD</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* IPD Details */}
            {patientType === "IPD" && (
              <Col span={24}>
                <IPDForm
                  form={form}
                  bedTypes={bedTypes}
                  beds={beds}
                />
              </Col>
            )}

            {/* OPD Details */}
            {patientType === "OPD" && (
              <Col span={24}>
                <OPDForm form={form} />
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
                      name="line1"
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
                      name="line2"
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
                      name="phone"
                      label="Mobile Number"
                      rules={[
                        {
                          required: true,
                          message: "Please enter mobile number",
                        },
                        {
                          pattern: /^[6-9]\d{9}$/,
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
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        {
                          type: "email",
                          message: "Enter a valid email address",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        type="email"
                        placeholder="e.g. example@email.com"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="medicalDocuments" label="Medical Documents">
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
    </div>
  );
}

export default PatientRegistrationPage;
