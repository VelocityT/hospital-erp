import Ipd from "../models/ipd.js";

export const getAllIpdPatients = async (req, res) => {
  try {
    const ipdPatients = await Ipd.find()
      .select("ipdNumber attendingDoctor admissionDate patient status")
      .sort({ admissionDate: -1 })
      .populate({
        path: "attendingDoctor",
        select: "fullName",
      })
      .populate({
        path: "patient",
        select: "fullName gender dob contact.phone bloodGroup patientId",
      });

    // console.log(ipdPatients);
    // const flattened = ipdPatients.map((ipd) => ({
    //   ipdNumber: ipd.ipdNumber,
    //   admissionDate: ipd.admissionDate,
    //   doctor: ipd.attendingDoctor,
    //   fullName: ipd.patient?.fullName || "-",
    //   gender: ipd.patient?.gender || "-",
    //   dob: ipd.patient?.dob || "-",
    //   bloodGroup: ipd.patient?.bloodGroup || "-",
    //   phone: ipd.patient?.contact?.phone || "-",
    // }));

    return res.status(200).json({
      success: true,
      message: "All IPD patients fetched successfully",
      data: ipdPatients,
    });
  } catch (error) {
    console.error("Error fetching IPD patients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch IPD patients",
      error: error.message,
    });
  }
};
