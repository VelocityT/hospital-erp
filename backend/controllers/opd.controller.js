import Opd from "../models/opd.js";

export const getAllOpdPatients = async (req, res) => {
  try {
    const opdPatients = await Opd.find()
      .select("opdNumber doctor visitDateTime patient")
      .sort({ visitDateTime: -1 })
      .populate({
        path: "doctor",
        select: "fullName ",
      })
      .populate({
        path: "patient",
        select: "fullName gender dob contact.phone bloodGroup patientId",
      });

    // const flattened = opdPatients.map((opd) => ({
    //   opdNumber: opd.opdNumber,
    //   visitDateTime: opd.visitDateTime,
    //   doctorName: opd.doctor?.fullName || "-",
    //   fullName: opd.patient?.fullName || "-",
    //   gender: opd.patient?.gender || "-",
    //   dob: opd.patient?.dob || "-",
    //   bloodGroup: opd.patient?.bloodGroup || "-",
    //   phone: opd.patient?.contact?.phone || "-",
    // }));

    return res.status(200).json({
      success: true,
      message: "All OPD patients fetched successfully",
      data: opdPatients,
    });
  } catch (error) {
    console.error("Error fetching OPD patients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch OPD patients",
      error: error.message,
    });
  }
};
