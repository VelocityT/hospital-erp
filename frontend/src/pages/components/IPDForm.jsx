import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Input, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { getDoctorsApi } from "../../services/apis";

const IPDForm = ({ form, bedTypes, beds }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await getDoctorsApi();
      console.log(response)
      if (Array.isArray(response?.data)) {
        setDoctors(
          response.data.map((d) => ({
            label: d.fullName,
            value: d._id,
          }))
        );
      }
    };
    fetchDoctors();
  }, []);

  // Generate IPD number if not set (for new patients only)
  // useEffect(() => {
  //   if (!form.getFieldValue("ipdNumber")) {
  //     form.setFieldsValue({ ipdNumber: generateUniqueNumber("IPD") });
  //   }
  //   if (!form.getFieldValue("admissionDateTime")) {
  //     form.setFieldsValue({ admissionDateTime: dayjs() });
  //   }
  // }, [form]);
  console.log(form.getFieldValue("ipdNumber"));
  return (
    <Card title="IPD Details" bordered={false}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="IPD Number" name="ipdNumber" >
            <Input
              size="large"
              readOnly
              // value={form?.getFieldValue("ipdNumber") || "hello"}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Admission Date"
            name="admissionDateTime"
            rules={[
              {
                required: true,
                message: "Please select date and time",
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabled={true}
              // value={form.getFieldValue("admissionDateTime") || dayjs()}
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
          <Form.Item label="Ward" name="ward" required>
            <Select
              size="large"
              placeholder="Select Ward"
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
          <Form.Item label="IPD Notes" name="notes">
            <TextArea
              autoSize={{ minRows: 2 }}
              placeholder="Any notes or remarks for IPD admission"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default IPDForm;
