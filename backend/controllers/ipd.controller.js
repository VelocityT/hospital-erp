import Bed from "../models/bed.js";
import Ipd from "../models/ipd.js";
import { extractArray } from "../utils/helper.js";
import dayjs from "dayjs";

export const getAllIpdPatients = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const ipdPatients = await Ipd.find({ hospital })
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
    const { hospital } = req.authority;
    const { ipdId } = req.params;

    // Fetch the IPD record
    const existingIpd = await Ipd.findOne({ _id: ipdId, hospital }).populate(
      "bed"
    );
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
        await Bed.findOneAndUpdate(
          { _id: oldBedId, hospital },
          {
            status: "Available",
            patient: null,
          }
        );
      }

      // Assign new bed
      await Bed.findOneAndUpdate(
        { _id: newBedId, hospital },
        {
          status: "Occupied",
          patient: existingIpd.patient,
        }
      );
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
    const updatedIpd = await Ipd.findOneAndUpdate({_id:ipdId,hospital}, updateData, {
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

export const dischargePatient = async (req, res) => {
  try {
    const {hospital} = req.authority
    const { ipdId: _id, patientId: patient, ...summary } = req.body;

    const ipd = await Ipd.findOne({ _id, patient,hospital })
      .populate("attendingDoctor", "ipdCharge")
      .populate("bed", "charge")
      .populate("payment.bill");

    if (!ipd) {
      return res.status(404).json({
        success: false,
        message: "IPD record not found",
      });
    }

    //check if payment done then discharge
    const admissionDate = ipd?.admissionDate;
    const dischargeDate = dayjs();
    const days = Math.max(dischargeDate.diff(admissionDate, "day"), 1);
    const bedCharge = (ipd.bed?.charge || 0) * days;
    const doctorCharge = (ipd.attendingDoctor?.ipdCharge || 0) * days;
    const totalCharge = bedCharge + doctorCharge;
    const paidTotalCharge = ipd?.payment?.bill.reduce(
      (acc, bill) => acc + bill.totalCharge,
      0
    );

    // console.log(totalCharge);
    // console.log(paidTotalCharge);
    if (paidTotalCharge === totalCharge) {
      ipd.payment.status = "Paid";
    }
    if (paidTotalCharge !== totalCharge) {
      return res.status(400).json({
        success: false,
        message: "Bill payment is not fully completed.",
      });
    }

    // Update discharge summary and status
    ipd.dischargeSummary = {
      ...summary,
      dischargeDate: dayjs().toDate(),
    };
    ipd.status = "Discharged";

    await ipd.save();

    // Free the bed
    let updatedBed = null;
    if (ipd.bed?._id) {
      updatedBed = await Bed.findOneAndUpdate(
        {_id:ipd.bed._id,hospital},
        { status: "Available", patient: null },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Patient discharged successfully",
    });
  } catch (error) {
    console.error("Discharge error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during discharge",
    });
  }
};
