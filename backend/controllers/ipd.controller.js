import Bed from "../models/bed.js";
import Ipd from "../models/ipd.js";
import { extractArray } from "../utils/helper.js";

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

export const updateIpdDetails = async (req, res) => {
  try {
    const { ipdId } = req.params;

    // Fetch the IPD record
    const existingIpd = await Ipd.findById(ipdId).populate("bed");
    if (!existingIpd) {
      return res.status(404).json({
        success: false,
        message: "IPD record not found",
      });
    }

    const newBedId = req.body.IPD?.bed;
    const oldBedId = existingIpd.bed?._id?.toString();

    //  Handle bed change
    if (newBedId && newBedId !== oldBedId) {
      //  Free old bed
      if (oldBedId) {
        await Bed.findByIdAndUpdate(oldBedId, {
          status: "Available",
          patient: null,
        });
      }

      // Assign new bed
      await Bed.findByIdAndUpdate(newBedId, {
        status: "Occupied",
        patient: existingIpd.patient,
      });
    }

    // Prepare update data
    const updateData = {
      attendingDoctor: req.body.IPD?.doctor || null,
      ward: req.body.IPD?.ward || "",
      bed: newBedId || oldBedId || "",
      notes: req.body.IPD?.ipdNotes || "",
      height: req.body.IPD?.height || "",
      weight: req.body.IPD?.weight || "",
      bloodPressure: req.body.IPD?.bloodPressure || "",
      symptoms: {
        symptomNames: extractArray(req.body.symptoms, "symptomNames"),
        symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
        description: req.body.symptoms?.description || "",
      },
    };

    //Update IPD document
    const updatedIpd = await Ipd.findByIdAndUpdate(ipdId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "IPD details updated successfully",
      data: updatedIpd,
    });
  } catch (error) {
    console.error("Error updating IPD details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update IPD details",
      error: error.message,
    });
  }
};
