import express from 'express';
import { createAndUpdateMedicine, deleteMedicine, getAllMedicines, uploadMedicineExcel } from '../controllers/pharmacy.controller.js';
import upload from "../middlewares/multer.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from '../middlewares/roleBaseAccess.middleare.js';

const router = express.Router();
router.use(authenticateToken);

router.get("/all-medicines", getAllMedicines);

router.post(
  '/create-update-medicine',roleBasedAccess(["admin","pharmacist"]),
  upload.single('medicinePhoto'),
  createAndUpdateMedicine
);
router.post("/import-medicines",roleBasedAccess(["admin","pharmacist"]), upload.single("file"), uploadMedicineExcel)
router.delete("/delete-medicine/:id",roleBasedAccess(["admin","pharmacist"]), deleteMedicine);

export default router;
