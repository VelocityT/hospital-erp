import { Drawer, Descriptions } from "antd";

function PatientDetailsPreview({ open, onClose, patient }) {
  if (!patient) return null;
  // console.log(patient)
  // const patientType = type || patient.patientType?.toLowerCase();

  return (
    <Drawer title="Patient Details" open={open} onClose={onClose} width={500}>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Name">{patient.fullName}</Descriptions.Item>
        <Descriptions.Item label="Gender">{patient.gender}</Descriptions.Item>
        <Descriptions.Item label="DOB">{patient.dob}</Descriptions.Item>
        <Descriptions.Item label="Age">
          {patient.age?.years || 0}y {patient.age?.months || 0}m{" "}
          {patient.age?.days || 0}d
        </Descriptions.Item>
        {/* <Descriptions.Item label="Type">
          {patient.patientType?.toUpperCase() || (type && type.toUpperCase())}
        </Descriptions.Item> */}
        {/* Show status for IPD */}
        {patient?.ipdDetails && (
          <Descriptions.Item label="Status">
            {patient?.ipdDetails?.status || "-"}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Phone">
          {patient.contact?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Blood Group">
          {patient.bloodGroup}
        </Descriptions.Item>
        <Descriptions.Item label="Address 1">
          {patient.address?.line1}
        </Descriptions.Item>
        <Descriptions.Item label="Address 2">
          {patient.address?.line2}
        </Descriptions.Item>
        <Descriptions.Item label="City">
          {patient.address?.city}
        </Descriptions.Item>
        {patient?.ipdDetails?.ipdNumber && (
          <>
            <Descriptions.Item label="IPD Number">
              {patient.ipdDetails.ipdNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Admission Date & Time">
              {patient.ipdDetails.admissionDate}
            </Descriptions.Item>

            <Descriptions.Item label="Height">
              {patient.ipdDetails.height !== "NaN"
                ? patient.ipdDetails.height
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Weight">
              {patient.ipdDetails.weight !== "NaN"
                ? patient.ipdDetails.weight
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Blood Pressure">
              {patient.ipdDetails.bloodPressure !== "undefined"
                ? patient.ipdDetails.bloodPressure
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ward">
              {patient.ipdDetails.ward
                ? `${patient.ipdDetails.ward.name} (Floor: ${patient.ipdDetails.ward.floor})`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Bed Number">
              {patient.ipdDetails.bed?.bedNumber || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {patient.ipdDetails.attendingDoctor?.fullName || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor Charge">
              ₹{patient.ipdDetails.attendingDoctor?.ipdCharge || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms">
              {(patient.ipdDetails.symptoms?.symptomNames || []).join(", ") ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Titles">
              {(patient.ipdDetails.symptoms?.symptomTitles || []).join(", ") ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Description">
              {patient.ipdDetails.symptoms?.description || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="IPD Notes">
              {patient.ipdDetails.notes?.trim() || "-"}
            </Descriptions.Item>
          </>
        )}
        {patient?.opdDetails?.opdNumber && (
          <>
            <Descriptions.Item label="OPD Number">
              {patient.opdDetails?.opdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Visit Date & Time">
              {patient.opdDetails?.visitDateTime}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {patient.opdDetails?.doctor?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Consultation Fees">
              {patient.opdDetails?.consultationFees}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms">
              {(patient?.opdDetails?.symptoms?.symptomNames || []).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Titles">
              {(patient?.opdDetails?.symptoms?.symptomTitles || []).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms Description">
              {patient?.opdDetails?.symptoms?.description}
            </Descriptions.Item>
            <Descriptions.Item label="OPD Notes">
              {patient.opdDetails?.notes}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </Drawer>
  );
}

export default PatientDetailsPreview;
