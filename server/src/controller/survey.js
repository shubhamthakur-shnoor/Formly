import { createSurvey, getSurveysByUser, getSurveyById, updateSurvey, deleteSurvey, updateSurveyStatus,getPublicSurveys} from "../db/survey.js";
import { generateSlug } from "../utils/slug.js";
import { surveyStatusSchema } from "../utils/validator.js";

export async function createSurveyController(req, res) {
  const {
    title,
    description,
    is_anonymous = true,
    start_at,
    end_at,
  } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Survey title is required" });
  }

  if (start_at && end_at && new Date(end_at) <= new Date(start_at)) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  try {
    const slug = generateSlug(title);

    const survey = await createSurvey(
      req.user.userId,
      title.trim(),
      slug,
      description,
      is_anonymous,
      start_at,
      end_at
    );

    return res.status(201).json({
      message: "Survey created successfully",
      survey,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Survey title or slug already exists",
      });
    }

    console.error("Create survey error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listSurveys(req, res) {
  try {
    const surveys = await getSurveysByUser(req.user.userId);
    return res.json({ surveys });
  } catch (error) {
    console.error("List surveys error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSurvey(req, res) {
  try {
    const survey = await getSurveyById(
      req.params.id,
      req.user.userId
    );

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.json({ survey });
  } catch (error) {
    console.error("Get survey error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function editSurvey(req, res) {
  const {
    title,
    description,
    is_anonymous,
    start_at,
    end_at,
  } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Survey title is required" });
  }

  if (start_at && end_at && new Date(end_at) <= new Date(start_at)) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  try {
    const survey = await updateSurvey(
      req.params.id,
      req.user.userId,
      title.trim(),
      generateSlug(title),
      description,
      is_anonymous,
      start_at,
      end_at
    );

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.json({ message: "Survey updated successfully", survey });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Survey title or slug already exists",
      });
    }

    console.error("Update survey error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeSurvey(req, res) {
  try {
    const survey = await deleteSurvey(req.params.id, req.user.userId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error("Delete survey error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// update survey status 
export async function changeSurveyStatus(req, res) {
  try {
    const { status } = surveyStatusSchema.parse(req.body);
    const survey = await updateSurveyStatus(
      req.params.id,
      req.user.userId,
      status
    );

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.json({
      message: `Survey ${status.toLowerCase()} successfully`,
      survey,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.issues });
    }

    console.error("Change survey status error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function listPublicSurveys(req, res) { // fetch all the surveys
  try {
    const surveys = await getPublicSurveys();
    return res.json({ surveys });
  } catch (error) {
    console.error("List public surveys error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}