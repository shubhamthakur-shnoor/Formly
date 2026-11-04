import { Router } from "express";
import { authenticateRespondent } from "../middleware/index.js";

import { getAvailableSurveys, getMySubmissions, getMySubmissionDetail } from "../controller/respondentSurvey.js";

const router = Router();

router.use(authenticateRespondent);

router.get("/available", getAvailableSurveys);
router.get("/my-submissions", getMySubmissions);
router.get("/my-submissions/:responseId", getMySubmissionDetail);

export default router;
