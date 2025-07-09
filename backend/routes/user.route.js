import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";
import { registerOrUpdateUser, getUsers,getAllStaff, getUserById } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/register-update-user",
  authenticateToken,
  roleBasedAccess(["admin"]),
  upload.single("photo"),
  registerOrUpdateUser
);

router.get("/all-users", getUsers);
router.get(
  "/all-staff",
  authenticateToken,
  roleBasedAccess(["admin"]),
  getAllStaff
);
router.get("/get-user/:id", getUserById);

export default router;
