import { Drawer, Descriptions } from "antd";

function PatientDetailsPreview({ open, onClose, patient, type }) {
  if (!patient) return null;

  // Determine patient type if not passed as prop
  const patientType = type || patient.patientType?.toLowerCase();

  return (
    <Drawer
      title="Patient Details"
      open={open}
      onClose={onClose}
      width={500}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Name">
          {patient.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {patient.gender}
        </Descriptions.Item>
        <Descriptions.Item label="DOB">
          {patient.dob}
        </Descriptions.Item>
        <Descriptions.Item label="Age">
          {patient.age?.years || 0}y {patient.age?.months || 0}m {patient.age?.days || 0}d
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {patient.patientType?.toUpperCase() || (type && type.toUpperCase())}
        </Descriptions.Item>
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
              {patient.IPD?.ipdNumber || patient.ipdDetails?.ipdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Admission Date & Time">
              {patient.IPD?.admissionDateTime || patient.ipdDetails?.admissionDate}
            </Descriptions.Item>
            <Descriptions.Item label="Height">
              {patient.IPD?.height || patient.ipdDetails?.height}
            </Descriptions.Item>
            <Descriptions.Item label="Weight">
              {patient.IPD?.weight || patient.ipdDetails?.weight}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Pressure">
              {patient.IPD?.bloodPressure || patient.ipdDetails?.bloodPressure}
            </Descriptions.Item>
            <Descriptions.Item label="Ward Type">
              {patient.IPD?.wardType || patient.ipdDetails?.wardType}
            </Descriptions.Item>
            <Descriptions.Item label="Bed">
              {patient.IPD?.bed || patient.ipdDetails?.bed}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {patient.IPD?.doctor || patient.ipdDetails?.attendingDoctor?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="IPD Notes">
              {patient.IPD?.notes || patient.ipdDetails?.notes}
            </Descriptions.Item>
          </>
        )}
        {(patientType === "opd" || patient.patientType === "OPD") && (
          <>
            <Descriptions.Item label="OPD Number">
              {patient.OPD?.opdNumber || patient.opdDetails?.opdNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Visit Date & Time">
              {patient.OPD?.visitDateTime || patient.opdDetails?.visitDateTime}
            </Descriptions.Item>
            <Descriptions.Item label="Doctor">
              {patient.OPD?.doctor || patient.opdDetails?.doctor?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Consultation Fees">
              {patient.OPD?.consultationFees || patient.opdDetails?.consultationFees}
            </Descriptions.Item>
            <Descriptions.Item label="OPD Notes">
              {patient.OPD?.notes || patient.opdDetails?.notes}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </Drawer>
  );
}

export default PatientDetailsPreview;
