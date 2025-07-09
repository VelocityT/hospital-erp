import { useEffect, useState } from "react";
import { Form, Typography, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OPDForm from "../components/formComponents/OPDForm";
import IPDForm from "../components/formComponents/IPDForm";
import SymptomsForm from "../components/formComponents/SymptopmsForm";
import { generateUniqueNumber } from "../../utils/helper";
import toast from "react-hot-toast";
import { addOpdOrIpdApi } from "../../services/apis";

const { Title } = Typography;

const AddOpdIpd = ({ add }) => {
  const [form] = useForm();
  const { patientId } = useParams();
  const location = useLocation();
    const navigate = useNavigate()
  const { fullName, _id } = location?.state || {};
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsTitles, setSymptomsTitles] = useState([]);
  const [symptomsDescription, setSymptomsDescription] = useState("");
  // console.log(fullName)
  const handleSubmit = async (values) => {
    const { symptomsTitles,admissionDateTime ,...restData } = values;
    const payload = {
      ...restData,
      ...(add==="ipd"&& {attendingDoctor:restData.doctor}),
      admissionDate: admissionDateTime?.toISOString(),
      patient:_id,
      symptoms: {
        symptomNames: selectedSymptoms,
        symptomTitles: symptomsTitles,
        description: symptomsDescription,
      },
      type: add,
    };
    // console.log(payload);
    try {
      const res = await addOpdOrIpdApi(payload);
      if (res.success) {
        toast.success(res.message||"Successfully added");
        form.resetFields();
        setSelectedSymptoms([]);
        setSymptomsTitles([]);
        setSymptomsDescription("");
        navigate(-1)
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  useEffect(() => {
    const newOpdIpdId = generateUniqueNumber(add === "ipd" ? "IPD" : "OPD");
    if (add === "ipd") {
      form.setFieldValue("ipdNumber", newOpdIpdId);
    }
    if (add === "opd") {
      form.setFieldValue("opdNumber", newOpdIpdId);
    }
  }, []);

  return (
    <div className="p-4">
      <Title level={5} className="mb-2">
        Patient ID: {patientId}
        <p>{fullName}</p>
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {add === "opd" && <OPDForm form={form} patientId={patientId} />}
        {add === "ipd" && <IPDForm form={form} patientId={patientId} />}

        {/* Gap before SymptomsForm */}
        <div className="mt-6">
          <SymptomsForm
            form={form}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
            symptomsTitles={symptomsTitles}
            setSymptomsTitles={setSymptomsTitles}
            symptomsDescription={symptomsDescription}
            setSymptomsDescription={setSymptomsDescription}
          />
        </div>

        <Form.Item className="mt-8">
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOpdIpd;
