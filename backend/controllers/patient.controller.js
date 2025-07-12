import Bed from "../models/bed.js";
import Ipd from "../models/ipd.js";
import Opd from "../models/opd.js";
import Patient from "../models/patient.js";
import dayjs from "dayjs";
import { extractArray } from "../utils/helper.js";
import { generateCustomId } from "../utils/generateCustomId.js";

export const createPatient = async (req, res) => {
  try {
    const { hospital } = req.authority;
    // console.log(req.body);
    // return res.status(201).json({
    //   success: true,
    //   message: "Patient created successfully",
    //   // data: patient,
    // });
    const patientData = {
      hospital,
      fullName: req.body.fullName,
      gender: req.body.gender,
      dob: req.body.dob,
      bloodGroup: req.body.bloodGroup,
      // patientType: req.body.patientType,
      age: {
        years: Number(req.body.age?.years || 0),
        months: Number(req.body.age?.months || 0),
        days: Number(req.body.age?.days || 0),
      },
      contact: {
        phone: req.body.contact?.phone,
        email: req.body.contact?.email,
      },
      address: {
        line1: req.body.address?.line1,
        line2: req.body.address?.line2,
        city: req.body.address?.city,
        pincode: Number(req.body.address?.pincode || 0),
      },
      // medicalDocuments:
      //   req.files?.map((file) => ({
      //     name: file.originalname,
      //     type: file.mimetype,
      //     data: file.buffer,
      //   })) || [],
    };
    // console.log(req.body);
    const patientId = await generateCustomId(hospital, "patient");
    const patient = await Patient.create({ patientId, ...patientData });

    if (req.body.patientType === "OPD") {
      const OPDData = {
        hospital,
        patient: patient?._id,
        opdNumber: req.body.OPD?.opdNumber || "N/A",
        // visitDateTime: req.body.OPD?.visitDateTime || null,
        doctor: req.body.OPD?.doctor || null,
        notes: req.body.OPD?.opdNotes || "",
        consultationFees: Number(req.body.OPD?.consultationFees || 0),
        symptoms: {
          symptomNames: extractArray(req.body.symptoms, "symptomNames"),
          symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
          description: req.body.symptoms?.description || "",
        },
      };
      await Opd.create(OPDData);
    } else if (req.body.patientType === "IPD") {
      const IPDData = {
        hospital,
        patient: patient?._id,
        ipdNumber: req.body.IPD?.ipdNumber || "",
        // admissionDateTime: req.body.IPD?.admissionDateTime || null,
        attendingDoctor: req.body.IPD?.doctor || null,
        ward: req.body.IPD?.ward || "",
        bed: req.body.IPD?.bed || "",
        notes: req.body.IPD?.ipdNotes || "",
        height: Number(req.body.IPD?.height || 0),
        weight: Number(req.body.IPD?.weight || 0),
        bloodPressure: req.body.IPD?.bloodPressure || "",
        symptoms: {
          symptomNames: extractArray(req.body.symptoms, "symptomNames"),
          symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
          description: req.body.symptoms?.description || "",
        },
      };
      await Ipd.create(IPDData);

      await Bed.findOneAndUpdate(
        { _id: req.body.IPD?.bed, hospital },
        {
          status: "Occupied",
          patient: patient._id,
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      // data: patient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create patient",
      error: error.message,
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const patients = await Patient.find({ hospital })
      .select(
        "fullName gender age registrationDate contact.phone bloodGroup patientId"
      )
      .sort({ createdAt: -1 });

    const formattedPatients = patients.map((patient) => ({
      ...patient.toObject(),
    }));

    // console.log(patients)
    return res.status(200).json({
      success: true,
      message: "All patients fetched successfully",
      data: formattedPatients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};

export const getPatientIpdOpdDetails = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const { id } = req.params;
    const { isIpdPatient, isOpdPatient, detailPage } = req.query;
    // console.log(detailPage)

    if (!isIpdPatient && !isOpdPatient) {
      return res.status(400).json({
        success: false,
        message: "Either ipdPatient or opdPatient must be provided",
      });
    }

    let patient = null;
    let details = null;
    let detailsKey = null;

    if (isIpdPatient === "true") {
      // console.log("Fetching IPD details for patient ID:", id);
      const ipd = await Ipd.findOne({ _id: id, hospital })
        .populate("attendingDoctor", "fullName ipdCharge")
        .populate(
          "patient",
          "fullName dob address gender age registrationDate contact.phone bloodGroup patientId dischargeSummary"
        )
        .populate("ward", "name floor")
        .populate("bed", "bedNumber charge")
        .populate("dischargeSummary.dischargedBy", "fullName role")
        .populate(detailPage ? "payment.bill" : "");

      if (!ipd) {
        return res.status(404).json({
          success: false,
          message: "IPD record not found",
        });
      }

      // Extract clean objects
      const ipdObj = ipd.toObject();
      const { patient: ipdPatient, dischargeSummary, ...restIpd } = ipdObj;

      patient = {
        ...ipdPatient,
        registrationDate: dayjs(ipdPatient.registrationDate).format(
          "DD/MM/YYYY HH:mm"
        ),
        dob: dayjs(ipdPatient.dob),
      };

      let formattedDischargeSummary = {};
      if (dischargeSummary?.dischargeDate) {
        formattedDischargeSummary = {
          ...dischargeSummary,
          dischargeDate: dayjs(dischargeSummary.dischargeDate).format(
            "DD/MM/YYYY HH:mm"
          ),
        };
      }

      detailsKey = "ipdDetails";
      details = {
        ...restIpd,
        admissionDate: dayjs(restIpd.admissionDate),
        dischargeSummary: formattedDischargeSummary,
      };
    }

    if (isOpdPatient === "true") {
      const opd = await Opd.findOne({ _id: id, hospital })
        .populate("doctor", "fullName opdCharge")
        .populate(
          "patient",
          "fullName dob address gender age registrationDate contact.phone bloodGroup patientId"
        )
        .populate(detailPage ? "payment.bill" : "");

      if (!opd) {
        return res.status(404).json({
          success: false,
          message: "OPD record not found",
        });
      }

      const opdObj = opd.toObject();
      const { patient: opdPatient, ...restOpd } = opdObj;

      patient = {
        ...opdPatient,
        registrationDate: dayjs(opdPatient.registrationDate).format(
          "DD/MM/YYYY HH:mm"
        ),
        dob: dayjs(opdPatient.dob),
      };

      detailsKey = "opdDetails";
      details = {
        ...restOpd,
        visitDateTime: dayjs(restOpd.visitDateTime),
      };
    }

    return res.status(200).json({
      success: true,
      message: "Patient IPD/OPD details fetched successfully",
      data: {
        ...patient,
        [detailsKey]: details,
      },
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient details",
      error: error.message,
    });
  }
};

export const getPatientDetails = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const id = req.params.id;

    const patient = await Patient.findOne({ _id: id, hospital });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const patientObj = patient.toObject();
    patientObj.dob = dayjs(patientObj.dob);

    // Attach OPD or IPD details if requested
    if (patient.patientType === "IPD") {
      const ipdDoc = await Ipd.findOne({ patient: patient._id, hospital })
        .populate("attendingDoctor", "fullName ipdCharge")
        .select("-__v");

      if (ipdDoc) {
        const ipdDetails = ipdDoc.toObject();
        ipdDetails.admissionDate = dayjs(ipdDetails.admissionDate).format(
          "DD/MM/YYYY HH:mm"
        );
        patientObj.ipdDetails = ipdDetails;
      }
    } else if (patient.patientType === "OPD") {
      const opdDoc = await Opd.findOne({ patient: patient._id, hospital })
        .populate("doctor", "fullName phone opdCharge")
        .select("-__v");

      if (opdDoc) {
        const opdDetails = opdDoc.toObject();
        opdDetails.visitDateTime = dayjs(opdDetails.visitDateTime).format(
          "DD/MM/YYYY HH:mm"
        );
        patientObj.opdDetails = opdDetails;
      }
    }

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data: patientObj,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
};

export const updatePatientRegistration = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const id = req.params.id;
    // console.log(req.body);
    // Prepare patient update data
    const patientData = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      dob: req.body.dob,
      bloodGroup: req.body.bloodGroup,
      patientType: req.body.patientType,
      age: {
        years: Number(req.body.age?.years || 0),
        months: Number(req.body.age?.months || 0),
        days: Number(req.body.age?.days || 0),
      },
      contact: {
        phone: req.body.contact?.phone,
        email: req.body.contact?.email,
      },
      address: {
        line1: req.body.address?.line1,
        line2: req.body.address?.line2,
        city: req.body.address?.city,
        pincode: Number(req.body.address?.pincode || 0),
      },
      // medicalDocuments: ... // handle if needed
    };

    // Update patient document
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: id, hospital },
      patientData,
      {
        new: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update patient",
      error: error.message,
    });
  }
};

export const switchPatientToIpd = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const patientId = req.params.id;
    const { doctor, ...ipdInfo } = req.body;
    // console.log(req.body);
    const existingIpd = await Ipd.findOne({
      patient: patientId,
      hospital,
      status: { $ne: "Discharged" },
    });

    // bed assing
    await Bed.findByIdAndUpdate(
      ipdInfo.bed,
      {
        patient: patientId,
        status: "Occupied",
      },
      { new: true }
    );

    if (existingIpd) {
      return res.status(400).json({
        success: false,
        message: "Patient is already admitted in IPD.",
      });
    }

    const ipdData = {
      ...ipdInfo,
      attendingDoctor: doctor,
      patient: patientId,
      hospital,
    };

    const newIpd = await Ipd.create(ipdData);

    return res.status(200).json({
      success: true,
      message: "Patient switched to IPD successfully",
      data: newIpd,
    });
  } catch (error) {
    console.error("Error switching patient to IPD:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to switch patient",
      error: error.message,
    });
  }
};
export const getPatientFullDetails = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const { patientId } = req.params;
    // console.log("Fetching full details for patient:", patientId);

    const patient = await Patient.findOne({ patientId, hospital }).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const patient_id = patient._id;

    const ipds = await Ipd.find({ patient: patient_id, hospital })
      .populate("bed", "bedNumber charge")
      .populate("ward", "name floor type")
      .populate("attendingDoctor", "fullName role ipdCharge")
      .populate("dischargeSummary.dischargedBy", "fullName role")
      .populate("payment.bill")
      .sort({ admissionDate: -1 })
      .lean();

    const opds = await Opd.find({ patient: patient_id, hospital })
      .populate("doctor", "fullName role opdCharge")
      .populate("payment.bill")
      .sort({ visitDateTime: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Patient full details fetched successfully",
      data: {
        patient,
        ipds,
        opds,
      },
    });
  } catch (error) {
    console.error("Error fetching patient full details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient full details",
      error: error.message,
    });
  }
};

export const addOpdOrIpd = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const { type, ...payload } = req.body;

    const checkPatient = await Patient.findOne({
      _id: payload?.patient,
      hospital,
    });

    if (!checkPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (type === "ipd" && payload.ipdNumber) {
      await Ipd.create({ ...payload, hospital });
      await Bed.updateOne(
        { _id: payload.bed, hospital },
        {
          $set: {
            status: "Occupied",
            patient: payload.patient,
          },
        }
      );
    } else if (type === "opd" && payload.opdNumber) {
      await Opd.create({ ...payload, hospital });
    } else {
      return res.status(403).json({
        success: false,
        message: "Something missing",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        type === "ipd" ? "IPD Added Successfully" : "OPD Added Successfully",
    });
  } catch (error) {
    console.error("Error in addOpdOrIpd:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add OPD/IPD record",
      error: error.message,
    });
  }
};
export const searchPatient = async (req, res) => {
  try {
    const { hospital } = req.authority;
    const q = req.query.q?.trim();

    if (!q || q.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 4 characters.",
      });
    }

    const regex = new RegExp(q, "i");

    const patients = await Patient.find({
      hospital,
      $or: [{ "contact.phone": regex }, { patientId: regex }],
    })
      .select("fullName patientId contact.phone")
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Patients Found",
      patients,
    });
  } catch (error) {
    console.error("Error in searchPatient:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};
