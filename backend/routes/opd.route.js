import express from "express";
const router = express.Router();
import { getAllOpdPatients, updateOpdDetails,  } from "../controllers/opd.controller.js";
import upload from "../middlewares/multer.js";

router.get("/all-opd-patients", getAllOpdPatients);
router.put("/update-opd/:opdId",upload.none(),updateOpdDetails)



export default router;
