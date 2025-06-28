import Bed from "../models/bed.js";
import Ipd from "../models/ipd.js";
import Opd from "../models/opd.js";
import Patient from "../models/patient.js";
import dayjs from "dayjs";
import { extractArray } from "../utils/helper.js";

export const createPatient = async (req, res) => {
  try {
    // console.log(req.body);
    // return res.status(201).json({
    //   success: true,
    //   message: "Patient created successfully",
    //   // data: patient,
    // });
    const patientData = {
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
    const patient = await Patient.create(patientData);

    if (req.body.patientType === "OPD") {
      const OPDData = {
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

      await Bed.findByIdAndUpdate(req.body.IPD?.bed, {
        status: "Occupied",
        patient: patient._id,
      });
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
    const patients = await Patient.find()
      .select(
        "fullName gender age registrationDate contact.phone bloodGroup patientId"
      )
      .sort({ createdAt: -1 });

    const formattedPatients = patients.map((patient) => ({
      ...patient.toObject(),
      dob: dayjs(patient.dob).format("DD MM YYYY"),
      registrationDate: dayjs(patient.registrationDate).format(
        "DD MM YYYY HH:mm"
      ),
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
    const { id } = req.params;
    const { isIpdPatient, isOpdPatient } = req.query;
    req;

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
      console.log("Fetching IPD details for patient ID:", id);
      const ipd = await Ipd.findOne({ _id: id })
        .populate("attendingDoctor", "fullName ipdCharge")
        .populate(
          "patient",
          "fullName dob address gender age registrationDate contact.phone bloodGroup patientId"
        )
        .populate("ward", "name floor")
        .populate("bed", "bedNumber");

      if (!ipd) {
        return res.status(404).json({
          success: false,
          message: "IPD record not found",
        });
      }

      // Extract clean objects
      const ipdObj = ipd.toObject();
      const { patient: ipdPatient, ...restIpd } = ipdObj;

      patient = {
        ...ipdPatient,
        registrationDate: dayjs(ipdPatient.registrationDate).format(
          "DD-MM-YYYY HH:mm"
        ),
        dob: dayjs(ipdPatient.dob).format("DD-MM-YYYY"),
      };

      detailsKey = "ipdDetails";
      details = {
        ...restIpd,
        admissionDate: dayjs(restIpd.admissionDate).format("DD-MM-YYYY HH:mm"),
      };
    }

    if (isOpdPatient === "true") {
      const opd = await Opd.findOne({ _id: id })
        .populate("doctor", "fullName opdCharge")
        .populate(
          "patient",
          "fullName dob address gender age registrationDate contact.phone bloodGroup patientId"
        );

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
          "DD-MM-YYYY HH:mm"
        ),
        dob: dayjs(opdPatient.dob).format("DD-MM-YYYY"),
      };

      detailsKey = "opdDetails";
      details = {
        ...restOpd,
        visitDateTime: dayjs(restOpd.visitDateTime).format("DD-MM-YYYY HH:mm"),
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
    const id = req.params.id;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const patientObj = patient.toObject();
    patientObj.dob = dayjs(patientObj.dob).format("DD-MM-YYYY HH:mm");

    // Attach OPD or IPD details if requested
    if (patient.patientType === "IPD") {
      const ipdDoc = await Ipd.findOne({ patient: patient._id })
        .populate("attendingDoctor", "fullName ipdCharge")
        .select("-__v");

      if (ipdDoc) {
        const ipdDetails = ipdDoc.toObject();
        ipdDetails.admissionDate = dayjs(ipdDetails.admissionDate).format(
          "DD-MM-YYYY HH:mm"
        );
        patientObj.ipdDetails = ipdDetails;
      }
    } else if (patient.patientType === "OPD") {
      const opdDoc = await Opd.findOne({ patient: patient._id })
        .populate("doctor", "fullName phone opdCharge")
        .select("-__v");

      if (opdDoc) {
        const opdDetails = opdDoc.toObject();
        opdDetails.visitDateTime = dayjs(opdDetails.visitDateTime).format(
          "DD-MM-YYYY HH:mm"
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
    const updatedPatient = await Patient.findByIdAndUpdate(id, patientData, {
      new: true,
    });

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
    const patientId = req.params.id;
    const { doctor, ...ipdInfo } = req.body;
    console.log(req.body);

    const existingIpd = await Ipd.findOne({
      patient: patientId,
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
