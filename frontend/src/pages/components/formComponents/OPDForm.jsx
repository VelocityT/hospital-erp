import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Input, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { getDoctorsApi } from "../../../services/apis";
import { generateUniqueNumber } from "../../../utils/helper";

const OPDForm = ({ form }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (Array.isArray(response?.data)) {
          setDoctors(
            response.data.map((d) => ({
              label: d.fullName,
              value: d._id,
              opdCharge: d.opdCharge,
            }))
          );
        }
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
    // Only set fields if not already set
    if (!form.getFieldValue("consultationFees")) {
      form.setFieldsValue({ consultationFees: undefined });
    }
    if (!form.getFieldValue("visitDateTime")) {
      form.setFieldsValue({ visitDateTime: dayjs() });
    }
  }, [form]);

  const handleDoctorChange = (doctorId) => {
    const selected = doctors.find((d) => d.value === doctorId);
    setSelectedDoctor(selected);
    form.setFieldsValue({
      consultationFees: selected?.opdCharge || undefined,
      opdDoctor: doctorId,
    });
  };

  useEffect(() => {
    // If doctor is already selected (edit mode), set selectedDoctor
    const doctorId = form.getFieldValue("opdDoctor");
    if (doctorId && doctors.length > 0) {
      const doc = doctors.find((d) => d.value === doctorId);
      setSelectedDoctor(doc);
      if (doc) {
        form.setFieldsValue({ consultationFees: doc.opdCharge });
      }
    }
  }, [form, doctors]);

  return (
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
            <Input
              size="large"
              readOnly
              value={form.getFieldValue("opdNumber") || ""}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Visit Date"
            name="visitDateTime"
            rules={[{ required: true, message: "Please select date and time" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabled
              value={form.getFieldValue("visitDateTime") || dayjs()}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Consulting Doctor"
            name="opdDoctor"
            rules={[{ required: true, message: "Please select doctor" }]}
          >
            <Select
              size="large"
              placeholder="Select Doctor"
              options={doctors}
              allowClear
              onChange={handleDoctorChange}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Consultation Fees" name="consultationFees">
            <Input
              size="large"
              disabled
              value={selectedDoctor?.opdCharge}
              placeholder="Auto-filled from doctor"
            />
          </Form.Item>
        </Col>
      </Row>
      <Col xs={24}>
        <Form.Item label="OPD Notes" name="notes">
          <TextArea
            autoSize={{ minRows: 2 }}
            placeholder="Any notes or remarks for OPD visit"
          />
        </Form.Item>
      </Col>
    </Card>
  );
};

export default OPDForm;
