import React, { useState, useEffect } from "react";
import { Table, Card, Tooltip, Space, Button, Modal } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllMedicinesApi, deleteMedicineApi } from "../../services/apis";
import { toast } from "react-hot-toast";

const MedicineList = () => {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      const res = await getAllMedicinesApi();
      if (Array.isArray(res?.data)) {
        setMedicines(res.data);
      } else {
        setMedicines([]);
      }
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  const showDeleteModal = (medicine) => {
    setSelectedMedicine(medicine);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteMedicineApi(selectedMedicine._id);
        toast.success(res?.message || "Deleted successfully");
        setMedicines((prev) => prev.filter((m) => m._id !== selectedMedicine._id));
    } catch (error) {
      toast.error(error.message||"Error deleting");
    } finally {
      setDeleteModalOpen(false);
      setSelectedMedicine(null);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Manufacturer", dataIndex: "manufacturer" },
    { title: "Buy Price", dataIndex: "buyPrice", render: (v) => v?.toFixed(2) },
    { title: "Sell Price", dataIndex: "sellPrice", render: (v) => v?.toFixed(2) },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <EditOutlined
              className="text-green-500 cursor-pointer"
              onClick={() =>
                navigate(`/pharmacy/medicine/edit/${record._id}`, { state: record })
              }
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              className="text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                showDeleteModal(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">All Medicines</h2>
        <Button type="primary" onClick={() => navigate("/pharmacy/medicine/add")}>
          Add Medicine
        </Button>
      </div>

      <Card>
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={medicines}
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Confirm Delete"
        open={deleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Yes, delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selectedMedicine?.name}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default MedicineList;
