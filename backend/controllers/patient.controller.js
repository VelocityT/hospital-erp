import Ipd from "../models/ipd.js";
import Opd from "../models/opd.js";
import Patient from "../models/patient.js";
import dayjs from "dayjs";

const extractArray = (body, key) => {
  const value = body[key];
  // console.log(body[key]);
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const createPatient = async (req, res) => {
  try {
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
      symptoms: {
        symptomNames: extractArray(req.body.symptoms, "symptomNames"),
        symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
        description: req.body.symptoms?.description || "",
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
        visitDateTime: req.body.OPD?.visitDateTime || null,
        doctor: req.body.OPD?.doctor || null,
        notes: req.body.OPD?.notes || "",
        consultationFees: Number(req.body.OPD?.consultationFees || 0),
      };

      const opdResponse = await Opd.create(OPDData);
      // console.log(opdResponse);
    } else if (req.body.patientType === "IPD") {
      const IPDData = {
        patient: patient?._id,
        ipdNumber: req.body.IPD?.ipdNumber || "N/A",
        admissionDateTime: req.body.IPD?.admissionDateTime || null,
        attendingDoctor: req.body.IPD?.doctor || null,
        ward: req.body.IPD?.wardType || "",
        bed: req.body.IPD?.bed || "",
        notes: req.body.IPD?.notes || "",
        height: Number(req.body.IPD?.height || 0),
        weight: Number(req.body.IPD?.weight || 0),
        bloodPressure: req.body.IPD?.bloodPressure || "",
      };

      const ipdResponse = await Ipd.create(IPDData);
      // console.log(ipdResponse);
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
        "fullName gender dob age patientType contact.phone bloodGroup patientId"
      )
      .sort({ createdAt: -1 });

    const enrichedPatients = await Promise.all(
      patients.map(async (patient) => {
        let admitDate = null;
        let status = null;

        if (patient.patientType === "OPD") {
          const opd = await Opd.findOne({ patient: patient._id }).select(
            "visitDateTime -_id"
          );
          admitDate = opd?.visitDateTime || null;
        } else if (patient.patientType === "IPD") {
          const ipd = await Ipd.findOne({ patient: patient._id }).select(
            "admissionDate status -_id"
          );
          // console.log(ipd)
          admitDate = ipd?.admissionDate || null;
          status = ipd?.status || "-"
        }

        return {
          ...patient.toObject(),
          admitDate,
          status
        };
      })
    );

    // console.log(patients)
    return res.status(200).json({
      success: true,
      message: "All patients fetched successfully",
      data: enrichedPatients,
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
        .populate("attendingDoctor", "fullName")
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
        .populate("doctor", "fullName phone")
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

export const editPatientRegistrationDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body)
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
      symptoms: {
        symptomNames: extractArray(req.body.symptoms, "symptomNames"),
        symptomTitles: extractArray(req.body.symptoms, "symptomTitles"),
        description: req.body.symptoms?.description || "",
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

    // Update or create OPD/IPD details as per patientType
    if (req.body.patientType === "OPD") {
      const opdUpdate = {
        opdNumber: req.body.OPD?.opdNumber || "N/A",
        visitDateTime: req.body.OPD?.visitDateTime || null,
        doctor: req.body.OPD?.doctor || null,
        notes: req.body.OPD?.notes || "",
        consultationFees: Number(req.body.OPD?.consultationFees || 0),
      };
      await Opd.findOneAndUpdate(
        { patient: id },
        { ...opdUpdate, patient: id },
        { upsert: true, new: true }
      );
      // Optionally, remove IPD if switching from IPD to OPD
      await Ipd.deleteOne({ patient: id });
    } else if (req.body.patientType === "IPD") {
      const ipdUpdate = {
        ipdNumber: req.body.IPD?.ipdNumber || "N/A",
        admissionDateTime: req.body.IPD?.admissionDateTime || null,
        attendingDoctor: req.body.IPD?.doctor || null,
        ward: req.body.IPD?.wardType || "",
        bed: req.body.IPD?.bed || "",
        notes: req.body.IPD?.notes || "",
        height: Number(req.body.IPD?.height || 0),
        weight: Number(req.body.IPD?.weight || 0),
        bloodPressure: req.body.IPD?.bloodPressure || "",
        patient: id,
      };
      await Ipd.findOneAndUpdate({ patient: id }, ipdUpdate, {
        upsert: true,
        new: true,
      });
      // Optionally, remove OPD if switching from OPD to IPD
      await Opd.deleteOne({ patient: id });
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
