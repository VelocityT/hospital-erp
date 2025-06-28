import React, { useEffect, useState } from "react";
import {
  createWardApi,
  createWardTypesApi,
  getAllWardTypesApi,
  getAllWardsApi,
  deleteWardApi,
  // updateWardApi, // <-- remove this import
} from "../../services/apis";
import {
  Button,
  Alert,
  Modal,
  Form,
  Input,
  Space,
  message,
  Row,
  Col,
  Card,
  Table,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddWard from "../components/wardComponents/AddWard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const WardManagment = () => {
  const [wardTypes, setWardTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fields, setFields] = useState([{ value: "" }]);
  const [loading, setLoading] = useState(false);

  const [addWardModalOpen, setAddWardModalOpen] = useState(false);
  const [addWardForm] = Form.useForm();

  const [wards, setWards] = useState([]);
  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [wardToDelete, setWardToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const getAllWardTypes = async () => {
      try {
        const response = await getAllWardTypesApi();
        setWardTypes(response.data);
        // If wardTypes exist, set fields for update modal
        if (response.data && response.data.length > 0) {
          setFields(response.data.map((type) => ({ value: type })));
        }
      } catch (error) {
        console.error("Error fetching ward types:", error);
      }
    };
    getAllWardTypes();
  }, []);

  useEffect(() => {
    if (wardTypes && wardTypes.length > 0) {
      const fetchWards = async () => {
        try {
          const response = await getAllWardsApi();
          console.log(response.data);
          // Sort wards by name (case-insensitive)
          const sorted = (response.data || [])
            .slice()
            .sort((a, b) =>
              (a.name || "")
                .toLowerCase()
                .localeCompare((b.name || "").toLowerCase())
            );
          setWards(sorted);
        } catch (error) {
          setWards([]);
        }
      };
      fetchWards();
    }
  }, [wardTypes]);

  const handleAddField = () => {
    setFields([...fields, { value: "" }]);
  };

  const handleRemoveField = (idx) => {
    if (fields.length === 1) return;
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx, val) => {
    const newFields = [...fields];
    newFields[idx].value = val;
    setFields(newFields);
  };

  const handleSaveWardTypes = async (wardTypesArr) => {
    try {
      setLoading(true);
      // console.log("Saving ward types:", wardTypesArr);
      const response = await createWardTypesApi({ wardTypesArr });
      setWardTypes(response.data);
      // console.log(response)
      toast.success("Ward types saved successfully!");
      setModalOpen(false);
      setFields([{ value: "" }]);
    } catch (err) {
      toast.error("Failed to save ward types.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    const values = fields.map((f) => f.value.trim()).filter(Boolean);
    if (values.length === 0) {
      toast.error("Please add at least one ward type.");
      setLoading(false);
      return;
    }
    await handleSaveWardTypes(values);
  };

  // Handler for Add Ward
  const handleAddWard = () => {
    addWardForm.resetFields();
    setEditMode(false);
    setEditingWard(null);
    setAddWardModalOpen(true);
  };

  // Handler for Edit Ward
  const handleEditWard = (ward) => {
    setEditMode(true);
    setEditingWard(ward);
    addWardForm.setFieldsValue({
      name: ward.name,
      type: ward.type,
      floor: ward.floor,
      capacity: ward.capacity,
      isActive: ward.isActive,
    });
    setAddWardModalOpen(true);
  };

  // Handler for Add or Update Ward
  const handleAddWardOk = async () => {
    try {
      const values = await addWardForm.validateFields();
      let response;
      if (editMode && editingWard) {
        // Update mode: send wardId with data
        response = await createWardApi({ ...values, wardId: editingWard._id });
        if (response.success) {
          setWards((prev) =>
            prev.map((w) =>
              w._id === editingWard._id ? { ...w, ...response.ward } : w
            )
          );
          toast.success("Ward updated successfully!");
        } else {
          toast.error(response.message || "Failed to update ward.");
        }
      } else {
        // Add mode: send only data
        response = await createWardApi(values);
        setWards((prev) =>
          [...prev, response.ward].sort((a, b) =>
            (a.name || "")
              .toLowerCase()
              .localeCompare((b.name || "").toLowerCase())
          )
        );
        toast.success("Ward added successfully!");
      }
      setAddWardModalOpen(false);
      addWardForm.resetFields();
      setEditMode(false);
      setEditingWard(null);
    } catch (err) {
      toast.error(editMode ? "Failed to update ward." : "Failed to add ward.");
    }
  };

  const handleOpenUpdateWardTypes = () => {
    setFields(wardTypes.map((type) => ({ value: type })));
    setModalOpen(true);
  };

  // Handler for deleting a ward
  const handleDeleteWard = async () => {
    if (!wardToDelete?._id) return;
    try {
      const res = await deleteWardApi(wardToDelete._id);
      if (res.success) {
        toast.success("Ward deleted successfully!");
        setWards((prev) => prev.filter((w) => w._id !== wardToDelete._id));
      } else {
        toast.error(res.message || "Failed to delete ward.");
      }
    } catch (err) {
      toast.error("Failed to delete ward.");
    } finally {
      setDeleteModalOpen(false);
      setWardToDelete(null);
    }
  };

  // If no ward types, show button and note
  if (!wardTypes || wardTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Alert
          message="Please add Ward Types before creating wards or beds."
          type="info"
          showIcon
          className="mb-4"
        />

        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Ward Types
        </Button>

        <Modal
          title="Ward Types"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleModalOk}
          confirmLoading={loading}
          okText="Save"
        >
          <p className="text-sm text-gray-600 mb-4">
            Example: General, ICU, Private, etc.
          </p>

          <Form form={form} layout="vertical">
            {fields.map((field, idx) => (
              <Space key={idx} className="mb-3 w-full" align="start">
                <Input
                  placeholder={`Type #${idx + 1}`}
                  value={field.value}
                  onChange={(e) => handleFieldChange(idx, e.target.value)}
                />
                {fields.length > 1 && (
                  <Button
                    danger
                    type="text"
                    onClick={() => handleRemoveField(idx)}
                  >
                    Remove
                  </Button>
                )}
              </Space>
            ))}

            <Button type="dashed" block onClick={handleAddField}>
              + Add Another Type
            </Button>
          </Form>
        </Modal>
      </div>
    );
  }

  // Filtered and sorted wards for display
  const filteredWards = wards.filter((w) =>
    w.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Table columns definition
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          style={{
            color: "#1677ff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate(`/wards/beds/${record._id}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Floor",
      dataIndex: "floor",
      key: "floor",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_, item) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  type="text"
                  onClick={() => handleEditWard(item)}
                  title="Edit"
                />
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  type="text"
                  danger
                  onClick={() => {
                    setWardToDelete(item);
                    setDeleteModalOpen(true);
                  }}
                  title="Delete"
                />
              </Space>
            ),
          },
        ]
      : []),
  ];

  // Main UI when wardTypes exist
  return (
    <div>
      {/* Top action buttons, responsive, outside card */}
      <Row gutter={[8, 16]} align="middle" justify="end" className="mb-4">
        <Col xs={24} sm="auto" className="flex flex-wrap gap-2 justify-end">
          {user?.role === "admin" && (
            <>
              <Button onClick={handleOpenUpdateWardTypes} className="mb-2">
                Update Ward Types
              </Button>
              <Button type="primary" onClick={handleAddWard} className="mb-2">
                Add Ward
              </Button>
            </>
          )}
        </Col>
      </Row>
      <Card className="m-0">
        <Row align="middle" justify="space-between" className="mb-6">
          <Col xs={24} sm={12}>
            <h2 className="text-lg font-bold mb-0">Ward</h2>
          </Col>
          <Col xs={24} sm={12} className="flex justify-end">
            <Input.Search
              allowClear
              placeholder="Search by ward name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", maxWidth: 220 }}
              className="mb-2"
            />
          </Col>
        </Row>
        {/* Table of Wards */}
        <div className="mb-6">
          <Table
            columns={columns}
            dataSource={filteredWards}
            rowKey="_id"
            pagination={false}
            locale={{ emptyText: "No wards found." }}
            scroll={{ x: "max-content" }} // <-- Make table responsive horizontally
          />
        </div>

        {/* Update Ward Types Modal */}
        <Modal
          title="Update Ward Types"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleModalOk}
          confirmLoading={loading}
          okText="Update"
        >
          <p className="text-sm text-gray-600 mb-4">
            Example: General, ICU, Private, etc.
          </p>
          <Form form={form} layout="vertical">
            {fields.map((field, idx) => (
              <Space key={idx} className="mb-3 w-full" align="start">
                <Input
                  placeholder={`Type #${idx + 1}`}
                  value={field.value}
                  onChange={(e) => handleFieldChange(idx, e.target.value)}
                />
                {fields.length > 1 && (
                  <Button
                    danger
                    type="text"
                    onClick={() => handleRemoveField(idx)}
                  >
                    Remove
                  </Button>
                )}
              </Space>
            ))}
            <Button type="dashed" block onClick={handleAddField}>
              + Add Another Type
            </Button>
          </Form>
        </Modal>

        {/* Add Ward Modal */}
        <AddWard
          open={addWardModalOpen}
          onCancel={() => {
            setAddWardModalOpen(false);
            setEditMode(false);
            setEditingWard(null);
          }}
          onOk={handleAddWardOk}
          form={addWardForm}
          wardTypes={wardTypes}
        />

        {/* Delete confirmation modal */}
        <Modal
          open={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          onOk={handleDeleteWard}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <div>
            <p>
              Are you sure you want to delete <b>{wardToDelete?.name}</b>?
            </p>
            <p className="text-red-500 font-semibold">
              All beds related to this ward will be deleted!
            </p>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default WardManagment;
