import Opd from "../models/opd.js";
import { extractArray } from "../utils/helper.js";

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

export const updateOpdDetails = async (req, res) => {
  try {
    const { opdId } = req.params;
    // console.log(req.body);

    const updateData = {
      doctor: req.body.OPD?.doctor || null,
      notes: req.body.OPD?.opdNotes || "",
      symptoms: {
        symptomNames: extractArray(req.body.symptoms, "symptomNames"),
        symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
        description: req.body.symptoms?.description || "",
      },
    };

    const updatedOpd = await Opd.findByIdAndUpdate(opdId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOpd) {
      return res.status(404).json({
        success: false,
        message: "OPD record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "OPD details updated successfully",
      data: updatedOpd,
    });
  } catch (error) {
    console.error("Error updating OPD details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update OPD details",
      error: error.message,
    });
  }
};
