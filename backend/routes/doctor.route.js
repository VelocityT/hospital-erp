import express from 'express';
import { getDoctorsForPatientResgistration } from '../controllers/doctor.controller.js';

const router = express.Router();

router.get("/all-doctors",getDoctorsForPatientResgistration)


export default router;
