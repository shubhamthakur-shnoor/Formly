import { Router } from "express";
import { authenticateUser } from "../middleware/index.js";
import { exportSurveyResponses } from "../controller/responseExport.js";

const router = Router();

router.get(
  "/surveys/:id/export",
  authenticateUser,
  exportSurveyResponses
);

export default router;
