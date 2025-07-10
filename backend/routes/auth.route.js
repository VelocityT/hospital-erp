import express from 'express';
import { getDashboardStatsData, getIncomeOverview, loginUser,logoutUser } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/login",loginUser)
router.get("/logout",logoutUser)

router.use(authenticateToken)
router.get("/dashboard/static-data",getDashboardStatsData)
router.get("/income/overview",getIncomeOverview)



export default router;
