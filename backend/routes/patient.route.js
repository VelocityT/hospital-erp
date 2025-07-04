import express from "express";
const router = express.Router();
import {
  createPatient,
  getAllPatients,
  getPatientDetails,
  editPatientRegistrationDetails,
  switchPatientToIpd,
  getPatientIpdOpdDetails
} from "../controllers/patient.controller.js";
import upload from "../middlewares/multer.js";

router.post("/", upload.array("medicalDocuments", 5), createPatient);

router.get("/", getAllPatients);

router.get("/:id", getPatientDetails);
router.get("/ipd-opd/:id",getPatientIpdOpdDetails)
router.put(
  "/:id",
  upload.array("medicalDocuments", 5),
  editPatientRegistrationDetails
);
router.post("/:id/switch-to-ipd", switchPatientToIpd);

export default router;
