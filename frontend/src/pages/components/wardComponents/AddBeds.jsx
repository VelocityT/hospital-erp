import React, { useState, useEffect } from "react";
import { Input, Button, message, InputNumber } from "antd";
import { useSelector } from "react-redux";
import { createBedsApi } from "../../../services/apis";

const AddBeds = ({ ward, setAddBedsModalOpen, setBeds }) => {
  const [bedCount, setBedCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wardId, setWardId] = useState("");
  const [charge, setCharge] = useState();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (ward && ward._id) {
      setWardId(ward._id);
    } else {
      setWardId("");
    }
  }, [ward]);

  const handleSubmit = async () => {
    if (!bedCount || bedCount < 1 || !wardId) {
      message.warning("Please select a valid bed count.");
      return;
    }
    if (
      charge === undefined ||
      charge === null ||
      charge === "" ||
      isNaN(charge)
    ) {
      message.warning("Please enter a valid charge.");
      return;
    }

    const payload = {
      count: bedCount,
      ward: wardId,
      charge: Number(charge),
    };
    try {
      setLoading(true);
      message.success("success");
      const res = await createBedsApi(payload);
      console.log(res);
      if (res.success) {
        message.success("Beds created successfully");
        setBeds((prevBeds) => [...prevBeds, ...res.data]);
        setBedCount(1);
        setCharge();
        if (setAddBedsModalOpen) setAddBedsModalOpen(false);
      } else {
        message.error(res.message || "Failed to create beds");
        console.log(res.message || "Failed to create beds");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 max-w-xl mx-auto">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Ward</label>
        <Input
          value={ward ? `${ward.name} (${ward.type} - ${ward.floor})` : ""}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Number of Beds <span className="text-red-500">*</span>
        </label>
        <InputNumber
          min={1}
          max={ward?.capacity || 100}
          value={bedCount}
          onChange={(value) => setBedCount(value)}
          className="w-full"
          placeholder="Enter number of beds to create"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Charge <span className="text-red-500">*</span>
        </label>
        <InputNumber
          min={0}
          value={charge}
          onChange={setCharge}
          className="w-full"
          placeholder="Enter bed charge"
        />
      </div>

      <div className="text-right">
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!bedCount || !wardId}
        >
          Add Beds
        </Button>
      </div>
    </div>
  );
};

export default AddBeds;
