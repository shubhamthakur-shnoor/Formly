import { getPublishedSurveyBySlug } from "../db/survey.js";
import { getPublicQuestionsBySurvey } from "../db/question.js";
import { authenticateUser } from "../middleware/index.js";

async function sendSurveyResponse(req, res, survey) {
  try {
    const questions = await getPublicQuestionsBySurvey(
      survey.survey_id
    );

    return res.json({
      survey: {
        title: survey.title,
        slug: survey.slug,
        description: survey.description,
        is_anonymous: survey.is_anonymous,
        login_required: survey.login_required,
        visible_to_end_users: survey.visible_to_end_users,
        start_at: survey.start_at,
        end_at: survey.end_at,
      },
      questions,
    });
  } catch (error) {
    console.error("Public survey questions error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getPublicSurvey(req, res) {
  try {
    const survey = await getPublishedSurveyBySlug(req.params.slug);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found or not currently available",
      });
    }

    // Public surveys can be accessed without authentication
    if (!survey.login_required) {
      return sendSurveyResponse(req, res, survey);
    }

    // Login-required surveys need authentication
    return authenticateUser(req, res, async () => {
      if (req.user.userType !== "RESPONDENT") {
        return res.status(403).json({
          message: "Only logged-in respondents can participate in this survey",
        });
      }

      return sendSurveyResponse(req, res, survey);
    });
  } catch (error) {
    console.error("Public survey error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
