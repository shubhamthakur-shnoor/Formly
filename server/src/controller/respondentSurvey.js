
import { getAvailableSurveysForRespondent } from "../db/survey.js";
import { getRespondentSubmissions, getRespondentSubmissionDetail } from "../db/response.js";

// Get Available Surveys
export async function getAvailableSurveys(req, res) {
  try {
    const surveys = await getAvailableSurveysForRespondent();

    return res.status(200).json({
      message: "Available surveys fetched successfully",
      surveys,
    });
  } catch (error) {
    console.error("Available surveys error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get My Submissions
export async function getMySubmissions(req, res) {
  try {
    const respondentId = req.user.respondentId;

    const submissions = await getRespondentSubmissions(respondentId);

    return res.status(200).json({
      message: "My submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("My submissions error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get Single Submission Details
export async function getMySubmissionDetail(req, res) {
  try {
    const respondentId = req.user.respondentId;
    const { responseId } = req.params;

    if (!/^\d+$/.test(responseId)) {
      return res.status(400).json({
        message: "Invalid response ID",
      });
    }

    const submission = await getRespondentSubmissionDetail(
      responseId,
      respondentId
    );

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      message: "Submission details fetched successfully",
      submission,
    });
  } catch (error) {
    console.error("Submission detail error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}