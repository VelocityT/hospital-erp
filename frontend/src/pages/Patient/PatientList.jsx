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
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { getAllPatientsApi, getPatientDetailsApi } from "../../services/apis";
import PatientDetailsPreview from "../components/PatientDetailsPreview";

const { Option } = Select;

const columnsBase = [
{
  title: "Admit Date & Time",
  key: "admitDate",
  render: (_, record) => record.registrationDate || "-",
  sorter: (a, b) =>
    new Date(a.registrationDate) - new Date(b.registrationDate),
},
  {
    title: "Patient ID",
    key: "patientId",
    render: (_, record) => {
      const id = record.patientId || "-";
      return id ? <Link to={`/patient/${id}`} className="text-blue-600">{id}</Link> : "-";
    },
  },
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    sorter: (a, b) => a.fullName.localeCompare(b.fullName),
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Age",
    key: "age",
    render: (_, record) =>
      `${record.age?.years || "0"}y ${record.age?.months || "0"}m ${
        record.age?.days || "0"
      }d`,
  },
  {
    title: "Phone",
    dataIndex: ["contact", "phone"],
    key: "phone",
    render: (_, record) => record.contact?.phone || "-",
  },
  {
    title: "Blood Group",
    dataIndex: "bloodGroup",
    key: "bloodGroup",
    filters: [
      { text: "A+", value: "A+" },
      { text: "A-", value: "A-" },
      { text: "B+", value: "B+" },
      { text: "B-", value: "B-" },
      { text: "AB+", value: "AB+" },
      { text: "AB-", value: "AB-" },
      { text: "O+", value: "O+" },
      { text: "O-", value: "O-" },
    ],
    onFilter: (value, record) => record.bloodGroup === value,
  },
];

function PatientList() {
  const [data, setData] = useState([]);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPatients = async () => {
      const response = await getAllPatientsApi();
      console.log(response);
      setData(
        response?.data?.map((p, idx) => ({
          ...p,
          key: idx,
          dob: p.dob ? dayjs(p.dob).format("DD-MM-YYYY") : "N/A",
          admitDateRaw: p.admitDate || null,
          admitDate: p.admitDate
            ? dayjs(p.admitDate).format("DD-MM-YYYY HH:mm")
            : "N/A",
        }))
      );
    };
    getAllPatients();
  }, []);

  const handleView = async (record) => {
    try {
      const response = await getPatientDetailsApi(record._id);
      setViewDrawer(true);
      setSelectedPatient(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleEdit = (record) => {
    sessionStorage.setItem("editPatient", JSON.stringify(record));
    navigate(`/registration/edit/${record._id}`);
  };

  const filteredData = data.filter(
    (p) =>
      !searchText ||
      (p.fullName &&
        p.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (p.contact?.phone && p.contact.phone.includes(searchText))
  );

  const columns = [
    ...columnsBase,
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
        </Row>
      ),
    },
  ];

  return (
    <Card
      title={
        <Row gutter={[8, 8]} className="mb-2 md:mb-0">
          <Col flex="auto">
            <span style={{ fontWeight: 600, fontSize: 18 }}>Patient List</span>
          </Col>
          <Col>
            <Input.Search
              allowClear
              placeholder="Search by name or mobile"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
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
      />
    </Card>
  );
}

export default PatientList;
