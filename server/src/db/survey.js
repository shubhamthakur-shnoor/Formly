import { pool } from "../config/db.js";

export async function createSurvey(userId, title, slug, description, isAnonymous, startAt, endAt) {
  const { rows } = await pool.query(
    `INSERT INTO surveys
      (user_id, title, slug, description, is_anonymous, start_at, end_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userId,
      title,
      slug,
      description || null,
      isAnonymous, 
      startAt || null,
      endAt || null,
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

export async function updateSurvey( surveyId, userId, title, slug, description, isAnonymous, startAt, endAt ) {
  const { rows } = await pool.query(
    `UPDATE surveys
     SET title = $1,
         slug = $2,
         description = $3,
         is_anonymous = $4,
         start_at = $5,
         end_at = $6,
         updated_at = NOW()
     WHERE survey_id = $7 AND user_id = $8
     RETURNING *`,
    [
      title,
      slug,
      description || null,
      isAnonymous,
      startAt || null,
      endAt || null,
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