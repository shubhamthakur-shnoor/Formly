import { pool } from "../config/db.js";
export async function createSurvey(
  userId,
  title,
  slug,
  description,
  isAnonymous,
  startAt,
  endAt,
  loginRequired = false,
  visibleToEndUsers = false
) {
  const { rows } = await pool.query(
    `INSERT INTO surveys
      (
        user_id,
        title,
        slug,
        description,
        is_anonymous,
        start_at,
        end_at,
        login_required,
        visible_to_end_users
      )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      userId,
      title,
      slug,
      description || null,
      isAnonymous,
      startAt || null,
      endAt || null,
      loginRequired,
      visibleToEndUsers,
    ]
  );

  return rows[0];
}

export async function getSurveysByUser(userId) {
  const { rows } = await pool.query(
    `SELECT *
     FROM surveys
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

export async function getSurveyById(surveyId, userId) {
  const { rows } = await pool.query(
    `SELECT *
     FROM surveys
     WHERE survey_id = $1 AND user_id = $2`,
    [surveyId, userId]
  );

  return rows[0] || null;
}

export async function updateSurvey(
  surveyId,
  userId,
  title,
  slug,
  description,
  isAnonymous,
  startAt,
  endAt,
  loginRequired = false,
  visibleToEndUsers = false
) {
  const { rows } = await pool.query(
    `UPDATE surveys
     SET title = $1,
         slug = $2,
         description = $3,
         is_anonymous = $4,
         start_at = $5,
         end_at = $6,
         login_required = $7,
         visible_to_end_users = $8,
         updated_at = NOW()
     WHERE survey_id = $9 AND user_id = $10
     RETURNING *`,
    [
      title,
      slug,
      description || null,
      isAnonymous,
      startAt || null,
      endAt || null,
      loginRequired,
      visibleToEndUsers,
      surveyId,
      userId,
    ]
  );

  return rows[0] || null;
}

export async function deleteSurvey(surveyId, userId) {
  const { rows } = await pool.query(
    `DELETE FROM surveys
     WHERE survey_id = $1 AND user_id = $2
     RETURNING survey_id`,
    [surveyId, userId]
  );

  return rows[0] || null;
}

export async function updateSurveyStatus(surveyId, userId, status) {
  const { rows } = await pool.query(
    `UPDATE surveys
     SET status = $1, updated_at = NOW()
     WHERE survey_id = $2 AND user_id = $3
     RETURNING *`,
    [status, surveyId, userId]
  );

  return rows[0] || null;
}

export async function getPublishedSurveyBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT
       survey_id,
       title,
       slug,
       description,
       is_anonymous,
       login_required,
       visible_to_end_users,
       start_at,
       end_at,
       status
     FROM surveys
     WHERE slug = $1
       AND status = 'PUBLISHED'
       AND (start_at IS NULL OR start_at <= NOW())
       AND (end_at IS NULL OR end_at > NOW())`,
    [slug]
  );

  return rows[0] || null;
}

export async function getPublicSurveys() {
  const { rows } = await pool.query(
    `SELECT
       survey_id,
       title,
       slug,
       description,
       is_anonymous,
       login_required,
       visible_to_end_users,
       start_at,
       end_at,
       created_at
     FROM surveys
     WHERE status = 'PUBLISHED'
       AND login_required = FALSE
       AND (start_at IS NULL OR start_at <= NOW())
       AND (end_at IS NULL OR end_at > NOW())
     ORDER BY created_at DESC`
  );

  return rows;
}

// Get surveys available to logged-in respondents
export async function getAvailableSurveysForRespondent() {
  const { rows } = await pool.query(
    `SELECT
       survey_id,
       title,
       slug,
       description,
       is_anonymous,
       login_required,
       visible_to_end_users,
       start_at,
       end_at,
       created_at
     FROM surveys
     WHERE status = 'PUBLISHED'
       AND (
         login_required = FALSE
         OR (
           login_required = TRUE
           AND visible_to_end_users = TRUE
         )
       )
       AND (start_at IS NULL OR start_at <= NOW())
       AND (end_at IS NULL OR end_at > NOW())
     ORDER BY created_at DESC`
  );

  return rows;
}
