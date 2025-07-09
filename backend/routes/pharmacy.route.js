import express from 'express';
import { createAndUpdateMedicine, deleteMedicine, getAllMedicines, uploadMedicineExcel } from '../controllers/pharmacy.controller.js';
import upload from "../middlewares/multer.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.use(authenticateToken);

router.post(
  '/create-update-medicine',
  upload.single('medicinePhoto'),
  createAndUpdateMedicine
);
router.post("/import-medicines", upload.single("file"), uploadMedicineExcel)
router.get("/all-medicines", getAllMedicines);
router.delete("/delete-medicine/:id", deleteMedicine);

export default router;
