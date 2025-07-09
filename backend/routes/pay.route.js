// in this file bill schema related things happens
import express from 'express';
import { payPatientIpdBill, payPatientOpdBill } from '../controllers/pay.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { roleBasedAccess } from '../middlewares/roleBaseAccess.middleare.js';

const router = express.Router();
router.use(authenticateToken)

// router.post("/patient-ipd-bill",payPatientIpdBill)
router.post("/patient-ipd-bill",roleBasedAccess(["admin","receptionist"]),payPatientIpdBill)
router.post("/patient-opd-bill",roleBasedAccess(["admin","receptionist"]),payPatientOpdBill)
export default router;
