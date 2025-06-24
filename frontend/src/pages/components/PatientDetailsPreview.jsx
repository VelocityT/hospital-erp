import { Drawer, Descriptions } from "antd";

function PatientDetailsPreview({ open, onClose, patient, type }) {
  if (!patient) return null;
console.log(patient)
  const patientType = type || patient.patientType?.toLowerCase();

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
        <Descriptions.Item label="Type">
          {patient.patientType?.toUpperCase() || (type && type.toUpperCase())}
        </Descriptions.Item>
        {/* Show status for IPD */}
        {(patientType === "ipd" || patient.patientType === "IPD") && (
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
        <Descriptions.Item label="Symptoms">
          {(patient.symptoms?.symptomNames || []).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="Symptoms Titles">
          {(patient.symptoms?.symptomTitles || []).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="Symptoms Description">
          {patient.symptoms?.description}
        </Descriptions.Item>
        {(patientType === "ipd" || patient.patientType === "IPD") && (
          <>
            <Descriptions.Item label="IPD Number">
              {patient.ipdDetails?.ipdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Admission Date & Time">
              {patient.ipdDetails?.admissionDate}
            </Descriptions.Item>
            <Descriptions.Item label="Height">
              {patient.ipdDetails?.height}
            </Descriptions.Item>
            <Descriptions.Item label="Weight">
              {patient.ipdDetails?.weight}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Pressure">
              {patient.ipdDetails?.bloodPressure}
            </Descriptions.Item>
            <Descriptions.Item label="Ward Type">
              {patient.ipdDetails?.ward}
            </Descriptions.Item>
            <Descriptions.Item label="Bed">
              {patient.ipdDetails?.bed}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {patient.ipdDetails?.attendingDoctor?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="IPD Notes">
              {patient.ipdDetails?.notes}
            </Descriptions.Item>
          </>
        )}
        {(patientType === "opd" || patient.patientType === "OPD") && (
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
