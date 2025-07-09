import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPatientDetailsIpdOpdApi } from "../../services/apis";
import { toast } from "react-hot-toast";
import { Spin, Button, Card, Row, Descriptions, Divider } from "antd";
import { BillDetailsList } from "../components/billing/ChargeTable";
import dayjs from "dayjs"

const IpdOpdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const _id = location.state?._id;
  const type = location.pathname.includes("/ipd/") ? "ipd" : "opd";
  const [loading, setLoading] = useState(true);
  const [entryDetails, setEntryDetails] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      const response = await getPatientDetailsIpdOpdApi(_id, {
        isIpdPatient: type === "ipd",
        isOpdPatient: type === "opd",
        detailPage: true,
      });

      if (response?.success) {
        setEntryDetails(response.data);
      } else {
        toast.error(response?.message || "Failed to fetch patient details");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin fullscreen />;
  if (!entryDetails) return null;

  const details =
    type === "ipd" ? entryDetails.ipdDetails : entryDetails.opdDetails;

  // ==========for printing===========
  const { ipdDetails, opdDetails, ...patient } = entryDetails;
  // ==========for printing===========

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Row justify="end">
        <Button onClick={() => navigate(-1)} className="mb-4">
          Back
        </Button>
      </Row>

      <Card title={`Patient ${type.toUpperCase()} Details`} bordered>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Full Name">
            {entryDetails?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {entryDetails?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="DOB">{dayjs(entryDetails?.dob).format("DD/MM/YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Blood Group">
            {entryDetails?.bloodGroup}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {entryDetails?.contact?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Patient ID">
            {entryDetails?.patientId}
          </Descriptions.Item>
          <Descriptions.Item label="Registration Date">
            {dayjs(entryDetails?.registrationDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Age">{`${entryDetails?.age?.years}y ${entryDetails?.age?.months}m ${entryDetails?.age?.days}d`}</Descriptions.Item>
          <Descriptions.Item label="Address">
            {`${entryDetails?.address?.line1}, ${entryDetails?.address?.line2}, ${entryDetails?.address?.city} - ${entryDetails?.address?.pincode}`}
          </Descriptions.Item>

          <Descriptions.Item label="Doctor">
            {details?.doctor?.fullName || details?.attendingDoctor?.fullName}
          </Descriptions.Item>
          <Descriptions.Item
            label={`${type === "ipd" ? "IPD Number" : "OPD Number"}`}
          >
            {details?.ipdNumber || details?.opdNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {details?.status}
          </Descriptions.Item>
          {type === "ipd" && (
            <>
              <Descriptions.Item label="Admission Date">
                {details?.admissionDate}
              </Descriptions.Item>
              <Descriptions.Item label="Ward">
                {details?.ward?.name} (Floor: {details?.ward?.floor})
              </Descriptions.Item>
              <Descriptions.Item label="Bed Number">
                {details?.bed?.bedNumber}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>

        <Divider orientation="left" className="pt-4">
          Symptoms
        </Divider>
        <p>
          <strong>Names:</strong> {details?.symptoms?.symptomNames?.join(", ")}
        </p>
        <p>
          <strong>Titles:</strong>{" "}
          {details?.symptoms?.symptomTitles?.join(", ")}
        </p>
        <p>
          <strong>Description:</strong> {details?.symptoms?.description}
        </p>

        <Divider orientation="left" className="pt-4">
          Payment Bills
        </Divider>
        {type === "ipd" && (
          <BillDetailsList
            patient={patient}
            ipds={[entryDetails?.ipdDetails]}
            bills={entryDetails?.ipdDetails?.payment?.bill}
          />
        )}
        {type === "opd" && (
          <BillDetailsList
            patient={patient}
            opds={[entryDetails?.opdDetails]}
            bills={
              entryDetails?.opdDetails?.payment?.bill
                ? [entryDetails.opdDetails.payment.bill]
                : []
            }
          />
        )}
      </Card>
    </div>
  );
};

export default IpdOpdDetails;
