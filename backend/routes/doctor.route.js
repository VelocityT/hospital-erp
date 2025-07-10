import express from 'express';
import { getDoctorsForPatientResgistration } from '../controllers/doctor.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken)

router.get("/all-doctors",getDoctorsForPatientResgistration)


export default router;
