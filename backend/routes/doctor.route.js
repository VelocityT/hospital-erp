import express from 'express';
const router = express.Router();
import { getDoctorsForPatientResgistration} from '../controllers/doctor.controller.js';

router.get("/",getDoctorsForPatientResgistration)


export default router;
