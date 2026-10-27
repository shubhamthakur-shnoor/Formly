
import { getSurveyById } from "../db/survey.js";
import { getSurveyResponsesForExport } from "../db/response.js";
import { convertToCsv } from "../utils/csvConverter.js";

export async function exportSurveyResponses(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Check survey owner
    const survey = await getSurveyById(id, userId);
    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }
    // Fetch responses.
    const rows = await getSurveyResponsesForExport(survey.survey_id);
    const csv = convertToCsv(rows);

    const filename = `survey-${survey.survey_id}-responses.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    return res.status(200).send("\uFEFF" + csv);
  } catch (error) {
    console.error("Survey CSV export error:", error.stack);

    return res.status(500).json({
      message: "Failed to export survey responses",
    });
  }
}
