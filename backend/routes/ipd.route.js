import express from "express";
const router = express.Router();
import { getAllIpdPatients } from "../controllers/ipd.controller.js";

router.get("/", getAllIpdPatients);

export default router;
