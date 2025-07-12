import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBedsByWardIdApi, deleteLastBedApi } from "../../services/apis";
import {
  Spin,
  Alert,
  Tooltip,
  Tag,
  Button,
  Modal,
  Row,
  Col,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AddBeds from "../components/wardComponents/AddBeds";
import BedInfo from "../components/wardComponents/BedInfo";
import { useSelector } from "react-redux";
import { FaBed } from "react-icons/fa";
import toast from "react-hot-toast";

const BedsList = () => {
  const { wardId } = useParams();
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addBedsModalOpen, setAddBedsModalOpen] = useState(false);
  const [ward, setWard] = useState(null);
  const [bedInfoModalOpen, setBedInfoModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [deleteLastBedModalOpen, setDeleteLastBedModalOpen] = useState(false);
  const user = useSelector((state) => state.user);

  const fetchBeds = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBedsByWardIdApi(wardId);
      const sortedBeds = [...(res.data.beds || [])].sort(
        (a, b) => parseInt(a.bedNumber) - parseInt(b.bedNumber)
      );
      setBeds(sortedBeds);
      setWard(res.data.ward);
    } catch (err) {
      setError("Failed to fetch beds.");
      setWard(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wardId) fetchBeds();
  }, [wardId]);

  const handleDeleteLastBed = () => {
    setDeleteLastBedModalOpen(true);
  };

  const confirmDeleteLastBed = async () => {
    try {
      const res = await deleteLastBedApi(wardId);
      if (res.success) {
        toast.success(res.message || "Last bed deleted.");
        setBeds((prev) => prev.filter((b) => b._id !== res.data._id));
      } else {
        toast.error(res.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting bed.");
    } finally {
      setDeleteLastBedModalOpen(false);
    }
  };

  const handleBedDeleteSuccess = (bedId) => {
    setBeds((prev) => prev.filter((b) => b._id !== bedId));
    setBedInfoModalOpen(false);
    setSelectedBed(null);
  };

  if (loading)
    return (
       <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  if (error) return <Alert type="error" message={error} className="my-10" />;

  return (
    <>
      <Row align="middle" justify="space-between" className="mb-4">
        <Col>
          <h2 className="text-lg font-bold mb-0">
            {ward?.name || beds[0]?.ward?.name || "Beds"}
          </h2>
        </Col>
        {user?.role === "admin" && (
          <Col>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddBedsModalOpen(true)}
              >
                Add Beds
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteLastBed}
                disabled={beds.length === 0}
              >
                Delete Last Bed
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* Delete Last Bed Confirmation Modal */}
      <Modal
        open={deleteLastBedModalOpen}
        onCancel={() => setDeleteLastBedModalOpen(false)}
        onOk={confirmDeleteLastBed}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        title={
          <span>
            <ExclamationCircleOutlined className="text-red-500 mr-2" />
            Confirm Delete Last Bed
          </span>
        }
      >
        <div>
          <p>Are you sure you want to delete the last bed in this ward?</p>
        </div>
      </Modal>

      <Modal
        title={`Add Beds ${ward?.name ? "to " + ward.name : ""}`}
        open={addBedsModalOpen}
        onCancel={() => setAddBedsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <AddBeds
          ward={ward}
          setAddBedsModalOpen={setAddBedsModalOpen}
          setBeds={setBeds}
        />
      </Modal>

      <Modal
        title="Bed Info"
        open={bedInfoModalOpen}
        onCancel={() => setBedInfoModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <BedInfo
          bed={selectedBed}
          setBeds={setBeds}
          onDeleteSuccess={handleBedDeleteSuccess}
        />
      </Modal>

      {beds.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No beds found in this ward.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {beds.map((bed) => (
            <Tooltip
              title={ward.name}
              key={bed._id}
              color={
                bed.status === "Available"
                  ? "#bbf7d0"
                  : bed.status === "Occupied"
                  ? "#fecaca"
                  : "#fef08a"
              }
              overlayInnerStyle={{
                color: "#1f2937",
              }}
            >
              <div
                className={`p-4 rounded-lg shadow-md text-center transition-all cursor-pointer min-w-[120px]
      border
      ${
        bed.status === "Available"
          ? "bg-green-100 dark:bg-green-900 border-green-400"
          : bed.status === "Occupied"
          ? "bg-red-100 dark:bg-red-900 border-red-400"
          : "bg-yellow-100 dark:bg-yellow-900 border-yellow-400"
      }`}
                onClick={() => {
                  setSelectedBed(bed);
                  setBedInfoModalOpen(true);
                }}
              >
                <FaBed className="text-4xl mx-auto mb-2 text-gray-700 dark:text-gray-200" />
                <div className="font-bold text-lg break-all text-gray-800 dark:text-white">
                  {bed.bedNumber}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ₹{bed.charge || 0}
                </div>
                <Tag
                  className="mt-1"
                  color={
                    bed.status === "Available"
                      ? "green"
                      : bed.status === "Occupied"
                      ? "red"
                      : "gold"
                  }
                >
                  {bed.status}
                </Tag>
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </>
  );
};

export default BedsList;
