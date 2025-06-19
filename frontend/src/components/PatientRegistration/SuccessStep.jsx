import { Result, Button, Row, Col, Card } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

function SuccessStep({ patientId }) {
  return (
    <Row justify="center">
      <Col span={24}>
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Registration Successful!"
          subTitle={`Patient ID: ${patientId}`}
          extra={[
            <Button type="primary" key="print" onClick={() => window.print()}>
              Print Registration
            </Button>,
            <Button key="new" onClick={() => window.location.reload()}>
              Register Another
            </Button>,
          ]}
        />
      </Col>
      <Col span={24} className="mt-3">
        <Card title="Next Steps" size="small">
          <ul>
            <li>Patient can proceed to OPD consultation</li>
            <li>ID card will be issued at reception</li>
            <li>SMS sent to registered mobile number</li>
          </ul>
        </Card>
      </Col>
    </Row>
  );
}

export default SuccessStep;
