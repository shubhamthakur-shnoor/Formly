import { Router } from "express";
import { getPublicSurvey } from "../controller/publicSurvey.js";

const router = Router();

router.get("/:slug", getPublicSurvey);

export default router;