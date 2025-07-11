import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";
import {
  registerOrUpdateUser,
  getUsers,
  getAllStaff,
  getUserById,
} from "../controllers/user.controller.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/get-user/:id", getUserById);
router.get("/all-users", getUsers);
router.get("/all-staff", roleBasedAccess(["admin"]), getAllStaff);

router.post(
  "/register-update-user",
  roleBasedAccess(["admin"]),
  upload.single("photo"),
  registerOrUpdateUser
);

export default router;
