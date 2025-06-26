import React, { useEffect } from "react";
import PrintHeader from "./PrintHeader";
import PrintPrescription from "./PrintPrescription";
import PrintPatientDescription from "./PrintPatientDescription";


const Print = () => {
  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-4 print:p-0 print:bg-white">
      <PrintHeader />
      <PrintPatientDescription />
      <PrintPrescription />
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
