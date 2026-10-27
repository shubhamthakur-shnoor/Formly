
import { questionSchema } from "../utils/validator.js";
import {
  createQuestion,
  getQuestionsBySurvey,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} from "../db/question.js";
import { getSurveyById } from "../db/survey.js";

export async function createQuestionController(req, res) {
  try {
    const data = questionSchema.parse(req.body);
    const survey = await getSurveyById(req.params.id, req.user.userId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const question = await createQuestion(
      survey.survey_id,
      data.question_text,
      data.question_type,
      data.is_required,
      data.question_order,
      data.options
    );

    return res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.issues });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Question order already exists in this survey",
      });
    }

    console.error("Create question error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listQuestions(req, res) {
  try {
    const survey = await getSurveyById(req.params.id, req.user.userId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const questions = await getQuestionsBySurvey(survey.survey_id);
    return res.json({ questions });
  } catch (error) {
    console.error("List questions error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeQuestion(req, res) {
  try {
    const question = await getQuestionById(
      req.params.questionId,
      req.user.userId
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await deleteQuestion(question.question_id, req.user.userId);

    return res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete question error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function editQuestion(req, res) {
  try {
    const data = questionSchema.parse(req.body);

    const question = await updateQuestion(
      req.params.questionId,
      req.user.userId,
      data.question_text,
      data.question_type,
      data.is_required,
      data.question_order,
      data.options
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.json({
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.issues });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Question order already exists in this survey",
      });
    }

    console.error("Update question error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
