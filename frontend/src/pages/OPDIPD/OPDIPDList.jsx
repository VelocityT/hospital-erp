import { lazy, Suspense, useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Input,
  Row,
  Col,
  Select,
  message,
  Drawer,
  Form,
} from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  getOpdPatientsApi,
  getIpdPatientsApi,
  getPatientDetailsApi,
  switchToIpdApi,
  getPatientDetailsIpdOpdApi,
} from "../../services/apis";
import dayjs from "dayjs";
import PatientDetailsPreview from "../components/PatientDetailsPreview";
import IPDForm from "../components/IPDForm";
import { generateUniqueNumber } from "../../utils/helper";

const bedTypes = [
  { label: "General", value: "general" },
  { label: "Semi-Private", value: "semi-private" },
  { label: "Private", value: "private" },
];

const beds = [
  { label: "Bed 101", value: "bed101" },
  { label: "Bed 102", value: "bed102" },
  { label: "Bed 201", value: "bed201" },
];

function OPDIPDList({ type }) {
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

  useEffect(() => {
    const fetchPatients = async () => {
      let response;
      if (type === "ipd") {
        response = await getIpdPatientsApi();
      } else {
        response = await getOpdPatientsApi();
      }
      const filtered = response.data.map((p, idx) => ({ ...p, key: idx }));
      setData(filtered);
      setFilteredData(filtered);
    };
    fetchPatients();
  }, [type, location.key]);

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
      ipdNumber: record.ipdNumber,
      opdNumber: record.opdNumber,
    });
    // console.log(response)
    setSelectedPatient(response.data);
    setViewDrawer(true);
  };

  const handleEdit = (record) => {
    sessionStorage.setItem("editPatient", JSON.stringify(record));
    navigate(`/registration/edit/${record?.patient?._id}`);
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
      const { admissionDateTime, ...values } = form.getFieldsValue(true);
      // console.log(selectedPatient)
      // console.log(values)
      const response = await switchToIpdApi(ipdPatient.patient?._id, values);
      console.log(response);
      message.success(
        `Patient "${ipdPatient?.patient?.fullName}" switched to IPD successfully!`
      );
      setIpdModalOpen(false);
      setIpdPatient(null);
    } catch (error) {
      message.error(error?.message || "Failed to switch to IPD");
    }
  };

  const columns = [
    {
      title: type === "ipd" ? "Admission Date & Time" : "Visit Date & Time",
      key: "admitDateTime",
      render: (_, record) => {
        const rawDate =
          type === "ipd" ? record.admissionDate : record.visitDateTime;
        return rawDate ? dayjs(rawDate).format("DD-MM-YYYY HH:mm") : "-";
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
        return id ? <Link to={`/patient/${id}`}>{id}</Link> : "-";
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
            render: (_, record) => record.status || "-",
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Button size="small" onClick={() => handleView(record)}>
              View
            </Button>
          </Col>
          <Col>
            <Button
              size="small"
              type="primary"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          </Col>
          {type !== "ipd" && (
            <Col>
              <Button
                size="small"
                type="dashed"
                onClick={() => handleSwitchType(record)}
              >
                Switch to IPD
              </Button>
            </Col>
          )}
        </Row>
      ),
    },
  ];

  return (
    <Card
      title={
        <Row gutter={[8, 20]} align="middle" justify="space-between">
          <Col>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              {type === "ipd" ? "IPD Patient List" : "OPD Patient List"}
            </span>
          </Col>
          <Col md={8}>
            <Input.Search
              allowClear
              placeholder="Search by name or phone"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              className=" mb-4 md:mb-2"
              value={searchText}
            />
          </Col>
        </Row>
      }
      bordered={false}
    >
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
              <Button onClick={() => setIpdModalOpen(false)}>Cancel</Button>
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
        </Form>
      </Drawer>
    </Card>
  );
}

export default OPDIPDList;
