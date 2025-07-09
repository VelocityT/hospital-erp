import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const PrintPatientBill = ({ bill }) => {
  const { billDescriptionForPatient, entryData } = bill;
  const days = Math.max(
    dayjs().diff(dayjs(entryData?.admissionDate), "day"),
    1
  );
  // console.log(entryData?.admissionDate)
  // console.log(dayjs())

  // console.log(entryData);
  return (
    <div>
      <BillDescriptionForPatient
        billDescriptionForPatient={billDescriptionForPatient}
      />
      <Row
        className="bg-gray-100 p-2 font-semibold text-sm text-black border-t border-b border-blue-700"
        gutter={16}
      >
        <Col span={12}>Charge Type</Col>
        <Col span={4} className="text-right">
          {billDescriptionForPatient?.ipdNumber ? "Charge x Days" : "Charge"}
        </Col>
        <Col span={3} className="text-right">
          Discount
        </Col>
        <Col span={3} className="text-right">
          Tax
        </Col>
        <Col span={2} className="text-right">
          Total
        </Col>
      </Row>

      <div className="pt-4 space-y-2">
        {billDescriptionForPatient?.ipdNumber ? (
          <>
            <Row className="p-2" gutter={16}>
              <Col span={12}>Bed Charge</Col>
              <Col span={4} className="text-right">
                ₹{entryData.bed?.charge || 0} × {days}
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={2} className="text-right">
                ₹{entryData.bed?.charge * days}
              </Col>
            </Row>

            <Row className="p-2" gutter={16}>
              <Col span={12}>Doctor Fee</Col>
              <Col span={4} className="text-right">
                ₹{entryData.attendingDoctor?.ipdCharge || 0} × {days}
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={2} className="text-right">
                ₹{entryData?.attendingDoctor?.ipdCharge * days}
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 mt-2 ml-auto" />
            <Row justify="end">
              <Col>
                <Text strong className="text-black">
                  Total: ₹
                  {entryData?.attendingDoctor?.ipdCharge * days +
                    entryData.bed?.charge * days}
                </Text>
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 ml-auto" />

            <Row justify="end" className="gap-10">
              <Col>
                <Text strong className="text-black">
                  Discount: ₹{entryData?.payment?.bill[0]?.discount}
                </Text>
              </Col>
              <Col>
                <Text strong className="text-black">
                  Tax: ₹{entryData?.payment?.bill[0]?.tax}
                </Text>
              </Col>
              <Col>
                <Text strong className="text-black">
                  Paid Amount: ₹{entryData?.payment?.bill[0]?.paidAmount}
                </Text>
              </Col>
            </Row>

            <Row justify="end">
              <Col>
                <Text strong className="text-black">
                  Payable Amount: ₹{entryData?.payment?.bill[0]?.payableAmount}
                </Text>
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 ml-auto" />
          </>
        ) : (
          <>
            <Row className="p-2" gutter={16}>
              <Col span={12}>Doctor Fee</Col>
              <Col span={4} className="text-right">
                ₹{entryData.doctor?.opdCharge}
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={3} className="text-right">
                0
              </Col>
              <Col span={2} className="text-right">
                ₹{entryData?.doctor?.opdCharge}
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 mt-2 ml-auto" />
            <Row justify="end">
              <Col>
                <Text strong className="text-black">
                  Total: ₹{entryData?.doctor?.opdCharge}
                </Text>
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 ml-auto" />

            <Row justify="end" className="gap-10">
              <Col>
                <Text strong className="text-black">
                  Discount: ₹{entryData?.payment?.bill?.discount}
                </Text>
              </Col>
              <Col>
                <Text strong className="text-black">
                  Tax: ₹{entryData?.payment?.bill?.tax}
                </Text>
              </Col>
              <Col>
                <Text strong className="text-black">
                  Paid Amount: ₹{entryData?.payment?.bill?.paidAmount}
                </Text>
              </Col>
            </Row>

            <Row justify="end">
              <Col>
                <Text strong className="text-black">
                  Payable Amount: ₹{entryData?.payment?.bill?.payableAmount}
                </Text>
              </Col>
            </Row>
            <hr className="w-48 border-t border-blue-600 ml-auto" />
          </>
        )}
      </div>
    </div>
  );
};

export const BillDescriptionForPatient = ({ billDescriptionForPatient }) => {
  const fieldData = [
    {
      label: "Bill Number",
      value: billDescriptionForPatient.billNumber || "-",
    },
    {
      label: "Date",
      value:
        dayjs(billDescriptionForPatient?.date).format("DD/MM/YYYY HH:mm") ||
        "-",
    },
    {
      label: "Patient Id",
      value: billDescriptionForPatient.patientId || "-",
    },
    {
      label: billDescriptionForPatient.ipdNumber ? "IPD Number" : "OPD Number",
      value:
        billDescriptionForPatient.ipdNumber ||
        billDescriptionForPatient.opdNumber ||
        "-",
    },
    {
      label: "Patient Name",
      value: billDescriptionForPatient.patientFullName || "-",
    },
  ];

  return (
    <div className="bg-white p-6 mx-auto my-6 shadow print:shadow-none print:p-0 print:bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-10 text-sm text-gray-800">
        {fieldData.map((item, idx) => (
          <div key={idx} className="flex">
            <span className="font-medium w-36">{item.label}:</span>
            <span className="flex-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintPatientBill;
