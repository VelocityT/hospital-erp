import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";
import { registerUser, getUsers,getAllStaff } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/user-registration",
  authenticateToken,
  roleBasedAccess(["admin"]),
  upload.single("photo"),
  registerUser
);

router.get("/all-users", getUsers);
router.get(
  "/all-staff",
  authenticateToken,
  roleBasedAccess(["admin"]),
  getAllStaff
);

export default router;
