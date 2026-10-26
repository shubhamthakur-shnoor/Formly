
import { submitResponseSchema } from "../utils/validator.js";
import {
  validateRespondent,
  validateAnswers,
} from "../utils/responseValidator.js";
import { getPublishedSurveyBySlug } from "../db/survey.js";
import { getPublicQuestionsBySurvey } from "../db/question.js";
import { createSurveyResponse } from "../db/response.js";

export async function submitPublicResponse(req, res) {
  try {
    // Validate request body.
    const parsed = submitResponseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid submission data",
        errors: parsed.error.issues,
      });
    }
    const data = parsed.data;
    // Find published survey within its availability dates.
    const survey = await getPublishedSurveyBySlug(req.params.slug);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found or not currently available",
      });
    }

    // Validate respondent identity.
    const respondentError = validateRespondent(survey, data);

    if (respondentError) {
      return res.status(400).json({
        message: respondentError,
      });
    }

    // Fetch and validate questions and answers.
    const questions = await getPublicQuestionsBySurvey(
      survey.survey_id
    );

    const validation = validateAnswers(data.answers, questions);

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    // Anonymous responses do not store identity details.
    const respondentName = survey.is_anonymous
      ? null
      : data.respondent_name ?? null;

    const respondentEmail = survey.is_anonymous
      ? null
      : data.respondent_email?.trim().toLowerCase() ?? null;

    const respondentToken = survey.is_anonymous
      ? data.respondent_token
      : null;

    // Save response and answers.
    const response = await createSurveyResponse(
      survey.survey_id,
      respondentName,
      respondentEmail,
      respondentToken,
      validation.answers
    );

    return res.status(201).json({
      message: "Response submitted successfully",
      response,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "You have already submitted a response to this survey",
      });
    }

    console.error("Submit response error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
