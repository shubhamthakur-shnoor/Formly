import { submitResponseSchema } from "../utils/validator.js";
import {
  validateRespondent,
  validateAnswers,
} from "../utils/responseValidator.js";
import { getPublishedSurveyBySlug } from "../db/survey.js";
import { getPublicQuestionsBySurvey } from "../db/question.js";
import { createSurveyResponse, hasExistingEmailResponse } from "../db/response.js";

import { findRespondentById } from "../db/authDB.js";
import { authenticateUser } from "../middleware/index.js";

async function processSubmission(req, res, survey, data) {
  try {
    const isLoginRequired = survey.login_required;
    const isAuthenticatedRespondent =
      req.user?.userType === "RESPONDENT";

    // Validate respondent identity.
    if (!isLoginRequired) {
      const respondentError = validateRespondent(survey, data);

      if (respondentError) {
        return res.status(400).json({
          message: respondentError,
        });
      }
    }

    // Get authenticated respondent details from database.
    let respondentId = null;
    let authenticatedRespondent = null;

    if (isAuthenticatedRespondent) {
      authenticatedRespondent = await findRespondentById(
        req.user.respondentId
      );

      if (!authenticatedRespondent) {
        return res.status(401).json({
          message: "Respondent account not found",
        });
      }

      respondentId = authenticatedRespondent.respondent_id;
    }

    // Login-required anonymous surveys still use the existing
    // respondent token for duplicate submission prevention.
    if (
      isLoginRequired &&
      survey.is_anonymous &&
      !data.respondent_token
    ) {
      return res.status(400).json({
        message: "Submission token is required for anonymous surveys",
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

    // Determine respondent identity.
    let respondentName = null;
    let respondentEmail = null;
    let respondentToken = null;

    if (survey.is_anonymous) {
      // Keep identity private, even for logged-in respondents.
      respondentToken = data.respondent_token;
    } else if (authenticatedRespondent) {
      // For authenticated respondents, trust database identity.
      respondentName = authenticatedRespondent.full_name;
      respondentEmail = authenticatedRespondent.email
        .trim()
        .toLowerCase();
    } else {
      // Preserve existing public non-anonymous behaviour.
      respondentName = data.respondent_name ?? null;
      respondentEmail = data.respondent_email
        ?.trim()
        .toLowerCase() ?? null;
    }

    // Prevent duplicate email submissions for identified surveys.
    if (!survey.is_anonymous && respondentEmail) {
      const alreadySubmitted = await hasExistingEmailResponse(
        survey.survey_id,
        respondentEmail
      );

      if (alreadySubmitted) {
        return res.status(409).json({
          message: "You have already submitted a response to this survey.",
          code: "DUPLICATE_RESPONSE",
        });
      }
    }

    // Save response and answers.
    const response = await createSurveyResponse(
      survey.survey_id,
      respondentId,
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
    console.error("Process response error:", error);

    if (
      error.code === "23505" &&
      error.constraint === "unique_survey_respondent_token"
    ) {
      return res.status(409).json({
        message: "You have already submitted a response to this survey.",
        code: "DUPLICATE_RESPONSE",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Submit Public or Login-required Survey Response
export async function submitPublicResponse(req, res) {
  try {
    const parsed = submitResponseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid submission data",
        errors: parsed.error.issues,
      });
    }

    const data = parsed.data;
    const survey = await getPublishedSurveyBySlug(req.params.slug);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found or not currently available",
      });
    }

    const hasAuthorizationHeader = Boolean(
      req.headers.authorization
    );

    if (survey.login_required && !hasAuthorizationHeader) {
      return res.status(401).json({
        message: "Please sign in to participate in this survey",
        code: "LOGIN_REQUIRED",
      });
    }

    if (survey.login_required || hasAuthorizationHeader) {
      return authenticateUser(req, res, async () => {
        if (req.user.userType !== "RESPONDENT") {
          return res.status(403).json({
            message: "Only respondents can participate in this survey",
          });
        }

        await processSubmission(req, res, survey, data);
      });
    }

    // Public visitor without authentication.
    return processSubmission(req, res, survey, data);
  } catch (error) {
    console.error("Submit response error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
