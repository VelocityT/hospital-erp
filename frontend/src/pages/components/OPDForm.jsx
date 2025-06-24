import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Input, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { getDoctorsApi } from "../../services/apis";
import { generateUniqueNumber } from "../../utils/helper";

const OPDForm = ({ form }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await getDoctorsApi();
      if (Array.isArray(response?.data)) {
        setDoctors(
          response.data.map((d) => ({
            label: d.fullName,
            value: d._id
          }))
        );
      }
    };
    fetchDoctors();
  }, []);

  // Generate OPD number if not set (for new patients only)
  // useEffect(() => {
  //   if (!form.getFieldValue("opdNumber")) {
  //     form.setFieldsValue({ opdNumber: generateUniqueNumber("OPD") });
  //   }
  //   if (!form.getFieldValue("visitDateTime")) {
  //     form.setFieldsValue({ visitDateTime: dayjs() });
  //   }
  // }, [form]);

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
            <Input size="large" readOnly value={form.getFieldValue("opdNumber") || ""} />
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
            initialValue={dayjs()}
          >
            <DatePicker
              showTime
              size="large"
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
              disabled={true}
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
            autoSize={{ minRows: 2 }}
            placeholder="Any notes or remarks for OPD visit"
          />
        </Form.Item>
      </Col>
    </Card>
  );
};

export default OPDForm;
