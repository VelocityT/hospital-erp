// in this file bill schema related things happens
import express from 'express';
import { payPatientIpdBill, payPatientOpdBill } from '../controllers/pay.controller.js';
const router = express.Router();

// router.post("/patient-ipd-bill",payPatientIpdBill)
router.post("/patient-ipd-bill",payPatientIpdBill)
router.post("/patient-opd-bill",payPatientOpdBill)
export default router;
