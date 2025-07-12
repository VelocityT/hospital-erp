import Hospital from "../models/hospital.js";

export const generateCustomId = async (hospitalId, type) => {
  const prefixField = type === "staff" ? "staffPrefix" : "patientPrefix";
  const counterField = type === "staff" ? "staffCounter" : "patientCounter";

  const hospital = await Hospital.findById(hospitalId);

  if (!hospital) throw new Error("Hospital not found");

  const prefix = hospital[prefixField] || "";
  const count = hospital[counterField] + 1;

  const paddedCount = String(count).padStart(3, "0");

  const customId = `${prefix}-${paddedCount}`;

  await Hospital.findByIdAndUpdate(hospitalId, {
    [counterField]: count,
  });

  return customId;
};
