import React from "react";
import { Table, Divider } from "antd";
import {
  doseIntervals,
  doseDurations,
  pathologyTests,
  radiologyTests,
} from "../../utils/localStorage";

// Helper to get human-readable labels
const getLabel = (arr, value) =>
  arr.find((d) => d.value === value)?.label || value;

const PrescriptionPrint = () => {
  // Load data from localStorage
  const printData = JSON.parse(
    localStorage.getItem("printPrescription") || "{}"
  );

  // Destructure
  const {
    medicinesList = [],
    selectedPathology = [],
    selectedRadiology = [],
    note = "",
  } = printData;

  // If there's no actual prescription data, return nothing
  if (
    !medicinesList.length &&
    !selectedPathology.length &&
    !selectedRadiology.length &&
    !note
  ) {
    return null;
  }

  // Table config
  const columns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
      className: "font-semibold",
    },
    {
      title: "Category",
      dataIndex: "medicineCategory",
      key: "medicineCategory",
    },
    {
      title: "Dose Interval",
      dataIndex: "doseInterval",
      key: "doseInterval",
      render: (val) => getLabel(doseIntervals, val),
    },
    {
      title: "Dose Duration",
      dataIndex: "doseDuration",
      key: "doseDuration",
      render: (val) => getLabel(doseDurations, val),
    },
  ];

  return (
<div className="bg-white p-6 max-w-3xl mx-auto my-6 shadow print:shadow-none print:p-0 print:bg-white">

      <h2 className="text-xl font-bold mb-4 text-center">Prescription</h2>

      {/* Medicines Table */}
      {medicinesList.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Medicines</h3>
          <Table
            columns={columns}
            dataSource={medicinesList.map((item, idx) => ({
              ...item,
              key: idx,
            }))}
            pagination={false}
            bordered
            size="small"
            className="mb-4"
          />
        </div>
      )}

      {/* Lab Tests */}
      {(selectedPathology.length > 0 || selectedRadiology.length > 0) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Lab Tests</h3>

          {selectedPathology.length > 0 && (
            <div className="mb-2">
              <div className="font-medium mb-1">Pathology:</div>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {selectedPathology.map((code, index) => (
                  <li key={`path-${index}`}>
                    {pathologyTests.find((t) => t.code === code)?.name || code}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRadiology.length > 0 && (
            <div>
              <div className="font-medium mb-1">Radiology:</div>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {selectedRadiology.map((code, index) => (
                  <li key={`radio-${index}`}>
                    {radiologyTests.find((t) => t.code === code)?.name || code}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Doctor's Note */}
      {note && (
        <>
          <Divider className="my-4" />
          <div>
            <span className="font-medium">Doctor's Note:</span>
            <div className="mt-1 whitespace-pre-line">{note}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrescriptionPrint;
