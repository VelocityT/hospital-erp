import express from "express";
import {
  createOrUpdateWardTypes,
  getAllWardTypes,
  createWard,
  updateWard,
  getAllWards,
  createBeds,
  getBedsByWardId,
  deleteWard,
  deleteLastBed
} from "../controllers/ward.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { roleBasedAccess } from "../middlewares/roleBaseAccess.middleare.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/all", getAllWards);
router.get("/beds/:wardId",getBedsByWardId)
router.get("/wardTypes/all", getAllWardTypes);


//admin protected routes
router.use(roleBasedAccess(["admin"]));
router.post("/wardTypes/create", createOrUpdateWardTypes);
router.post("/create", createWard);
router.put("/update/:id", updateWard);

router.post("/create-beds",createBeds)
router.delete("/delete/:id", deleteWard);
router.delete("/delete-last-bed/:wardId", deleteLastBed);



export default router;
