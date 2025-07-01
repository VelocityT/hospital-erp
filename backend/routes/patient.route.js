import express from "express";
const router = express.Router();
import {
  createPatient,
  getAllPatients,
  getPatientDetails,
  updatePatientRegistration,
  switchPatientToIpd,
  getPatientIpdOpdDetails
} from "../controllers/patient.controller.js";
import upload from "../middlewares/multer.js";

router.post("/patient-registration", upload.array("medicalDocuments", 5), createPatient);

router.get("/all-patients", getAllPatients);

router.get("/patient-details/:id", getPatientDetails);
router.get("/ipd-opd-details/:id",getPatientIpdOpdDetails)
router.put(
  "/patient-registration/edit/:id",
  upload.array("medicalDocuments", 5),
  updatePatientRegistration
);
router.post("/:id/patient-switch-to-ipd", switchPatientToIpd);

export default router;
