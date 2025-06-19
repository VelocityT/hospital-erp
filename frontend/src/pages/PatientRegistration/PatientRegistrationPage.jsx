import { useState } from "react";
import { Form, Steps, Button, message, Card, Row, Col } from "antd";
import { UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import FormStep from "../../components/PatientRegistration/FormStep";
import SuccessStep from "../../components/PatientRegistration/SuccessStep";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./PatientRegistration.css";

const { Step } = Steps;

function PatientRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [patientId, setPatientId] = useState("");
  const [form] = Form.useForm();

  const steps = [
    { title: "Patient Details", icon: <UserOutlined /> },
    { title: "Complete", icon: <CheckCircleOutlined /> },
  ];

  const onFinish = async (values) => {
    try {
      const newPatientId = `HOSP-${Date.now().toString().slice(-6)}`;
      setPatientId(newPatientId);
      setCurrentStep(1);
      message.success("Registration successful!");
      console.log("Submitted values:", values);
    } catch (error) {
      message.error("Registration failed");
    }
  };

  return (
    <div className="registration-container container-fluid">
      <Row justify="center" className="mt-5">
        <Col xs={24} md={20} lg={16} xl={12}>
          <Card title="Patient Registration" bordered={false}>
            <Steps current={currentStep} className="mb-4">
              {steps.map((step) => (
                <Step key={step.title} title={step.title} icon={step.icon} />
              ))}
            </Steps>

            <div className="step-content">
              {currentStep === 0 ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <FormStep form={form} />
                  <Form.Item className="text-end mt-4">
                    <Button type="primary" size="large" htmlType="submit">
                      Register Patient
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <SuccessStep patientId={patientId} />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PatientRegistrationPage;
