
import { Router } from "express";
import { submitPublicResponse } from "../controller/response.js";

const router = Router();

router.post("/:slug/responses", submitPublicResponse);

export default router;
