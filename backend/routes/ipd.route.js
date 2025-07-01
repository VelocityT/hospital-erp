import express from "express";
import { getAllIpdPatients, updateIpdDetails } from "../controllers/ipd.controller.js";
import { getAvailableWardsAndBeds } from "../controllers/ward.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/all-ipd-patients", getAllIpdPatients);
router.get("/available-wards-beds", getAvailableWardsAndBeds);
router.put("/update-ipd/:ipdId",upload.none(),updateIpdDetails)

// router.use(roleBasedAccess(["admin"]));

export default router;
