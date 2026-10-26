import { Router } from "express";
import { authenticateUser } from "../middleware/index.js";
import { createSurveyController, listSurveys, getSurvey, editSurvey, removeSurvey } from "../controller/survey.js";

const router = Router();
router.use(authenticateUser);

router.post("/", createSurveyController);
router.get("/", listSurveys);
router.get("/:id", getSurvey);
router.put("/:id", editSurvey);
router.delete("/:id", removeSurvey);

export default router;