export const handlePatientBillPrint = ({ record, ipds, opds, patient }) => {
  // console.log(record)
  const type = record?.entry?.type;
  let entryData = null;
  let billDescriptionForPatient = null;
  // console.log(ipds)

  if (type === "Ipd") {
    const dataForFilter = ipds.find(
      (ipd) => ipd.ipdNumber === record?.entry?.checkId
    );

    const foundBill = dataForFilter?.payment?.bill.find(
      (bill) => bill.billNumber === record?.billNumber
    );

    entryData = foundBill
      ? {
          ...dataForFilter,
          payment: {
            ...dataForFilter.payment,
            bill: [foundBill],
          },
        }
      : {};

    billDescriptionForPatient = {
      billNumber: foundBill?.billNumber,
      date: foundBill?.createdAt,
      patientId: patient?.patientId,
      ipdNumber: entryData?.ipdNumber,
      patientFullName: patient?.fullName,
    };

    localStorage.setItem(
      "ipdBillEntryDataForPrint",
      JSON.stringify({ entryData, billDescriptionForPatient })
    );
    localStorage.setItem("printBillType", "ipdBill");
  } else if (type === "Opd") {
    entryData = opds.find((opd) => opd.opdNumber === record?.entry?.checkId);
    billDescriptionForPatient = {
      billNumber: entryData?.payment?.bill?.billNumber,
      date: entryData?.payment?.bill?.createdAt,
      patientId: patient?.patientId,
      opdNumber: entryData?.opdNumber,
      patientFullName: patient?.fullName,
    };
    localStorage.setItem(
      "opdBillEntryDataForPrint",
      JSON.stringify({ entryData, billDescriptionForPatient })
    );
    localStorage.setItem("printBillType", "opdBill");
  }
  window.open("/print/bill", "_blank");
};
