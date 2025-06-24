import express from "express";
const router = express.Router();
import { getAllOpdPatients } from "../controllers/opd.controller.js";

router.get("/", getAllOpdPatients);

export default router;
