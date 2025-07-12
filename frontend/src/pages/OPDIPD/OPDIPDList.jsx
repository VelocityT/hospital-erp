import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Input,
  Row,
  Col,
  Drawer,
  Form,
  DatePicker,
  Spin,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  RetweetOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  getOpdPatientsApi,
  getIpdPatientsApi,
  switchToIpdApi,
  getPatientDetailsIpdOpdApi,
  dischargePatientApi,
} from "../../services/apis";
import dayjs from "dayjs";
import PatientDetailsPreview from "../components/PatientDetailsPreview";
import IPDForm from "../components/formComponents/IPDForm";
import { generateUniqueNumber } from "../../utils/helper";
import { beds, bedTypes } from "../../utils/localStorage";
import toast from "react-hot-toast";
import DischargeModal from "../components/OPDIPD/IPDDischarge";
import SymptomsForm from "../components/formComponents/SymptopmsForm";
import { useSelector } from "react-redux";
import { MdOutlineLocalHospital } from "react-icons/md";

function OPDIPDList({ type }) {
  const user = useSelector((state) => state?.user);
  const [filterMode, setFilterMode] = useState("date"); // "date" or "all"
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [ipdModalOpen, setIpdModalOpen] = useState(false);
  const [ipdPatient, setIpdPatient] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [dischargeModalVisible, setDischargeModalVisible] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsTitles, setSymptomsTitles] = useState([]);
  const [symptomsDescription, setSymptomsDescription] = useState("");
  const [allPatients, setAllPatients] = useState([]);

  const handleDischargeClick = (record) => {
    if (record.status === "Admitted") {
      setSelectedPatient(record);
      setDischargeModalVisible(true);
    }
  };
  const updateStatusToDischarged = (list) =>
    list.map((p) =>
      p._id === selectedPatient._id ? { ...p, status: "Discharged" } : p
    );

  const handleDischargeSuccess = async (payload) => {
    try {
      const response = await dischargePatientApi(payload);
      if (response.success) {
        toast.success(
          `Patient "${selectedPatient?.patient?.fullName}" discharged successfully!`
        );
        setDischargeModalVisible(false);
        setSelectedPatient(null);

        setFilteredData(updateStatusToDischarged(filteredData));
        setData(updateStatusToDischarged(data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to discharge patient");
      console.error("Discharge error:", error);
    }
  };

  useEffect(() => {
    fetchAndStoreAllPatients();
  }, [type, location.key]);

  const fetchAndStoreAllPatients = async () => {
    setLoading(true);
    let response;
    if (type === "ipd") {
      response = await getIpdPatientsApi();
    } else {
      response = await getOpdPatientsApi();
    }

    const all = response?.data?.map((p, i) => ({ ...p, key: i })) || [];
    setAllPatients(all);
    setLoading(false);
  };

  useEffect(() => {
    filterPatientsLocally();
  }, [filterMode, selectedDate, allPatients]);

  const filterPatientsLocally = () => {
    const filtered =
      filterMode === "all"
        ? allPatients
        : allPatients.filter((p) => {
            const dateToCompare =
              type === "ipd" ? p.admissionDate : p.visitDateTime;
            return dayjs(dateToCompare).isSame(selectedDate, "day");
          });

    setData(filtered);
    setFilteredData(filtered);
  };

  useEffect(() => {
    let filtered = data;
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p?.patient?.fullName &&
            p?.patient?.fullName.toLowerCase().includes(lower)) ||
          (p?.patient?.contact?.phone &&
            p?.patient?.contact?.phone.includes(lower))
      );
    }
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleView = async (record) => {
    const response = await getPatientDetailsIpdOpdApi(record?._id, {
      isIpdPatient: record?.ipdNumber ? true : false,
      isOpdPatient: record?.opdNumber ? true : false,
    });
    // console.log(response)
    setSelectedPatient(response.data);
    setViewDrawer(true);
  };

  const handleEdit = (record) => {
    if (record.ipdNumber) return navigate(`/ipd/edit/${record?._id}`);
    else if (record.opdNumber) return navigate(`/opd/edit/${record?._id}`);
  };

  const handleSwitchType = (record) => {
    setIpdPatient(record);
    setIpdModalOpen(true);
    form.resetFields();
    form.setFieldsValue({ ipdNumber: generateUniqueNumber("IPD") });
    // form.setFieldValue({id:})
  };

  const handleIpdSwitch = async () => {
    try {
      const checkValues = await form.validateFields();
      const { admissionDateTime, symptomsTitles, ...values } = checkValues;

      const payload = {
        ...values,
        symptoms: {
          symptomNames: selectedSymptoms,
          symptomTitles: symptomsTitles,
          description: symptomsDescription,
        },
      };
      // console.log("Switching to IPD with payload:", payload);

      const response = await switchToIpdApi(ipdPatient.patient?._id, payload);

      if (response.success) {
        toast.success(
          `Patient "${ipdPatient?.patient?.fullName}" switched to IPD successfully!`
        );
        setIpdModalOpen(false);
        setIpdPatient(null);
      } else {
        toast.error(response.message || "Failed to switch to IPD");
      }
    } catch (error) {
      if (error?.errorFields) {
        toast.error("Please fill all required fields correctly.");
      } else {
        toast.error(error?.message || "Failed to switch to IPD");
      }
    }
  };

  const handleAddPrescription = (record) => {
    const newRecord =
      type === "opd"
        ? { ...record }
        : { ...record, doctor: record?.attendingDoctor };

    navigate("/addPrescription", { state: newRecord });
  };

  const columns = [
    {
      title: type === "ipd" ? "Admission Date & Time" : "Visit Date & Time",
      key: "admitDateTime",
      render: (_, record) => {
        const rawDate =
          type === "ipd" ? record.admissionDate : record.visitDateTime;
        return rawDate ? dayjs(rawDate).format("DD/MM/YYYY HH:mm") : "-";
      },
      sorter: (a, b) => {
        const aDate = new Date(
          type === "ipd" ? a.admissionDate : a.visitDateTime
        );
        const bDate = new Date(
          type === "ipd" ? b.admissionDate : b.visitDateTime
        );
        return aDate - bDate;
      },
    },
    {
      title: type === "ipd" ? "IPD Number" : "OPD Number",
      key: "number",
      render: (_, record) => {
        const id = type === "ipd" ? record.ipdNumber : record.opdNumber;
        const path = type === "ipd" ? `/ipd/${id}` : `/opd/${id}`;
        return id ? (
          <Link
            to={path}
            state={{ _id: record?._id }}
            className="text-blue-600"
          >
            {id}
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Name",
      key: "fullName",
      render: (_, record) => record?.patient?.fullName || "-",
      sorter: (a, b) =>
        (a?.patient?.fullName || "").localeCompare(b?.patient?.fullName || ""),
    },
    {
      title: "Phone",
      dataIndex: ["patient", "contact", "phone"],
      key: "phone",
      render: (_, record) => record?.patient?.contact?.phone || "-",
      sorter: (a, b) =>
        (a?.patient?.contact?.phone || "").localeCompare(
          b?.patient?.contact?.phone || ""
        ),
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) =>
        type === "ipd"
          ? record?.attendingDoctor?.fullName
          : record?.doctor?.fullName,
    },
    ...(type === "ipd"
      ? [
          {
            title: "Status",
            key: "status",
            render: (_, record) => {
              const isAdmitted = record.status === "Admitted";

              return isAdmitted ? (
                <Tag
                  color="green"
                  onClick={() =>
                    ["admin", "doctor", "receptionist"].includes(user?.role) &&
                    handleDischargeClick(record)
                  }
                  className={
                    ["admin", "doctor", "receptionist"].includes(user?.role) &&
                    "cursor-pointer hover:scale-110"
                  }
                >
                  {record.status}
                </Tag>
              ) : (
                <Tag color="red" className="cursor-not-allowed">
                  {record.status}
                </Tag>
              );
            },
          },
        ]
      : []),

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              title="View"
            />
          </Col>
          {["admin", "doctor", "receptionist"].includes(user?.role) && (
            <>
              {type !== "ipd" && (
                <Col>
                  <Button
                    size="small"
                    type="dashed"
                    icon={<RetweetOutlined />}
                    onClick={() => handleSwitchType(record)}
                    title="Switch to IPD"
                  />
                </Col>
              )}
              {record.status !== "Discharged" && (
                <>
                  <Col>
                    <Button
                      size="small"
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(record)}
                      title="Edit"
                    />
                  </Col>
                  <Col>
                    <Button
                      size="small"
                      type="default"
                      icon={<MedicineBoxOutlined />}
                      onClick={() => handleAddPrescription(record)}
                      title="Add Prescription"
                    />
                  </Col>
                </>
              )}
            </>
          )}
        </Row>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <Row gutter={[8, 10]} align="middle" justify="space-between py-2">
            <Col>
              <span style={{ fontWeight: 600, fontSize: 18 }}>
                {type === "ipd" ? "IPD Patient List" : "OPD Patient List"}
              </span>
            </Col>
            <Col>
              <Row gutter={[8, 8]}>
                <Col>
                  <Select
                    value={filterMode}
                    onChange={(val) => setFilterMode(val)}
                    options={[
                      { label: "Date", value: "date" },
                      { label: "All", value: "all" },
                    ]}
                    className="min-w-[70px]"
                  />
                </Col>
                <Col>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    allowClear={false}
                    format="DD/MM/YYYY"
                    disabled={filterMode === "all"}
                  />
                </Col>
                <Col>
                  <Input.Search
                    allowClear
                    placeholder="Search by name or phone"
                    onSearch={setSearchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        }
        bordered={false}
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
              responsive
            />

            <PatientDetailsPreview
              open={viewDrawer}
              onClose={() => setViewDrawer(false)}
              patient={selectedPatient}
              type={type}
            />

            <Drawer
              title="Switch to IPD"
              open={ipdModalOpen}
              onClose={() => setIpdModalOpen(false)}
              width={600}
              destroyOnClose
              footer={
                <Row justify="end" gutter={8}>
                  <Col>
                    <Button onClick={() => setIpdModalOpen(false)}>
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button type="primary" onClick={handleIpdSwitch}>
                      Switch
                    </Button>
                  </Col>
                </Row>
              }
            >
              {/* Wrap IPDForm in Form for context */}
              <Form form={form} layout="vertical">
                <IPDForm form={form} bedTypes={bedTypes} beds={beds} />
                <SymptomsForm
                  form={form}
                  selectedSymptoms={selectedSymptoms}
                  setSelectedSymptoms={setSelectedSymptoms}
                  symptomsTitles={symptomsTitles}
                  setSymptomsTitles={setSymptomsTitles}
                  symptomsDescription={symptomsDescription}
                  setSymptomsDescription={setSymptomsDescription}
                />
              </Form>
            </Drawer>
          </>
        )}
      </Card>

      <DischargeModal
        visible={dischargeModalVisible}
        onClose={() => {
          setDischargeModalVisible(false);
          setSelectedPatient(null);
        }}
        onSuccess={handleDischargeSuccess}
        ipdPatient={selectedPatient}
      />
    </>
  );
}

export default OPDIPDList;
