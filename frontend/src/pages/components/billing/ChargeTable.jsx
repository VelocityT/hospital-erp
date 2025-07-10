import { PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Divider, Button, Tag } from "antd";
import dayjs from "dayjs";
import { handlePatientBillPrint } from "../../../utils/printDataHelper";
const { Text } = Typography;

export const IpdChargeTable = ({
  ipdEntries = [],
  patient,
  setSelectedEntry,
  print,
}) => {
  // console.log(print);
  return (
    <div className="space-y-4 print:text-black">
      <Row
        className={`${
          print ? "bg-gray-400" : "bg-gray-100 dark:bg-gray-800"
        } p-2 font-semibold`}
        gutter={16}
      >
        <Col span={8}>Charge Type</Col>
        <Col span={8}>Charge x Days</Col>
        <Col span={8}>Amount</Col>
      </Row>
      {ipdEntries.map((ipd) => {
        const admissionDate = dayjs(ipd.admissionDate);

        const dischargeDate =
          dayjs(ipd?.dischargeSummary?.dischargeDate) || null;

        const effectiveDischargeDate = dischargeDate || dayjs();
        const days = Math.max(
          effectiveDischargeDate.diff(admissionDate, "day"),
          1
        );
        // console.log(days);

        // const days = Math.max(dischargeDate?.diff(admissionDate, "day"), 1);

        const bedCharge = (ipd.bed?.charge || 0) * days;
        const doctorCharge = (ipd.attendingDoctor?.ipdCharge || 0) * days;
        let total = bedCharge + doctorCharge;
        const paidBillSum =
          ipd?.payment?.bill?.reduce(
            (sum, bill) => sum + (+bill?.totalCharge || 0),
            0
          ) || 0;

        // console.log(total)
        // console.log(paidBillSum)

        return (
          <div>
            {/* IPD Info */}
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <Text strong className={`${print && "text-black"}`}>
                  IPD Number
                </Text>
                {": "}
                {ipd?.ipdNumber}
              </Col>
              <Col xs={24} sm={8}>
                <Text strong className={`${print && "text-black"}`}>
                  Admission Date:
                </Text>{" "}
                {admissionDate.format("DD/MM/YYYY HH:mm")}
              </Col>{" "}
              <Col xs={24} sm={8}>
                <div className="flex justify-between items-center">
                  {ipd?.status === "Discharged" ? (
                    <span>
                      <Text strong className={`${print && "text-black"}`}>
                        Discharge Date:
                      </Text>{" "}
                      {dischargeDate.format("DD/MM/YYYY HH:mm")}
                    </span>
                  ) : (
                    <Tag color="green">Admitted</Tag>
                  )}
                  {!print && (
                    <>
                      {ipd?.payment?.status !== "Paid" ? (
                        <Button
                          type="primary"
                          onClick={() =>
                            setSelectedEntry({
                              ...ipd,
                              type: "IPD",
                              total: total - paidBillSum,
                            })
                          }
                          className="bg-green-600 hover:bg-green-700 border-none rounded-full print:hidden"
                        >
                          Pay
                        </Button>
                      ) : (
                        <Tag
                          color="green"
                          className="border border-green-500 text-green-700  rounded-md text-lg print:hidden"
                        >
                          Paid
                        </Tag>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>

            {/* Charge Breakdown */}
            <Row className="p-2" gutter={16}>
              <Col span={8}>Bed Charge</Col>
              <Col span={8}>
                ₹{ipd.bed?.charge || 0} × {days}
              </Col>
              <Col span={8}>₹{bedCharge}</Col>
            </Row>

            <Row className="p-2" gutter={16}>
              <Col span={8}>Doctor Fee</Col>
              <Col span={8}>
                ₹{ipd.attendingDoctor?.ipdCharge || 0} × {days}
              </Col>
              <Col span={8}>₹{doctorCharge}</Col>
            </Row>
            <Row justify="end">
              <Text strong className={`${print && "text-black"}`}>
                Total: ₹{total}
              </Text>
            </Row>
            <div className="pt-4">
              {ipd?.payment?.bill && (
                <BillDetailsList
                  ipds={[ipd]}
                  patient={patient}
                  bills={ipd?.payment?.bill}
                  print={print}
                />
              )}
            </div>
            {!print && (
              <Row justify="end">
                <Text strong className={`${print && "text-black"}`}>
                  To be paid: ₹{total - paidBillSum}
                </Text>
              </Row>
            )}
            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export const OpdChargeTable = ({
  opdEntries = [],
  patient,
  setSelectedEntry,
  print,
}) => {
  if (!opdEntries) {
    return <>nothing found</>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <Row
        className={`${
          print ? "bg-gray-400" : "bg-gray-100 dark:bg-gray-800"
        } p-2 font-semibold`}
        gutter={16}
      >
        <Col span={8}>Charge Type</Col>
        <Col span={8}>Doctor</Col>
        <Col span={8}>Amount</Col>
      </Row>

      {/* OPD Entries */}
      {opdEntries.map((opd) => {
        const visitDate = dayjs(opd.visitDateTime);
        const fee = opd.doctor?.opdCharge || 0;
        const bill = opd?.payment?.bill;

        return (
          <div key={opd._id} className="px-3">
            {/* Visit Info */}
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={8}>
                <Text strong className={`${print && "text-black"}`}>
                  OPD Number:
                </Text>{" "}
                {opd.opdNumber}
              </Col>
              <Col xs={24} sm={8}>
                <Text strong className={`${print && "text-black"}`}>
                  Visit Date:
                </Text>{" "}
                {visitDate.format("DD/MM/YYYY HH:mm")}
              </Col>
              {!print && (
                <Col xs={24} sm={8} className="flex justify-end print:hidden">
                  {!bill?.billNumber ? (
                    <Button
                      type="primary"
                      onClick={() =>
                        setSelectedEntry({
                          ...opd,
                          type: "OPD",
                          total: opd?.doctor?.opdCharge,
                        })
                      }
                      className="bg-green-600 hover:bg-green-700 border-none rounded-full"
                    >
                      Pay
                    </Button>
                  ) : (
                    <Tag
                      color="green"
                      className="border border-green-500 text-green-700  rounded-md text-lg"
                    >
                      Paid
                    </Tag>
                  )}
                </Col>
              )}
            </Row>

            {/* Doctor & Fee */}
            <Row className="mt-2 p-2 rounded" gutter={16}>
              <Col span={8}>Consultation Fee</Col>
              <Col span={8}>{opd.doctor?.fullName || "-"}</Col>
              <Col span={8}>₹{fee}</Col>
            </Row>

            {/* Billing Info */}
            {bill?.billNumber && (
              <BillDetailsList
                opds={[opd]}
                patient={patient}
                bills={[bill]}
                print={print}
              />
            )}

            {/* If no bill, show fee total */}
            {!bill?.billNumber && (
              <Row justify="end" className="pr-4 mt-2">
                <Text strong className={`${print && "text-black"}`}>
                  Total: ₹{fee}
                </Text>
              </Row>
            )}

            <Divider className="mt-4" />
          </div>
        );
      })}
    </div>
  );
};

export const PrescriptionChargeTable = ({
  prescriptionEntries = [],
  setSelectedEntry,
}) => {
  return <div>PrescriptionChargeTable</div>;
};

// export const PayCalculation = ({total})=>{
//   return(

//   )
// }

export const BillDetailsList = ({
  patient,
  bills,
  ipds,
  opds,
  print = false,
}) => {
  // console.log(bills);
  return (
    <div className="pt-4 space-y-2">
      {bills.length > 0 ?  bills?.map((bill, idx) => (
          <>
            <Row className="mt-3 px-2" gutter={16}>
              <Col span={8}>
                <Button
                  size="small"
                  className="border-green-600 mr-2"
                  icon={<PrinterOutlined className="text-green-600" />}
                  onClick={() =>
                    handlePatientBillPrint({
                      record: bill,
                      patient,
                      ipds,
                      opds,
                    })
                  }
                ></Button>
                <Text strong className={`${print && "text-black"}`}>
                  Bill Date:
                </Text>{" "}
                {dayjs(bill?.createdAt).format("DD/MM/YYYY HH:mm")}
              </Col>
              <Col span={8}>
                <Text strong className={`${print && "text-black"}`}>
                  Bill No:
                </Text>{" "}
                {bill?.billNumber}
              </Col>
            </Row>
            <Row className="mt-2 px-2" gutter={16}>
              <Col span={6}>Total Charge: ₹{bill?.totalCharge || "-"}</Col>
              <Col span={6}>Tax: ₹{bill?.tax || 0}</Col>
              <Col span={6}>Discount: ₹{bill?.discount || 0}</Col>
              <Col span={6}>
                <strong>Total: ₹{bill?.paidAmount || 0}</strong>
              </Col>
            </Row>
            {print && (
              <div className="pr-4 mt-2 space-y-1">
                <Row justify="end">
                  <Col>
                    <Text strong className="text-black">
                      Amount Paid: ₹{bill?.paidAmount}
                    </Text>
                  </Col>
                </Row>
                <Row justify="end">
                  <Col>
                    <Text strong className="text-black">
                      Amount Payable: ₹{bill?.payableAmount || 0}
                    </Text>
                  </Col>
                </Row>
              </div>
            )}
          </>
        )): (
        <div className="text-center text-gray-500 italic">No payment found.</div>
      )}
    </div>
  );
};
