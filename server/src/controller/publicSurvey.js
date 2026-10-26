
import { getPublishedSurveyBySlug } from "../db/survey.js";
import { getPublicQuestionsBySurvey } from "../db/question.js";

export async function getPublicSurvey(req, res) {
  try {
    const survey = await getPublishedSurveyBySlug(req.params.slug);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found or not currently available",
      });
    }

    const questions = await getPublicQuestionsBySurvey(
      survey.survey_id
    );

    return res.json({
      survey: {
        title: survey.title,
        slug: survey.slug,
        description: survey.description,
        is_anonymous: survey.is_anonymous,
        start_at: survey.start_at,
        end_at: survey.end_at,
      },
      questions,
    });
  } catch (error) {
    console.error("Public survey error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
