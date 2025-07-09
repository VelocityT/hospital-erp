import { useState, useEffect } from "react";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Row,
  Col,
} from "antd";
import toast from "react-hot-toast";
import {
  payPatientIpdBillApi,
  payPatientOpdBillApi,
} from "../../../services/apis";

const PayModal = ({ data, setSelectedEntry, setPatient }) => {
  const [form] = Form.useForm();
  const [payingAmount, setPayingAmount] = useState(0);
  // console.log(data?.selectedEntry?.type);

  useEffect(() => {
    form.setFieldsValue({
      totalAmount: data?.selectedEntry?.total || 0,
      amountPaying: data?.selectedEntry?.total || 0,
      tax: 0,
      discount: 0,
      paymentMethod: "Cash",
    });
    calculateFinal(data?.selectedEntry?.total, 0, 0);
  }, [data, form]);

  const calculateFinal = (amount = 0, tax = 0, discount = 0) => {
    const total =
      parseFloat(amount || 0) +
      parseFloat(tax || 0) -
      parseFloat(discount || 0);
    setPayingAmount(total.toFixed(2));
  };

  const handleValuesChange = (changedValues, allValues) => {
    calculateFinal(allValues.amountPaying, allValues.tax, allValues.discount);
  };

  const handlePayment = async () => {
    try {
      const values = form.getFieldsValue();

      const payload = {
        ...values,
        totalAmount: data?.selectedEntry?.total,
        patient: data?._id,
        entry: {
          type: data?.selectedEntry?.type,
          entryId: data?.selectedEntry?._id,
          checkId:
            data?.selectedEntry?.ipdNumber || data?.selectedEntry?.opdNumber,
        },
      };

      // console.log("Payment Payload:", payload);

      // OPD Payment
      if (data?.selectedEntry?.type === "OPD") {
        const response = await payPatientOpdBillApi(payload);

        if (response?.success) {
          const updatedOpd = response?.data?.updatedOpd;

          setPatient((prev) => ({
            ...prev,
            opds: prev.opds.map((opd) =>
              opd?._id === updatedOpd?._id ? updatedOpd : opd
            ),
          }));

          toast.success("OPD Payment recorded successfully");
        } else {
          toast.error(response?.message || "OPD Payment failed");
        }
      }

      // IPD Payment
      if (data?.selectedEntry?.type === "IPD") {
        const response = await payPatientIpdBillApi(payload);

        if (response?.success) {
          const updatedIpd = response?.data?.updatedIpd;
          setPatient((prev) => ({
            ...prev,
            ipds: prev.ipds.map((ipd) =>
              ipd?._id === updatedIpd?._id ? updatedIpd : ipd
            ),
          }));
          // Update IPD logic here if needed
          toast.success("IPD Payment recorded successfully");
        } else {
          toast.error(response?.message || "IPD Payment failed");
        }
      }

      setSelectedEntry(null);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Payment failed"
      );
    }
  };

  return (
    <div>
      <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
        <Row gutter={16}>
          <Col md={8} xs={24}>
            <Form.Item label="Total Charge" name="totalAmount">
              <InputNumber className="w-full" disabled />
            </Form.Item>
          </Col>

          <Col md={8} xs={24}>
            <Form.Item
              label="Amount Paying"
              name="amountPaying"
              rules={[{ required: true, message: "Enter payment amount" }]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Enter amount"
                disabled={data?.selectedEntry?.type === "OPD"}
              />
            </Form.Item>
          </Col>

          <Col md={8} xs={24}>
            <Form.Item label="Tax" name="tax">
              <InputNumber min={0} className="w-full" placeholder="Enter tax" />
            </Form.Item>
          </Col>

          <Col md={8} xs={24}>
            <Form.Item label="Discount" name="discount">
              <InputNumber
                min={0}
                max={data?.selectedEntry?.total / 2}
                className="w-full"
                placeholder="Enter discount"
                rules={[{ required: true, message: "Select payment method" }]}
              />
            </Form.Item>
          </Col>

          <Col md={8} xs={24}>
            <Form.Item label="Paying Amount">
              <InputNumber
                className="w-full"
                disabled
                value={Number(payingAmount)}
              />
            </Form.Item>
          </Col>

          <Col md={8} xs={24}>
            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: "Select payment method" }]}
            >
              <Select>
                <Select.Option value="Cash">Cash</Select.Option>
                <Select.Option value="Card">Card</Select.Option>
                <Select.Option value="UPI">UPI</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div className="flex justify-end">
            <Button type="primary" onClick={handlePayment}>
              Pay and Generate Bill
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PayModal;
