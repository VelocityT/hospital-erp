import { useEffect } from "react";
import PrintHeader from "./PrintHeader";
import PrintPrescription from "./PrintPrescription";
import PrintPatientDescription from "./PrintPatientDescription";
import PrintPatientBill from "./PrintPatientBill";

const Print = () => {
  const type = localStorage.getItem("printBillType");
  let billEntryData;
  if (type === "ipdBill") {
    billEntryData = JSON.parse(
      localStorage.getItem("ipdBillEntryDataForPrint")
    );
  } else if (type === "opdBill") {
    billEntryData = JSON.parse(
      localStorage.getItem("opdBillEntryDataForPrint")
    );
  }
  // console.log(type)

  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 500);

    return () => {
      clearTimeout(timeout);
      localStorage.removeItem("printBillType");
      localStorage.removeItem("ipdBillEntryDataForPrint");
      localStorage.removeItem("opdBillEntryDataForPrint");
    };
  }, []);

  return (
    <div className="p-4 print:p-0 bg-white print:bg-white">
      <PrintHeader />
      {type ? (
        <PrintPatientBill bill={billEntryData} />
      ) : (
        <>
          <PrintPatientDescription />
          <PrintPrescription />
        </>
      )}
      <div className="mt-8 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Again
        </button>
      </div>
    </div>
  );
};

export default Print;
