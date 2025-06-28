import express from "express";
const router = express.Router();
import { getAllOpdPatients, updateOpdDetails,  } from "../controllers/opd.controller.js";
import upload from "../middlewares/multer.js";

router.get("/", getAllOpdPatients);
router.put("/update/:opdId",upload.none(),updateOpdDetails)



export default router;
