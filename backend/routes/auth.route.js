import express from "express";
import {
  createOrUpdateHospital,
  getDashboardStatsData,
  getIncomeOverview,
  loginUser,
  logoutUser,
  getHospitalList,
  getHospitalById,
  impersonateUser,
  leaveImpersonation,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.use(authenticateToken);
router.get("/dashboard/static-data", getDashboardStatsData);
router.get("/income/overview", getIncomeOverview);
router.post(
  "/leave-impersonation",
  (req, res, next) => {
    console.log(req.authority);
    next();
  },
  leaveImpersonation
);

router.use(roleBasedAccess(["superAdmin"]));
router.post(
  "/create-update-hospital",
  upload.single("logo"),
  createOrUpdateHospital
);
router.get("/hospitals-list", getHospitalList);
router.get("/hospital/:id", getHospitalById);
router.post("/impersonate/:userId", impersonateUser);

export default router;
