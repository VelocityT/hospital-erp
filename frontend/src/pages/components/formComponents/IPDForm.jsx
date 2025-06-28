import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Input, Select, DatePicker, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {
  getAvailableWardsAndBedsApi,
  getDoctorsApi,
} from "../../../services/apis";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const IPDForm = ({ form, editIpdBed }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [wardOptions, setWardOptions] = useState([]);
  const [bedOptions, setBedOptions] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (Array.isArray(response?.data)) {
          const mappedDoctors = response.data.map((d) => ({
            label: d.fullName,
            value: d._id,
            ipdCharge: d.ipdCharge,
          }));
          setDoctors(mappedDoctors);
        }
      } catch (err) {
        setDoctors([]);
      }
    };

    const fetchWardsAndBeds = async () => {
      try {
        const ipdId = params.ipdId;
        const res = await getAvailableWardsAndBedsApi({ isEdit: true, ipdId });
        if (res.success && Array.isArray(res.data)) {
          const mappedWards = res.data.map((ward) => ({
            label: `${ward.name} (${ward.type}, ${ward.floor})`,
            value: ward._id,
            beds: ward.beds,
          }));
          setWardOptions(mappedWards);
        } else {
          setWardOptions([]);
          toast.error("Failed to load wards and beds.");
        }
      } catch (err) {
        setWardOptions([]);
        toast.error("Failed to load wards and beds.");
      }
    };

    fetchDoctors();
    fetchWardsAndBeds();

    // Only set fields if not already set
    if (!form.getFieldValue("consultationFees")) {
      form.setFieldsValue({ consultationFees: undefined });
    }
  }, [form, params.ipdId]);

  useEffect(() => {
    const formValues = form.getFieldsValue(true);

    if (formValues.ward) {
      handleWardChange(formValues.ward, true, formValues.bed); // preselect bed here
    }

    if (formValues.doctor && doctors.length > 0) {
      const selected = doctors.find((d) => d.value === formValues.doctor);
      setSelectedDoctor(selected);
      if (selected) {
        form.setFieldsValue({
          consultationFees: selected.ipdCharge,
        });
      }
    }
  }, [wardOptions, doctors, form]);

  const handleDoctorChange = (doctorId) => {
    const selected = doctors.find((d) => d.value === doctorId);
    setSelectedDoctor(selected);
    form.setFieldsValue({
      doctor: doctorId,
      consultationFees: selected?.ipdCharge || undefined,
    });
  };

  const handleWardChange = (
    wardId,
    retainBed = false,
    preselectedBedId = null
  ) => {
    const selectedWard = wardOptions.find((w) => w.value === wardId);
    if (selectedWard) {
      const mappedBeds = selectedWard.beds.map((b) => ({
        label: `Bed ${b.bedNumber} ₹${b.charge || 0}`,
        value: b._id,
      }));
      setBedOptions(mappedBeds);

      if (retainBed && preselectedBedId) {
        form.setFieldsValue({ bed: preselectedBedId });
      } else if (!retainBed) {
        form.setFieldsValue({ bed: undefined });
      }
    }
  };

  return (
    <Card title="IPD Details" bordered={false}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="IPD Number" name="ipdNumber">
            <Input size="large" readOnly />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Admission Date"
            name="admissionDateTime"
            rules={[{ required: true, message: "Please select date and time" }]}
            initialValue={dayjs()}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabled
              value={form.getFieldValue("admissionDateTime") || dayjs()}
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
          <Form.Item
            label="Ward"
            name="ward"
            rules={[{ required: true, message: "Please select ward" }]}
          >
            <Select
              size="large"
              placeholder="Select Ward"
              options={wardOptions}
              allowClear
              onChange={handleWardChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Bed"
            name="bed"
            rules={[{ required: true, message: "Please select bed" }]}
          >
            <Select
              size="large"
              placeholder="Select Bed"
              options={bedOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Doctor"
            name="doctor"
            rules={[{ required: true, message: "Please select doctor" }]}
          >
            <Select
              size="large"
              placeholder="Assign Doctor"
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
              value={selectedDoctor?.ipdCharge}
              placeholder="Auto-filled from doctor"
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
