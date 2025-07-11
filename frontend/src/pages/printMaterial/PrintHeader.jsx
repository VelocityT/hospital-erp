import React from "react";
import { hospitalInfo } from "../../utils/localStorage";

const PrintHeader = () => {
  return (
    <div className="flex justify-between items-start border-b pb-4 mb-6">
      {/* Left: Logo + Name */}
      <div className="flex gap-4 items-center">
        <img
          src={hospitalInfo.logo}
          alt="Hospital Logo"
          className="w-16 h-16 object-contain rounded"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {hospitalInfo.name}
          </h1>
          <p className="text-sm text-gray-700">{hospitalInfo.tagline}</p>
        </div>
      </div>

      {/* Right: Details */}
      <div className="text-right text-sm text-gray-700 leading-tight">
        <div>{hospitalInfo.address}</div>
        <div><b>Phone:</b> {hospitalInfo.phone}</div>
        <div><b>Email:</b> {hospitalInfo.email}</div>
        <div>
          <b>Website:</b>{" "}
          <a
            href={hospitalInfo.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {hospitalInfo.website}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;
