import { Router } from "express";
import { authenticateUser } from "../middleware/index.js";
import { getSurveyStatistics } from "../controller/responseStats.js";

const router = Router();

router.get(
  "/surveys/:id/statistics",
  authenticateUser,
  getSurveyStatistics
);

export default router;
