import { Router } from "express";
import { authenticateUser } from "../middleware/index.js";
import { createSurveyController, listSurveys,listPublicSurveys, getSurvey, editSurvey, removeSurvey, changeSurveyStatus } from "../controller/survey.js";

const router = Router();
router.get("/public", listPublicSurveys);
router.use(authenticateUser);

router.post("/", createSurveyController);
router.get("/", listSurveys);
router.get("/:id", getSurvey);
router.put("/:id", editSurvey);
router.patch("/:id/status", changeSurveyStatus);
router.delete("/:id", removeSurvey);

export default router;