import { pool } from "../config/db.js";
// Create a question with its options
export async function createQuestion(
  surveyId,
  questionText,
  questionType,
  isRequired,
  questionOrder,
  options = []
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO questions
        (survey_id, question_text, question_type, is_required, question_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [surveyId, questionText, questionType, isRequired, questionOrder]
    );

    const question = rows[0];
    const savedOptions = [];

    for (let i = 0; i < options.length; i++) {
      const { rows } = await client.query(
        `INSERT INTO question_options
          (question_id, option_text, option_order)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [question.question_id, options[i], i + 1]
      );
      savedOptions.push(rows[0]);
    }

    await client.query("COMMIT");
    return { ...question, options: savedOptions };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Get all questions and options for a survey
export async function getQuestionsBySurvey(surveyId) {
  const { rows } = await pool.query(
    `SELECT
       q.question_id,
       q.survey_id,
       q.question_text,
       q.question_type,
       q.is_required,
       q.question_order,
       COALESCE(
         json_agg(
           json_build_object(
             'option_id', o.option_id,
             'option_text', o.option_text,
             'option_order', o.option_order
           ) ORDER BY o.option_order
         ) FILTER (WHERE o.option_id IS NOT NULL),
         '[]'
       ) AS options
     FROM questions q
     LEFT JOIN question_options o ON o.question_id = q.question_id
     WHERE q.survey_id = $1
     GROUP BY q.question_id
     ORDER BY q.question_order`,
    [surveyId]
  );

  return rows;
}

// Find a question belonging to a specific admin's survey
export async function getQuestionById(questionId, userId) {
  const { rows } = await pool.query(
    `SELECT q.*
     FROM questions q
     JOIN surveys s ON s.survey_id = q.survey_id
     WHERE q.question_id = $1 AND s.user_id = $2`,
    [questionId, userId]
  );

  return rows[0] || null;
}

export async function deleteQuestion(questionId, userId) {
  const { rows } = await pool.query(
    `DELETE FROM questions q
     USING surveys s
     WHERE q.survey_id = s.survey_id
       AND q.question_id = $1
       AND s.user_id = $2
     RETURNING q.question_id`,
    [questionId, userId]
  );

  return rows[0] || null;
}

export async function updateQuestion( questionId, userId, questionText, questionType, isRequired, questionOrder, options = []) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `UPDATE questions q
       SET question_text = $1,
           question_type = $2,
           is_required = $3,
           question_order = $4
       FROM surveys s
       WHERE q.question_id = $5
         AND q.survey_id = s.survey_id
         AND s.user_id = $6
       RETURNING q.*`,
      [
        questionText,
        questionType,
        isRequired,
        questionOrder,
        questionId,
        userId,
      ]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const question = rows[0];

    await client.query(
      "DELETE FROM question_options WHERE question_id = $1",
      [questionId]
    );

    const savedOptions = [];

    for (let i = 0; i < options.length; i++) {
      const { rows } = await client.query(
        `INSERT INTO question_options
          (question_id, option_text, option_order)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [questionId, options[i], i + 1]
      );

      savedOptions.push(rows[0]);
    }
    await client.query("COMMIT");
    return { ...question, options: savedOptions };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


export async function getPublicQuestionsBySurvey(surveyId) {
  const { rows } = await pool.query(
    `SELECT
       q.question_id,
       q.question_text,
       q.question_type,
       q.is_required,
       q.question_order,
       COALESCE(
         json_agg(
           json_build_object(
             'option_id', o.option_id,
             'option_text', o.option_text,
             'option_order', o.option_order
           ) ORDER BY o.option_order
         ) FILTER (WHERE o.option_id IS NOT NULL),
         '[]'
       ) AS options
     FROM questions q
     LEFT JOIN question_options o
       ON o.question_id = q.question_id
     WHERE q.survey_id = $1
     GROUP BY q.question_id
     ORDER BY q.question_order`,
    [surveyId]
  );

  return rows;
}
