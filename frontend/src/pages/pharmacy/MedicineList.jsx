import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tooltip,
  Space,
  Button,
  Tag,
  Input,
  Upload,
  Modal,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllMedicinesApi,
  deleteMedicineApi,
  uploadMedicineExcelApi,
} from "../../services/apis";
import { toast } from "react-hot-toast";

const MedicineList = () => {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({ isDeleted: [false] });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      const res = await getAllMedicinesApi();
      setMedicines(Array.isArray(res?.data) ? res.data : []);
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  // const handleDeleteMedicine = async (record) => {
  //   try {
  //     const response = await deleteMedicineApi(record._id);
  //     if (response?.success) {
  //       toast.success(response.message);
  //       setMedicines((prev) =>
  //         prev.map((med) =>
  //           med._id === record._id ? { ...med, isDeleted: !med.isDeleted } : med
  //         )
  //       );
  //     } else {
  //       toast.error(response.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Server error");
  //   }
  // };
  const handleDeleteMedicine = (record) => {
    setSelectedMedicine(record);
    setDeleteModalVisible(true);
  };
  const confirmDelete = async () => {
    if (!selectedMedicine) return;

    try {
      const response = await deleteMedicineApi(selectedMedicine._id);
      if (response?.success) {
        toast.success(response.message);
        setMedicines((prev) =>
          prev.map((med) =>
            med._id === selectedMedicine._id
              ? { ...med, isDeleted: !med.isDeleted }
              : med
          )
        );
        setDeleteModalVisible(false);
        setSelectedMedicine(null);
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.message || "Server error");
    }
  };

  const handleBulkMedicineUpload = async (file, onSuccess, onError) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadMedicineExcelApi(formData);
      if (response?.data?.success) {
        toast.success("Medicines imported successfully");
        setMedicines((prev) => [
          ...prev,
          ...(response?.data?.data?.savedMedicines || []),
        ]);
        // console.log(response?.data);
        onSuccess("Ok");
      } else {
        toast.error(response?.data?.message || "Import failed");
        onError("Error");
      }
    } catch (error) {
      toast.error("Failed to upload file");
      onError("Upload Error");
    }
  };

  const filteredData = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Manufacturer", dataIndex: "manufacturer" },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      render: (v) => v?.toFixed(2),
    },
    {
      title: "Sell Price",
      dataIndex: "sellPrice",
      render: (v) => v?.toFixed(2),
    },
    {
      title: "Status",
      dataIndex: "isDeleted",
      filters: [
        { text: "Active", value: false },
        { text: "Deleted", value: true },
      ],
      filteredValue: filteredInfo.isDeleted || null,
      onFilter: (value, record) => record.isDeleted === value,
      render: (isDeleted, record) => (
        <Tag
          color={isDeleted ? "red" : "green"}
          onClick={() => handleDeleteMedicine(record)}
          className="cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          {isDeleted ? "Deleted" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <EditOutlined
              className="text-green-500 cursor-pointer"
              onClick={() =>
                navigate(`/pharmacy/medicine/edit/${record._id}`, {
                  state: record,
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-end gap-2 mb-3">
        <Button
          type="primary"
          onClick={() => navigate("/pharmacy/medicine/add")}
        >
          + New Medicine
        </Button>
        <Upload
          accept=".xlsx, .xls"
          showUploadList={false}
          customRequest={({ file, onSuccess, onError }) =>
            handleBulkMedicineUpload(file, onSuccess, onError)
          }
        >
          <Button icon={<UploadOutlined />}>Import Excel</Button>
        </Upload>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">All Medicines</h2>
        <Input.Search
          placeholder="Search by medicine name"
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      <Card>
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: "max-content" }}
          onChange={(pagination, filters) => setFilteredInfo(filters)}
        />
      </Card>
      <Modal
        zIndex={9999}
        title={`Are you sure you want to ${
          selectedMedicine?.isDeleted ? "restore" : "delete"
        } this medicine?`}
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        okText="Yes"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Medicine: {selectedMedicine?.name}</p>
      </Modal>
    </div>
  );
};

export default MedicineList;
