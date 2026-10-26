import { pool } from "../config/db.js";
export async function createSurveyResponse(
  surveyId,
  respondentName,
  respondentEmail,
  respondentToken,
  answers
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Save the response and its unique submission token.
    const { rows } = await client.query(
      `INSERT INTO responses (
        survey_id,
        respondent_name,
        respondent_email,
        respondent_token
      )
      VALUES ($1, $2, $3, $4)
      RETURNING response_id, survey_id, submitted_at`,
      [
        surveyId,
        respondentName,
        respondentEmail,
        respondentToken ?? null,
      ]
    );
    const response = rows[0];
    // Save all answers under the newly created response.
    for (const answer of answers) {
      await client.query(
        `INSERT INTO answers (
          response_id,
          question_id,
          text_answer,
          selected_option_id,
          rating_score
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          response.response_id,
          answer.question_id,
          answer.text_answer ?? null,
          answer.selected_option_id ?? null,
          answer.rating_score ?? null,
        ]
      );
    }
    await client.query("COMMIT");

    return response;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
