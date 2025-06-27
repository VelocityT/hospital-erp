import React from "react";
import { Descriptions, Tag, Button, Popconfirm, message } from "antd";
import { useSelector } from "react-redux";

const BedInfo = ({ bed }) => {

  if (!bed) return null;

  return (
    <>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Bed Number">
          {bed.bedNumber ?? <span className="text-gray-400">-</span>}
        </Descriptions.Item>
        <Descriptions.Item label="Charge">
          {bed.charge !== undefined && bed.charge !== null ? (
            `₹${bed.charge}`
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            color={
              bed.status === "Available"
                ? "green"
                : bed.status === "Occupied"
                ? "red"
                : "gold"
            }
          >
            {bed.status ?? "-"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ward Name">
          {bed.ward?.name ?? <span className="text-gray-400">-</span>}
        </Descriptions.Item>
        <Descriptions.Item label="Ward Floor">
          {bed.ward?.floor ?? <span className="text-gray-400">-</span>}
        </Descriptions.Item>
        <Descriptions.Item label="Patient Name">
          {bed.patient?.name ?? <span className="text-gray-400">-</span>}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default BedInfo;
