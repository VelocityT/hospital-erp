import express from "express";
const router = express.Router();
import {
  createPatient,
  getAllPatients,
  getPatientDetails,
  editPatientRegistrationDetails,
} from "../controllers/patient.controller.js";
import upload from "../middlewares/multer.js";

router.post("/", upload.array("medicalDocuments", 5), createPatient);

router.get("/", getAllPatients);

router.get("/:id", getPatientDetails);
router.put(
  "/:id",
  upload.array("medicalDocuments", 5),
  editPatientRegistrationDetails
);

export default router;
