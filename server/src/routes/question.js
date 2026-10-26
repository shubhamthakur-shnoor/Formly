
import { Router } from "express";
import { authenticateUser } from "../middleware/index.js";
import {
  createQuestionController,
  listQuestions,
  removeQuestion,
  editQuestion,
} from "../controller/question.js";

const router = Router();

router.use(authenticateUser);

router.post("/surveys/:id/questions", createQuestionController);
router.get("/surveys/:id/questions", listQuestions);
router.put("/questions/:questionId", editQuestion);
router.delete("/questions/:questionId", removeQuestion);

export default router;
