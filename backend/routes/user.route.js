import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";
import upload from "../middlewares/multer.js";
import { registerUser, getUsers,getAllStaff } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/register",
  authenticateToken,
  roleBasedAccess(["admin"]),
  upload.single("photo"),
  registerUser
);

router.get("/", getUsers);
router.get(
  "/staff",
  authenticateToken,
  roleBasedAccess(["admin"]),
  getAllStaff
);

export default router;
