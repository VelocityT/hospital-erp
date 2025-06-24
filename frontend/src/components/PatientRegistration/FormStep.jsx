import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Button,
  Radio,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

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

function FormStep({ form }) {
  const [patientType, setPatientType] = useState("");
  const [age, setAge] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsTitles, setSymptomsTitles] = useState([]);

  // const [form] = Form.useForm();
  const [ipdNumber] = useState(
    () => `IPD${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );

  const handleDob = (date, dateString) => {
    if (!date) return;

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

  // const handleType=(e)=>{
  //   console.log(e.target.value)
  //   if(e.target.value=="opd") setIsOpd(true)
  //   if(e.target.value=="ipd") setIsIpd(true)
  // }
  useEffect(() => {
    const getSymptoms = symptomsData.map((data) => data?.symptom);
    // setSymptoms(getSymptoms)
    form.setFieldsValue({ symptoms: getSymptoms });
  }, []);
  useEffect(() => {
    const allTitles = symptomsData
      .filter((data) => selectedSymptoms.includes(data.symptom))
      .flatMap((data) => data.titles.map((t) => t.title)); // get title strings

    setSymptomsTitles(allTitles);
  }, [selectedSymptoms]);

  useEffect(() => {
    form.setFieldsValue({ ipdNumber }); // Set it once into the form
  }, [ipdNumber, form]);

  return (
    <>
      <Col className="d-flex gap-y-5 flex-col">
        <Card title="Personal Details" bordered={false}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter patient name" },
                ]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender" }]}
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
            <Col xs={24} md={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current.toDate() > new Date()
                  }
                  onChange={handleDob}
                />
              </Form.Item>
            </Col>

            {/* Age Inputs */}
            <Col xs={24} md={8}>
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

            {/* Blood Group */}
            <Col xs={24} md={8}>
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
          </Row>

          <Col xs={24} md={12}>
            <Form.Item
              name="patientType"
              label="Patient Type"
              rules={[
                { required: true, message: "Please select patient type" },
              ]}
            >
              <Radio.Group>
                <Radio value="opd" onClick={() => setPatientType("opd")}>
                  OPD
                </Radio>
                <Radio value="ipd" onClick={() => setPatientType("ipd")}>
                  IPD
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Card>

        {patientType === "ipd" && (
          <Card title="IPD Details" bordered={false}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="IPD Number" name="ipdNumber">
                  <Input
                    size="large"
                    value={`IPD${Math.random()
                      .toString(36)
                      .substring(2, 8)
                      .toUpperCase()}`}
                    readOnly
                  />
                </Form.Item>
              </Col>

              {/* <Col xs={24} md={8}>
                <Form.Item
                  label="Case"
                  name="case"
                  rules={[
                    { required: true, message: "Please enter case details" },
                  ]}
                >
                  <Input size="large" placeholder="Case details" />
                </Form.Item>
              </Col> */}

              <Col xs={24} md={8}>
                <Form.Item
                  label="Admission Date & Time"
                  name="admissionDateTime"
                  rules={[
                    { required: true, message: "Please select date and time" },
                  ]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm"
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
                <Form.Item label="Bed Type" name="bedType" required>
                  <Select
                    size="large"
                    placeholder="Select Bed Type"
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
          </Card>
        )}

        {patientType == "opd" && (
          <Card title="OPD Details" bordered={false}></Card>
        )}

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
                  mode="multiple"
                  size="large"
                  placeholder="Select Symptoms"
                  onChange={(values) => setSelectedSymptoms(values)}
                  options={symptomsData.map((s) => ({
                    label: s.symptom,
                    value: s.symptom,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Select Symptoms" name="symptomsTitles" required>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select Symptoms"
                  // onChange={(values) => setSelectedSymptoms(values)}
                  options={symptomsTitles}
                ></Select>
              </Form.Item>
            </Col>
            {/* {symptomGroups.map((group, index) => {
  const data = symptomsData.find((s) => s.symptom === group.symptom);

  return (
    <Card key={group.symptom} title={group.symptom} bordered={false} className="mb-3">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Titles">
            <Select
              mode="multiple"
              size="large"
              placeholder="Select Titles"
              value={group.titles}
              onChange={(titles) => {
                const updatedGroups = [...symptomGroups];
                updatedGroups[index].titles = titles;
                updatedGroups[index].descriptions = titles.map((t) => data.descriptions[t]);
                setSymptomGroups(updatedGroups);
              }}
              options={data.titles.map((t) => ({
                label: t,
                value: t,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Description">
            <Input.TextArea
              size="large"
              readOnly
              autoSize
              value={group.descriptions.join("\n")}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
})}
<Row gutter={16}>
  <Col xs={24}>
    <Form.Item label="Remarks / Notes" name="symptomNote">
      <Input.TextArea
        rows={4}
        placeholder="Any notes regarding symptoms"
      />
    </Form.Item>
  </Col>
</Row> */}

            {/* <Col xs={24} md={12}>
              <Form.Item label="Titles">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select Titles"
                  value={selectedTitles}
                  onChange={setSelectedTitles}
                  disabled={!selectedSymptom}
                  options={
                    symptomsData
                      .find((s) => s.symptom === selectedSymptom)
                      ?.titles.map((t) => ({
                        label: t,
                        value: t,
                      })) || []
                  }
                />
              </Form.Item>
            </Col> */}
            {/* </Row>
          <Row gutter={16}> */}
            {/* <Col xs={24}>
    <Form.Item label="Remark / Notes" name="symptomNote">
      <Input.TextArea
        rows={4}
        placeholder="Add detailed observation or patient notes here"
      />
    </Form.Item>
  </Col> */}
          </Row>
        </Card>

        <Card title="Contact Details" bordered={false}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="address1"
                label="Address Line 1"
                rules={[{ required: true, message: "Enter Address Line 1" }]}
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
                <Input size="large" type="number" placeholder="e.g. 560001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  { required: true, message: "Please enter mobile number" },
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
          </Row>
          <Form.Item name="documents" label="Medical Documents">
            <Upload multiple beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Files</Button>
            </Upload>
          </Form.Item>
        </Card>
      </Col>
    </>
  );
}

export default FormStep;
