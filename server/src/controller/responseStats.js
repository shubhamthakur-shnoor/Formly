
import { getSurveyById } from "../db/survey.js";
import { getSurveyResponseStats } from "../db/response.js";

export async function getSurveyStatistics(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Ensure the survey belongs to the logged in user.
    const survey = await getSurveyById(id, userId);

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }

    const statistics = await getSurveyResponseStats(survey.survey_id);
    return res.status(200).json({
      message: "Survey statistics fetched successfully",
      survey: {
        survey_id: survey.survey_id,
        title: survey.title,
        slug: survey.slug,
      },
      statistics,
    });
  } catch (error) {
    console.error("Survey statistics error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
